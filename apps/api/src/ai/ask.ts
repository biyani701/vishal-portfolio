import type { HandlerHookContext, ToolDefinition } from '@copilotkit/runtime/v2'
import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { clientIp } from '../client-ip.js'
import type { AppEnv, Logger } from '../log.js'
import type { OriginPolicy } from '../origins.js'
import type { RateLimiter } from '../ratelimit.js'
import type { Budget } from './budget.js'
import type { ModelResolver } from './models.js'

// The Ask runtime (design.md A5; tasks 11.1–11.2). CopilotKit's v2 runtime serves the AG-UI endpoints under /ask
// through its Hono adapter, in the same Vercel Node function as the rest of apps/api. Two agents, both CopilotKit
// BuiltInAgents over an OpenAI-compatible chat-completions model (AI_BASE_URL):
// - "ask" answers questions with the read-only tools, on the discovered agent model;
// - "ask-suggest" writes follow-up suggestions (no tools), on the discovered suggestion model.
// Models are whichever discovery selected (src/ai/models.ts), so agents are built per request.
//
// Guards, before the runtime sees a request:
// - only the routes Ask uses: runtime info, and run/connect/stop for "ask", suggest for "ask-suggest". Thread
//   listing, memories, transcription and the inspector are refused, and so is running the suggestion agent directly.
// - per-IP rate limits (AI_RATE_LIMIT_PER_IP_PER_HOUR; suggestions get twice that) and the daily budget; both
//   answer with a code the page turns into "answers are unavailable for now" plus search and Contact.
// - a body limit, which bounds the conversation a client can send.
// Left at the runtime's safe defaults: the client can't override the model or limits, and system or developer
// messages it sends are not forwarded. Threads are kept only as briefly as the runtime needs to stream a run
// (specs/ask-experience "Privacy of conversations"); the conversation itself lives in the browser.
//
// The runtime takes over a second to import, so it loads on the first /ask request rather than with the
// function: /health and /contact share the function and would otherwise pay for it on every cold start.

export const ASK_BASE_PATH = '/ask'
export const ASK_AGENT_ID = 'ask'
export const SUGGEST_AGENT_ID = 'ask-suggest'

/** The largest request body: a long conversation, well short of anything abusive. */
export const ASK_MAX_BODY_BYTES = 96 * 1024

/** CopilotKit's defineTool without importing the runtime (theirs only returns its argument). */
export const defineAskTool = <P extends ToolDefinition['parameters']>(tool: ToolDefinition<P>) => tool

export const SUGGEST_PROMPT =
  'Suggest short follow-up questions a visitor might ask next about the portfolio, based on the conversation so far. Each is under ten words, answerable from a portfolio site (roles, projects, skills, credentials), and never about salary, availability or personal matters.'

export interface AskOptions {
  models: ModelResolver
  baseUrl: string
  apiKey: string
  /** AI_MAX_OUTPUT_TOKENS: the most one answer may generate. */
  maxOutputTokens: number
  origins: OriginPolicy
  prompt: string
  tools: ToolDefinition[]
  budget: Budget
  /** Per-IP limit on questions (AI_RATE_LIMIT_PER_IP_PER_HOUR). */
  limiter: RateLimiter
  /** Per-IP limit on suggestion requests. */
  suggestLimiter: RateLimiter
  log: Logger
  /** Test seam for the provider's HTTP calls. */
  fetch?: typeof globalThis.fetch
}

const refuse = (status: number, error: string, extra: Record<string, unknown> = {}, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify({ error, ...extra }), { status, headers: { 'Content-Type': 'application/json', ...headers } })

