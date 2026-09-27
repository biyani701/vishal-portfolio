import { HttpAgent, type Message, type Tool } from '@ag-ui/client'
import type { AskErrorCode, AskEvent } from './model.ts'

// The wire to the Ask runtime (apps/api /ask; design.md A5). AG-UI's HttpAgent posts the conversation to
// /ask/agent/ask/run and streams back AG-UI events. CopilotKit's React package is not used: it depends on Radix,
// which UF-3 rules out, and the protocol client is all Ask needs. Refusals before a run (rate limit, budget)
// arrive as HTTP errors with a code, which become an AskHttpError here.

export type { Message }

export const ASK_AGENT = 'ask'
export const SUGGEST_AGENT = 'ask-suggest'

export class AskHttpError extends Error {
  override name = 'AskHttpError'
  constructor(
    readonly code: AskErrorCode,
    readonly retryAfterSeconds?: number,
  ) {
    super(code)
  }
}

export interface RunRequest {
  threadId: string
  messages: Message[]
  tools: Tool[]
  context: { description: string; value: string }[]
}

export interface AskTransport {
  /** Streams one run. Resolves with the conversation's messages afterwards; rejects on refusal, abort or network loss. */
  run(request: RunRequest, onEvent: (event: AskEvent) => void, signal: AbortSignal): Promise<Message[]>
  /** Up to three follow-up questions; an empty list if none could be had. */
  suggest(messages: Message[], signal: AbortSignal): Promise<string[]>
}

/** Front-end tools: the runtime passes them to the model, and a call comes back to the page to handle. */
export const DRAFT_TOOL_DEF: Tool = {
  name: 'draft_contact_request',
  description:
    'Proposes a message to Vishal for the visitor to check and send themselves. Nothing is sent until they confirm. Use only what the visitor said and what tools returned.',
  parameters: {
    type: 'object',
    properties: {
      intent: { type: 'string', enum: ['role', 'engagement', 'other'], description: 'A job opportunity, a consulting engagement, or something else' },
      message: { type: 'string', description: 'A short, factual note in the visitor’s voice' },
      name: { type: 'string', description: 'Only if the visitor gave it' },
      email: { type: 'string', description: 'Only if the visitor gave it' },
      omitted: { type: 'string', description: 'What was left out because a lookup failed, if anything' },
    },
    required: ['intent', 'message'],
  },
}

const SUGGEST_TOOL_DEF: Tool = {
  name: 'suggest_questions',
  description: 'Offers the visitor follow-up questions.',
  parameters: { type: 'object', properties: { questions: { type: 'array', items: { type: 'string' }, maxItems: 3 } }, required: ['questions'] },
}

const CODES: Record<string, AskErrorCode> = {
  ask_rate_limited: 'ask_rate_limited',
  ask_budget_exhausted: 'ask_budget_exhausted',
}

/** fetch for HttpAgent: turns a refusal into an AskHttpError the store can read. */
export function refusalAwareFetch(fetcher: typeof globalThis.fetch = globalThis.fetch) {
  return async (url: string, init: RequestInit) => {
    const res = await fetcher(url, init)
    if (res.ok) return res
    const body = (await res.json().catch(() => ({}))) as { error?: string; retryAfterSeconds?: number }
    const code = CODES[body.error ?? ''] ?? (res.status === 429 ? 'ask_rate_limited' : res.status === 503 ? 'ask_unavailable' : 'ask_failed')
    throw new AskHttpError(code, body.retryAfterSeconds ?? (Number(res.headers.get('Retry-After')) || undefined))
  }
}

function suggestionsFrom(args: string, text: string): string[] {
  try {
    const { questions } = JSON.parse(args) as { questions?: unknown }
    if (Array.isArray(questions)) return questions.filter((q): q is string => typeof q === 'string' && q.trim().length > 0)
  } catch {
    // Some models answer in text despite the tool; take its lines instead.
  }
  return text
    .split('\n')
    .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim())
    .filter((line) => line.endsWith('?'))
}

export function httpTransport(runtimeUrl: string, fetcher?: typeof globalThis.fetch): AskTransport {
  const base = runtimeUrl.replace(/\/+$/, '')
  const fetch = refusalAwareFetch(fetcher)

  return {
    async run({ threadId, messages, tools, context }, onEvent, signal) {
      const agent = new HttpAgent({ url: `${base}/agent/${ASK_AGENT}/run`, threadId, initialMessages: messages, fetch })
      const abort = () => agent.abortRun()
      signal.addEventListener('abort', abort)
      try {
        await agent.runAgent({ tools, context }, { onEvent: ({ event }) => onEvent(event as AskEvent) })
        return agent.messages
      } finally {
        signal.removeEventListener('abort', abort)
      }
    },

    async suggest(messages, signal) {
      const agent = new HttpAgent({ url: `${base}/agent/${SUGGEST_AGENT}/suggest`, threadId: crypto.randomUUID(), initialMessages: messages, fetch })
      const abort = () => agent.abortRun()
      signal.addEventListener('abort', abort)
      let args = ''
      let text = ''
      try {
        await agent.runAgent(
          { tools: [SUGGEST_TOOL_DEF] },
          {
            onEvent: ({ event }) => {
              const e = event as AskEvent & { delta?: string }
              if (e.type === 'TOOL_CALL_ARGS') args += e.delta ?? ''
              if (e.type === 'TEXT_MESSAGE_CONTENT') text += e.delta ?? ''
            },
          },
        )
      } catch {
        return []
      } finally {
        signal.removeEventListener('abort', abort)
      }
      return suggestionsFrom(args, text).slice(0, 3)
    },
  }
}
