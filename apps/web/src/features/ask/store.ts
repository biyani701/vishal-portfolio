import { stepSentence } from './copy.ts'
import { consulted, isUnavailable, numberSources, reduce, settle, type AskContext, type DraftArgs, type Turn } from './model.ts'
import { AskHttpError, DRAFT_TOOL_DEF, type AskTransport, type Message } from './transport.ts'

// The Ask conversation (task 11.3–11.5; specs/ask-experience). One store for the session, whichever surface shows
// it (page, bottom drawer, right drawer), so a rotation mid-answer keeps the conversation. It lives only in this
// browser: saved to localStorage, never on the server (specs/ask-experience "Privacy of conversations").

export interface AskState {
  turns: Turn[]
  suggestions: string[]
  /** A question to put in the composer without sending it (the "Ask about this" suggestion); `at` tells prefills apart. */
  pending?: { question: string; context?: AskContext; at: number }
}

export type Announce = (message: string, politeness?: 'polite' | 'assertive') => void

export interface ContactPayload {
  intent: DraftArgs['intent']
  name: string
  email: string
  message: string
}

export interface StoreOptions {
  transport: AskTransport
  /** POST /contact for a confirmed draft; resolves true when the server stored it. */
  sendContact: (payload: ContactPayload) => Promise<boolean>
  announce: Announce
  storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>
  now?: () => number
  id?: () => string
}

const STORAGE_KEY = 'ask:conversation:v1'

interface Saved {
  turns: Turn[]
  messages: Message[]
}

export class AskStore {
  private state: AskState = { turns: [], suggestions: [] }
  private messages: Message[] = []
  private listeners = new Set<() => void>()
  private running?: { turnId: string; controller: AbortController }
  private suggesting?: AbortController
  private readonly now: () => number
  private readonly id: () => string

  constructor(private readonly options: StoreOptions) {
    this.now = options.now ?? Date.now
    this.id = options.id ?? (() => crypto.randomUUID())
    this.restore()
  }