/** Runs before every runtime handler: throws a Response to refuse the request. */
export function askGuard({ budget, limiter, suggestLimiter, log }: Pick<AskOptions, 'budget' | 'limiter' | 'suggestLimiter' | 'log'>) {
  return async ({ route, request }: Pick<HandlerHookContext, 'route' | 'request'>) => {
    const allowed =
      route.method === 'info' ||
      ((route.method === 'agent/run' || route.method === 'agent/connect' || route.method === 'agent/stop') && route.agentId === ASK_AGENT_ID) ||
      (route.method === 'agent/suggest' && route.agentId === SUGGEST_AGENT_ID)
    if (!allowed) throw refuse(404, 'not_found')
    if (route.method !== 'agent/run' && route.method !== 'agent/suggest') return

    const ip = clientIp(request.headers)
    // If the store is down, let the question through: Ask failing closed would be worse than a burst.
    const limit = await (route.method === 'agent/run' ? limiter : suggestLimiter).hit(ip).catch((error: unknown) => {
      log.warn('ask rate limit unavailable', { error: (error as Error).name })
      return undefined
    })
    if (limit && !limit.allowed) {
      throw refuse(429, 'ask_rate_limited', { retryAfterSeconds: limit.retryAfterSeconds }, { 'Retry-After': String(limit.retryAfterSeconds) })
    }
    const exhausted = await budget.exhausted().catch((error: unknown) => {
      log.warn('ask budget unavailable', { error: (error as Error).name })
      return false
    })
    if (exhausted) {
      log.warn('ask_budget_exhausted')
      throw refuse(503, 'ask_budget_exhausted')
    }
  }
}

async function loadRuntime(options: AskOptions) {
  const { models, baseUrl, apiKey, maxOutputTokens, origins, prompt, tools, budget, log, fetch } = options
  const [{ createOpenAI }, { BuiltInAgent, CopilotRuntime, InMemoryAgentRunner }, { createCopilotHonoHandler }, { guardModel }] = await Promise.all([
    import('@ai-sdk/openai'),
    import('@copilotkit/runtime/v2'),
    import('@copilotkit/runtime/v2/hono'),
    import('./guard.js'),
  ])
  const provider = createOpenAI({ baseURL: baseUrl, apiKey, ...(fetch && { fetch }) })
  // .chat(): the provider speaks chat completions, not OpenAI's Responses API (the SDK's default).
  const model = (id: string) => guardModel(provider.chat(id), { budget, models, log })

  const runtime = new CopilotRuntime({
    agents: async () => {
      const selection = await models.current()
      return {
        [ASK_AGENT_ID]: new BuiltInAgent({
          model: model(selection.agent),
          prompt,
          tools,
          maxOutputTokens,
          // Enough for a few lookups and the answer; each step is another model call.
          maxSteps: 5,
        }),
        [SUGGEST_AGENT_ID]: new BuiltInAgent({ model: model(selection.suggestions), prompt: SUGGEST_PROMPT, maxOutputTokens: 300, maxSteps: 1 }),
      }
    },
    // The browser sends the whole conversation with each question, so nothing needs to outlive a run here.
    runner: new InMemoryAgentRunner({ maxThreads: 200, maxRunsPerThread: 1, maxBytes: 16 * 1024 ** 2 }),
  })

  return createCopilotHonoHandler({
    runtime,
    basePath: ASK_BASE_PATH,
    // Its own CORS defaults to any origin; keep it to the site's, as for every other route.
    cors: { origin: (origin) => (origins.allows(origin) ? origin : null) },
    hooks: { onBeforeHandler: askGuard(options) },
  })
}

export function askHandler(options: AskOptions) {
  const app = new Hono<AppEnv>()
  let runtime: ReturnType<typeof loadRuntime> | undefined

  const serve = async (request: Request) => {
    runtime ??= loadRuntime(options).catch((error: unknown) => {
      runtime = undefined // try again on the next request
      throw error
    })
    return (await runtime).fetch(request)
  }

  app.use(`${ASK_BASE_PATH}/*`, bodyLimit({ maxSize: ASK_MAX_BODY_BYTES, onError: (c) => c.json({ error: 'too_large' }, 413) }))
  app.all(ASK_BASE_PATH, (c) => serve(c.req.raw))
  app.all(`${ASK_BASE_PATH}/*`, (c) => serve(c.req.raw))
  return app
}
