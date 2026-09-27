// Ask's conversation model (task 11.3; specs/ask-experience). A pure reducer from AG-UI events to turns, so the
// components render from plain data and tests can drive them with a mocked event stream. The server's tools
// return `{ notice, result, sources }` (apps/api src/ai/tools.ts); the answer cites sources by url in square
// brackets, which become numbered footnotes here.

export type Section = 'Experience' | 'Work' | 'About' | 'Home'

export interface Source {
  section: Section
  title: string
  url: string
}

export type StepStatus = 'in-flight' | 'done' | 'failed'

export interface Step {
  id: string
  tool: string
  /** The call's arguments as streamed (JSON text). */
  args: string
  status: StepStatus
  /** The arguments have finished streaming (TOOL_CALL_END), so the step can be described. */
  ready?: boolean
  startedAt: number
  endedAt?: number
  /** The tool's `result`, when it returned one. */
  result?: unknown
  sources: Source[]
}

export type Intent = 'role' | 'engagement' | 'other'

export interface DraftArgs {
  intent: Intent
  message: string
  name?: string
  email?: string
  /** What the agent left out because a lookup failed. */
  omitted?: string
}

export interface Draft {
  toolCallId: string
  args: DraftArgs
  /** editing → sending → sent, or back to editing with sendFailed; dismissed if the visitor declines. */
  state: 'editing' | 'sending' | 'sent' | 'dismissed'
  sendFailed?: boolean
}

/** Codes the server sends (apps/api src/ai/guard.ts, src/ai/ask.ts), plus "network" for a dropped connection. */
export type AskErrorCode = 'ask_rate_limited' | 'ask_budget_exhausted' | 'ask_unavailable' | 'ask_failed' | 'network'

export type TurnStatus =
  /** Waiting for or receiving the answer. */
  | 'streaming'
  | 'complete'
  /** The stream stopped part-way (connection lost, or Stop): the partial answer stays, marked Incomplete. */
  | 'incomplete'
  /** The run failed before an answer. */
  | 'failed'
  /** Ask is unavailable for now: rate limit or daily budget. Search and Contact are offered instead. */
  | 'unavailable'

export interface AskContext {
  /** The page Ask was opened from, e.g. /work/fast-jiraql. */
  url: string
  title: string
  /** A plain description of the page, given to the agent as context. */
  description: string
}

export interface Turn {
  id: string
  question: string
  context?: AskContext
  status: TurnStatus
  stopped?: boolean
  error?: AskErrorCode
  retryAfterSeconds?: number
  text: string
  steps: Step[]
  draft?: Draft
  /** How many AG-UI messages the conversation held before this turn, so a retry can rewind to it. */
  messagesBefore: number
}

// ── Events ──────────────────────────────────────────────────────────────────────────────────────────────────

/** The AG-UI events Ask reads; everything else (state, reasoning, raw) is ignored. */
export type AskEvent =
  | { type: 'RUN_STARTED' }
  | { type: 'TEXT_MESSAGE_CONTENT'; delta: string }
  | { type: 'TOOL_CALL_START'; toolCallId: string; toolCallName: string }
  | { type: 'TOOL_CALL_ARGS'; toolCallId: string; delta: string }
  | { type: 'TOOL_CALL_END'; toolCallId: string }
  | { type: 'TOOL_CALL_RESULT'; toolCallId: string; content: string }
  | { type: 'RUN_FINISHED' }
  | { type: 'RUN_ERROR'; message: string }
  | { type: string; [key: string]: unknown }

export const DRAFT_TOOL = 'draft_contact_request'

const CODES: readonly AskErrorCode[] = ['ask_rate_limited', 'ask_budget_exhausted', 'ask_unavailable', 'ask_failed']
export const errorCode = (message: unknown): AskErrorCode => (CODES.includes(message as AskErrorCode) ? (message as AskErrorCode) : 'ask_failed')

/** Rate limit and budget mean "not now"; the page offers search and Contact rather than a retry. */
export const isUnavailable = (code: AskErrorCode) => code === 'ask_rate_limited' || code === 'ask_budget_exhausted'

function parseResult(content: string): { ok: boolean; result?: unknown; sources: Source[] } {
  try {
    const parsed = JSON.parse(content) as { result?: unknown; sources?: Source[] }
    if (parsed && typeof parsed === 'object' && 'result' in parsed) return { ok: true, result: parsed.result, sources: Array.isArray(parsed.sources) ? parsed.sources : [] }
  } catch {
    // Not a tool result the server made: the tool failed.
  }
  return { ok: false, sources: [] }
}

export function parseDraft(args: string): DraftArgs | undefined {
  try {
    const value = JSON.parse(args) as Partial<DraftArgs>
    if (typeof value.message !== 'string') return undefined
    const intent: Intent = value.intent === 'role' || value.intent === 'engagement' ? value.intent : 'other'
    return {
      intent,
      message: value.message,
      ...(typeof value.name === 'string' && value.name && { name: value.name }),
      ...(typeof value.email === 'string' && value.email && { email: value.email }),
      ...(typeof value.omitted === 'string' && value.omitted && { omitted: value.omitted }),
    }
  } catch {
    return undefined
  }
}

const updateStep = (turn: Turn, id: string, change: (step: Step) => Step): Turn => ({ ...turn, steps: turn.steps.map((step) => (step.id === id ? change(step) : step)) })