  // ── useSyncExternalStore ──
  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => void this.listeners.delete(listener)
  }
  getSnapshot = () => this.state

  get streaming() {
    return Boolean(this.running)
  }

  private set(change: Partial<AskState>) {
    this.state = { ...this.state, ...change }
    this.listeners.forEach((listener) => listener())
  }

  private setTurn(id: string, change: (turn: Turn) => Turn) {
    this.set({ turns: this.state.turns.map((turn) => (turn.id === id ? change(turn) : turn)) })
  }

  private turn(id: string) {
    return this.state.turns.find((turn) => turn.id === id)
  }

  // ── Persistence ──
  private restore() {
    try {
      const raw = this.options.storage?.getItem(STORAGE_KEY)
      if (!raw) return
      const saved = JSON.parse(raw) as Saved
      if (!Array.isArray(saved.turns) || !Array.isArray(saved.messages)) return
      this.messages = saved.messages
      this.state = { ...this.state, turns: saved.turns }
    } catch {
      // Unreadable or blocked storage: start fresh.
    }
  }

  private save() {
    try {
      const saved: Saved = { turns: this.state.turns, messages: this.messages }
      this.options.storage?.setItem(STORAGE_KEY, JSON.stringify(saved))
    } catch {
      // Storage full or blocked: the conversation still works for this visit.
    }
  }

  // ── Commands ──
  /** Puts a question in the composer, with the page it came from, without sending it. */
  prefill(question: string, context?: AskContext) {
    this.set({ pending: { question, context, at: this.now() } })
  }

  takePending() {
    const { pending } = this.state
    if (pending) this.set({ pending: undefined })
    return pending
  }

  async ask(question: string, context?: AskContext) {
    const text = question.trim()
    if (!text || this.running) return
    this.suggesting?.abort()
    this.closeDrafts()
    const turn: Turn = { id: this.id(), question: text, context, status: 'streaming', text: '', steps: [], messagesBefore: this.messages.length }
    this.messages = [...this.messages, { id: this.id(), role: 'user', content: text }]
    this.set({ turns: [...this.state.turns, turn], suggestions: [], pending: undefined })
    await this.run(turn.id)
  }

  /** Stop while streaming: the partial answer stays, marked Incomplete. */
  stop() {
    this.running?.controller.abort()
  }

  /** Try again / Retry: rewinds to before the turn and asks it again. Only the latest turn can be retried. */
  async retry(turnId: string) {
    const turn = this.turn(turnId)
    if (!turn || this.running || this.state.turns.at(-1)?.id !== turnId) return
    this.messages = this.messages.slice(0, turn.messagesBefore)
    this.set({ turns: this.state.turns.slice(0, -1) })
    await this.ask(turn.question, turn.context)
  }

  clear() {
    this.stop()
    this.suggesting?.abort()
    this.messages = []
    this.set({ turns: [], suggestions: [], pending: undefined })
    try {
      this.options.storage?.removeItem(STORAGE_KEY)
    } catch {
      // Nothing to clear.
    }
  }

  private async run(turnId: string) {
    const controller = new AbortController()
    this.running = { turnId, controller }
    this.say('Answer started')
    const turn = this.turn(turnId)!
    let messages: Message[] | undefined

    try {
      messages = await this.options.transport.run(
        {
          // A fresh thread per run: the whole conversation is sent each time, so the server needs no thread of
          // its own, and a run the server is still finishing (the page lost the connection) can't refuse this one.
          threadId: this.id(),
          messages: this.messages,
          tools: [DRAFT_TOOL_DEF],
          context: turn.context ? [{ description: 'The visitor opened Ask from this page of the site', value: `${turn.context.title} (${turn.context.url}): ${turn.context.description}` }] : [],
        },
        (event) => {
          const before = this.turn(turnId)
          if (!before) return
          const after = reduce(before, event, this.now())
          if (after !== before) {
            this.announceSteps(before, after)
            this.setTurn(turnId, () => after)
          }
        },
        controller.signal,
      )
    } catch (error) {
      const now = this.now()
      if (controller.signal.aborted) this.setTurn(turnId, (t) => settle(t, 'incomplete', now, undefined, { stopped: true }))
      else if (error instanceof AskHttpError) {
        const status = isUnavailable(error.code) ? 'unavailable' : 'failed'
        this.setTurn(turnId, (t) => settle(t, status, now, error.code, error.retryAfterSeconds ? { retryAfterSeconds: error.retryAfterSeconds } : {}))
      } else this.setTurn(turnId, (t) => settle(t, t.text ? 'incomplete' : 'failed', now, 'network'))
    } finally {
      this.running = undefined
    }

    // RUN_FINISHED or RUN_ERROR settles the turn. A stream that ended without either was cut off, not answered.
    const settled = this.turn(turnId)!
    if (settled.status === 'streaming') {
      const now = this.now()
      if (controller.signal.aborted) this.setTurn(turnId, (t) => settle(t, 'incomplete', now, undefined, { stopped: true }))
      else this.setTurn(turnId, (t) => settle(t, t.text ? 'incomplete' : 'failed', now, 'network'))
    }
    const final = this.turn(turnId)!
    if (messages && final.status === 'complete') this.messages = messages
    else this.messages = this.messages.slice(0, final.messagesBefore)
    // A failed or cut-off turn leaves the history as it was, so Try again starts clean; it stays on screen only.
    this.save()
    this.announceEnd(final)
    if (final.status === 'complete' && !final.draft) void this.fetchSuggestions()
  }

  // ── Draft (outward action) ──
  updateDraft(turnId: string, args: DraftArgs) {
    this.setTurn(turnId, (t) => (t.draft ? { ...t, draft: { ...t.draft, args } } : t))
  }

  dismissDraft(turnId: string) {
    this.setTurn(turnId, (t) => (t.draft ? { ...t, draft: { ...t.draft, state: 'dismissed' } } : t))
    this.save()
  }

  /** "Send request": posts through /contact. On failure the values stay and the form offers Try again. */
  async sendDraft(turnId: string, payload: ContactPayload) {
    const turn = this.turn(turnId)
    if (!turn?.draft || turn.draft.state === 'sending' || turn.draft.state === 'sent') return
    this.setTurn(turnId, (t) => ({ ...t, draft: { ...t.draft!, args: { ...t.draft!.args, ...payload }, state: 'sending', sendFailed: false } }))
    const ok = await this.options.sendContact(payload).catch(() => false)
    this.setTurn(turnId, (t) => ({ ...t, draft: { ...t.draft!, state: ok ? 'sent' : 'editing', sendFailed: !ok } }))
    this.save()
    if (ok) this.say('Request sent')
    else this.say('Couldn’t send your request. Your note is kept. Nothing was sent.', 'assertive')
  }

  /** Every tool call needs a result before the next question, so a draft's outcome is recorded when the visitor moves on. */
  private closeDrafts() {
    const answered = new Set(this.messages.filter((m) => m.role === 'tool').map((m) => (m as { toolCallId: string }).toolCallId))
    for (const turn of this.state.turns) {
      const draft = turn.draft
      if (!draft || answered.has(draft.toolCallId)) continue
      if (!this.messages.some((m) => m.role === 'assistant' && (m as { toolCalls?: { id: string }[] }).toolCalls?.some((c) => c.id === draft.toolCallId))) continue
      const status = draft.state === 'sent' ? 'sent' : 'not_sent'
      this.messages = [...this.messages, { id: this.id(), role: 'tool', toolCallId: draft.toolCallId, content: JSON.stringify({ status }) }]
      if (draft.state === 'editing') this.setTurn(turn.id, (t) => ({ ...t, draft: { ...t.draft!, state: 'dismissed' } }))
    }
  }

  // ── Suggestions ──
  private async fetchSuggestions() {
    this.suggesting?.abort()
    const controller = new AbortController()
    this.suggesting = controller
    // Only the visible conversation: questions and answers, no tool traffic.
    const history = this.state.turns
      .filter((t) => t.status === 'complete')
      .slice(-3)
      .flatMap((t): Message[] => [
        { id: `${t.id}:q`, role: 'user', content: t.question },
        { id: `${t.id}:a`, role: 'assistant', content: t.text },
      ])
    const suggestions = await this.options.transport.suggest(history, controller.signal).catch(() => [])
    if (!controller.signal.aborted && !this.running) this.set({ suggestions })
  }

  // ── Announcements (task 11.5): statuses, never tokens ──
  /** Polite unless stated: the announcer's own default is assertive, which would interrupt the reader. */
  private say(message: string, politeness: 'polite' | 'assertive' = 'polite') {
    this.options.announce(message, politeness)
  }

  private announceSteps(before: Turn, after: Turn) {
    for (const step of after.steps) {
      const previous = before.steps.find((s) => s.id === step.id)
      // Described once its arguments are in (the sentence names the role or project), then on each status change.
      if (step.ready && !previous?.ready && step.status === 'in-flight') this.say(stepSentence(step))
      else if (previous && previous.status !== step.status) this.say(`${stepSentence(step)}${step.status === 'failed' ? '. Failed' : ''}`)
    }
    if (!before.draft && after.draft) this.say('A contact request is ready for you to check')
  }

  private announceEnd(turn: Turn) {
    switch (turn.status) {
      case 'complete': {
        const n = turn.text ? numberSources(turn).length : consulted(turn).length
        this.say(`Answer complete, ${n} ${n === 1 ? 'source' : 'sources'}`)
        break
      }
      case 'incomplete':
        this.say(turn.stopped ? 'Answer stopped. The partial answer is kept.' : 'Answer incomplete. The connection dropped.')
        break
      case 'failed':
        this.say('The answer failed.', 'assertive')
        break
      case 'unavailable':
        this.say('Answers are unavailable for now.', 'assertive')
        break
    }
  }
}