/** Applies one event to the turn being answered. */
export function reduce(turn: Turn, event: AskEvent, now: number): Turn {
  switch (event.type) {
    case 'TEXT_MESSAGE_CONTENT':
      return { ...turn, text: turn.text + String(event.delta ?? '') }
    case 'TOOL_CALL_START': {
      const { toolCallId, toolCallName } = event as { toolCallId: string; toolCallName: string }
      if (turn.steps.some((step) => step.id === toolCallId)) return turn
      return { ...turn, steps: [...turn.steps, { id: toolCallId, tool: toolCallName, args: '', status: 'in-flight', startedAt: now, sources: [] }] }
    }
    case 'TOOL_CALL_ARGS': {
      const { toolCallId, delta } = event as { toolCallId: string; delta: string }
      return updateStep(turn, toolCallId, (step) => ({ ...step, args: step.args + delta }))
    }
    case 'TOOL_CALL_END': {
      const { toolCallId } = event as { toolCallId: string }
      const step = turn.steps.find((s) => s.id === toolCallId)
      // The draft is the visitor's to confirm: it becomes a form, not an activity line.
      if (step?.tool === DRAFT_TOOL) {
        const args = parseDraft(step.args)
        const steps = turn.steps.filter((s) => s.id !== toolCallId)
        return args ? { ...turn, steps, draft: { toolCallId, args, state: 'editing' } } : { ...turn, steps }
      }
      return updateStep(turn, toolCallId, (s) => ({ ...s, ready: true }))
    }
    case 'TOOL_CALL_RESULT': {
      const { toolCallId, content } = event as { toolCallId: string; content: string }
      const parsed = parseResult(content)
      return updateStep(turn, toolCallId, (step) => ({ ...step, ready: true, status: parsed.ok ? 'done' : 'failed', endedAt: now, result: parsed.result, sources: parsed.sources }))
    }
    case 'RUN_ERROR': {
      const code = errorCode((event as { message?: unknown }).message)
      return settle(turn, isUnavailable(code) ? 'unavailable' : turn.text ? 'incomplete' : 'failed', now, code)
    }
    case 'RUN_FINISHED':
      return settle(turn, 'complete', now)
    default:
      return turn
  }
}

/** Ends the turn: any step still in flight has failed, since no result will come. */
export function settle(turn: Turn, status: TurnStatus, now: number, error?: AskErrorCode, extra: Partial<Turn> = {}): Turn {
  if (turn.status !== 'streaming') return turn
  return {
    ...turn,
    ...extra,
    status,
    ...(error && { error }),
    steps: turn.steps.map((step) => (step.status === 'in-flight' ? { ...step, status: 'failed', endedAt: now } : step)),
  }
}

// ── Citations and sources ───────────────────────────────────────────────────────────────────────────────────

/** Cited urls in the answer: `[/work/slug]` or `[/experience#id]`, as the prompt asks. */
const CITATION = /\s?\[(\/[^\]\s]*)\]/g

export interface NumberedSource extends Source {
  n: number
  cited: boolean
}

/** Every source the turn's tools returned, deduplicated by url. */
export const consulted = (turn: Turn): Source[] => [...new Map(turn.steps.flatMap((step) => step.sources).map((s) => [s.url, s])).values()]

/**
 * The turn's sources, numbered by first citation. Cited urls the tools never returned are dropped (they can't be
 * shown as sources). If the answer cites nothing, every consulted source is listed, numbered in order.
 */
export function numberSources(turn: Turn): NumberedSource[] {
  const known = new Map(consulted(turn).map((s) => [s.url, s]))
  const order: string[] = []
  for (const [, url] of turn.text.matchAll(CITATION)) if (url && known.has(url) && !order.includes(url)) order.push(url)
  if (!order.length) return [...known.values()].map((s, i) => ({ ...s, n: i + 1, cited: false }))
  return order.map((url, i) => ({ ...known.get(url)!, n: i + 1, cited: true }))
}

export type Segment = { text: string } | { cite: number; url: string }

/** Splits answer text into prose and citation markers; citations to unknown urls are dropped from the prose. */
export function segments(text: string, sources: readonly NumberedSource[]): Segment[] {
  const numbers = new Map(sources.map((s) => [s.url, s.n]))
  const out: Segment[] = []
  let last = 0
  for (const match of text.matchAll(CITATION)) {
    if (match.index > last) out.push({ text: text.slice(last, match.index) })
    const n = numbers.get(match[1]!)
    if (n) out.push({ cite: n, url: match[1]! })
    last = match.index + match[0].length
  }
  if (last < text.length) out.push({ text: text.slice(last) })
  return out
}

/** Plain text for Copy: citations become [n]. */
export function plainAnswer(turn: Turn): string {
  const sources = numberSources(turn)
  return segments(turn.text, sources)
    .map((s) => ('cite' in s ? `[${s.cite}]` : s.text))
    .join('')
    .trim()
}

export const SECTION_ORDER: readonly Section[] = ['Experience', 'Work', 'About', 'Home']

export function groupSources(sources: readonly NumberedSource[]) {
  return SECTION_ORDER.map((section) => ({ section, sources: sources.filter((s) => s.section === section) })).filter((group) => group.sources.length)
}
