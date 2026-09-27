import { describe, expect, it, vi } from 'vitest'
import { groupSources, numberSources, plainAnswer, segments, type AskEvent } from './model.ts'
import { AskStore, type StoreOptions } from './store.ts'
import { AskHttpError, type AskTransport, type Message, type RunRequest } from './transport.ts'

// Tasks 11.3–11.5: the conversation store and model, driven by mocked AG-UI event streams.

const result = (value: unknown, sources: { section: string; title: string; url: string }[]) =>
  JSON.stringify({ notice: 'Published site content…', result: value, sources })

const toolRun = (id: string, name: string, args: string, content?: string): AskEvent[] => [
  { type: 'TOOL_CALL_START', toolCallId: id, toolCallName: name },
  { type: 'TOOL_CALL_ARGS', toolCallId: id, delta: args.slice(0, 5) },
  { type: 'TOOL_CALL_ARGS', toolCallId: id, delta: args.slice(5) },
  { type: 'TOOL_CALL_END', toolCallId: id },
  ...(content === undefined ? [] : [{ type: 'TOOL_CALL_RESULT', toolCallId: id, content } as AskEvent]),
]

const text = (...deltas: string[]): AskEvent[] => deltas.map((delta) => ({ type: 'TEXT_MESSAGE_CONTENT', delta }))

const WORK = { section: 'Work', title: 'Fast-JiraQL', url: '/work/fast-jiraql' }
const ROLE = { section: 'Experience', title: 'Principal Project Analyst · CoreCard', url: '/experience#corecard' }

type Script = (request: RunRequest, emit: (event: AskEvent) => void, signal: AbortSignal) => Promise<Message[]>

function fakeTransport(scripts: Script[], suggestions: string[] = ['What did he build?']) {
  const requests: RunRequest[] = []
  const transport: AskTransport = {
    run: vi.fn(async (request, onEvent, signal) => {
      requests.push(structuredClone(request))
      return scripts[requests.length - 1]!(request, onEvent, signal)
    }),
    suggest: vi.fn(async () => suggestions),
  }
  return { transport, requests }
}

/** A run that emits these events and finishes, returning the history plus an assistant reply. */
const emits =
  (...events: AskEvent[]): Script =>
  async (request, emit) => {
    emit({ type: 'RUN_STARTED' })
    events.forEach(emit)
    emit({ type: 'RUN_FINISHED' })
    return [...request.messages, { id: 'a', role: 'assistant', content: 'answer' }]
  }

function setup(scripts: Script[], options: Partial<StoreOptions> = {}) {
  const { transport, requests } = fakeTransport(scripts)
  const announce = vi.fn()
  const sendContact = vi.fn(async () => true)
  let n = 0
  let clock = 1000
  const store = new AskStore({ transport, announce, sendContact, id: () => `id${++n}`, now: () => (clock += 250), ...options })
  return { store, transport, requests, announce, sendContact }
}

describe('AskStore', () => {
  it('turns a streamed run into steps, an answer and numbered, grouped sources', async () => {
    const { store, announce } = setup([
      emits(
        ...toolRun('t1', 'get_experience', '{"role_id":"corecard"}', result({ roles: [{ id: 'corecard' }] }, [ROLE])),
        ...toolRun('t2', 'get_project', '{"slug":"fast-jiraql"}', result({ found: true }, [WORK])),
        ...text('He built Fast-JiraQL [/work/fast-jiraql]', ' while leading the PMO [/experience#corecard].', ' Again [/work/fast-jiraql].'),
      ),
    ])
    await store.ask('What did he build?')
    const [turn] = store.getSnapshot().turns
    expect(turn).toMatchObject({ status: 'complete', question: 'What did he build?' })
    expect(turn!.steps.map((s) => [s.tool, s.status])).toEqual([
      ['get_experience', 'done'],
      ['get_project', 'done'],
    ])
    expect(turn!.steps[0]!.args).toBe('{"role_id":"corecard"}')
    expect(turn!.steps[0]!.endedAt! - turn!.steps[0]!.startedAt).toBeGreaterThan(0)

    // Numbered by first citation, not by lookup order.
    const sources = numberSources(turn!)
    expect(sources.map((s) => [s.n, s.url])).toEqual([
      [1, '/work/fast-jiraql'],
      [2, '/experience#corecard'],
    ])
    expect(groupSources(sources).map((g) => g.section)).toEqual(['Experience', 'Work'])
    expect(segments(turn!.text, sources).filter((s) => 'cite' in s)).toEqual([
      { cite: 1, url: '/work/fast-jiraql' },
      { cite: 2, url: '/experience#corecard' },
      { cite: 1, url: '/work/fast-jiraql' },
    ])
    expect(plainAnswer(turn!)).toBe('He built Fast-JiraQL[1] while leading the PMO[2]. Again[1].')

    // Statuses are announced; streamed words are not.
    const said = announce.mock.calls.map(([message]) => message as string)
    expect(said[0]).toBe('Answer started')
    expect(announce).toHaveBeenCalledWith('Answer started', 'polite')
    expect(said).toContain('Looking at the role of Principal Project Analyst at CoreCard Software India…')
    expect(said).toContain('Read the Fast-JiraQL case study')
    expect(said.at(-1)).toBe('Answer complete, 2 sources')
    expect(said.join(' ')).not.toContain('He built')
    // Follow-up suggestions arrive after the answer.
    await vi.waitFor(() => expect(store.getSnapshot().suggestions).toEqual(['What did he build?']))
  })

  it('lists consulted sources when the answer cites none, and says so when there are none', async () => {
    const { store } = setup([emits(...toolRun('t1', 'list_projects', '{}', result({ projects: [] }, [WORK])), ...text('Here are the projects.')), emits(...text("The site doesn't cover that."))])
    await store.ask('Projects?')
    expect(numberSources(store.getSnapshot().turns[0]!)).toMatchObject([{ n: 1, url: '/work/fast-jiraql', cited: false }])
    await store.ask('Salary?')
    expect(numberSources(store.getSnapshot().turns[1]!)).toEqual([])
  })

  it('marks a failed step and keeps answering', async () => {
    const { store, announce } = setup([emits(...toolRun('t1', 'get_experience', '{}', 'Error: corpus unavailable'), ...text('I could not check roles.'))])
    await store.ask('Roles?')
    const turn = store.getSnapshot().turns[0]!
    expect(turn.steps[0]).toMatchObject({ status: 'failed' })
    expect(turn.status).toBe('complete')
    expect(announce).toHaveBeenCalledWith('Couldn’t look through roles. Failed', 'polite')
  })

  it('keeps a partial answer marked Incomplete when the connection drops, and Try again resends the question', async () => {
    const { store, requests } = setup([
      async (_request, emit) => {
        emit({ type: 'RUN_STARTED' })
        text('Partial ', 'answer').forEach(emit)
        throw new TypeError('network error')
      },
      emits(...text('Full answer.')),
    ])
    await store.ask('Tell me more')
    expect(store.getSnapshot().turns[0]).toMatchObject({ status: 'incomplete', text: 'Partial answer', error: 'network' })

    await store.retry(store.getSnapshot().turns[0]!.id)
    const { turns } = store.getSnapshot()
    expect(turns).toHaveLength(1)
    expect(turns[0]).toMatchObject({ status: 'complete', text: 'Full answer.', question: 'Tell me more' })
    // The retry sends the question once, not the cut-off attempt as well.
    expect(requests[1]!.messages.filter((m) => m.role === 'user').map((m) => m.content)).toEqual(['Tell me more'])
  })

  it('Stop keeps the partial answer, marked Incomplete and stopped', async () => {
    const { store } = setup([
      (_request, emit, signal) =>
        new Promise((_resolve, reject) => {
          emit({ type: 'RUN_STARTED' })
          text('Half').forEach(emit)
          signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')))
        }),
    ])
    const pending = store.ask('Long question')
    await vi.waitFor(() => expect(store.getSnapshot().turns[0]!.text).toBe('Half'))
    expect(store.streaming).toBe(true)
    store.stop()
    await pending
    expect(store.getSnapshot().turns[0]).toMatchObject({ status: 'incomplete', stopped: true, text: 'Half' })
  })

  it('reports rate limits and the daily budget as unavailable, not as failures', async () => {
    const { store, announce } = setup([
      async () => {
        throw new AskHttpError('ask_rate_limited', 1200)
      },
      async (_r, emit) => {
        emit({ type: 'RUN_STARTED' })
        emit({ type: 'RUN_ERROR', message: 'ask_budget_exhausted' })
        throw new Error('run failed')
      },
    ])
    await store.ask('One')
    expect(store.getSnapshot().turns[0]).toMatchObject({ status: 'unavailable', error: 'ask_rate_limited', retryAfterSeconds: 1200 })
    expect(announce).toHaveBeenLastCalledWith('Answers are unavailable for now.', 'assertive')
    await store.ask('Two')
    expect(store.getSnapshot().turns[1]).toMatchObject({ status: 'unavailable', error: 'ask_budget_exhausted' })
  })

  it('turns a draft_contact_request call into a form, sends it only on confirmation, and records the outcome', async () => {
    const draftArgs = JSON.stringify({ intent: 'role', message: 'I would like to discuss a delivery director role.', omitted: 'role details' })
    const { store, requests, sendContact, announce } = setup([
      async (request, emit) => {
        emit({ type: 'RUN_STARTED' })
        toolRun('t1', 'get_experience', '{}', 'Error: failed').forEach(emit)
        toolRun('d1', 'draft_contact_request', draftArgs).forEach(emit)
        emit({ type: 'RUN_FINISHED' })
        return [...request.messages, { id: 'a1', role: 'assistant', content: '', toolCalls: [{ id: 'd1', type: 'function', function: { name: 'draft_contact_request', arguments: draftArgs } }] }]
      },
      emits(...text('Anything else?')),
    ])
    await store.ask('I want to hire him')
    const turn = store.getSnapshot().turns[0]!
    // The draft is a form, not an activity line; the failed lookup stays visible.
    expect(turn.steps.map((s) => s.tool)).toEqual(['get_experience'])
    expect(turn.draft).toMatchObject({ toolCallId: 'd1', state: 'editing', args: { intent: 'role', omitted: 'role details' } })
    expect(sendContact).not.toHaveBeenCalled()
    expect(announce).toHaveBeenCalledWith('A contact request is ready for you to check', 'polite')

    sendContact.mockResolvedValueOnce(false)
    await store.sendDraft(turn.id, { intent: 'role', name: 'Ada', email: 'ada@example.com', message: 'Edited note' })
    expect(store.getSnapshot().turns[0]!.draft).toMatchObject({ state: 'editing', sendFailed: true, args: { message: 'Edited note', name: 'Ada' } })
    expect(announce).toHaveBeenLastCalledWith('Couldn’t send your request. Your note is kept. Nothing was sent.', 'assertive')

    await store.sendDraft(turn.id, { intent: 'role', name: 'Ada', email: 'ada@example.com', message: 'Edited note' })
    expect(store.getSnapshot().turns[0]!.draft).toMatchObject({ state: 'sent', sendFailed: false })
    expect(sendContact).toHaveBeenLastCalledWith({ intent: 'role', name: 'Ada', email: 'ada@example.com', message: 'Edited note' })

    // The next question carries the draft's outcome as the tool call's result.
    await store.ask('Thanks')
    const tool = requests[1]!.messages.find((m) => m.role === 'tool')
    expect(tool).toMatchObject({ toolCallId: 'd1', content: JSON.stringify({ status: 'sent' }) })
  })

  it('sends page context with the question and prefills without sending', async () => {
    const { store, requests, transport } = setup([emits(...text('Fast-JiraQL is an API.'))])
    const context = { url: '/work/fast-jiraql', title: 'Fast-JiraQL', description: 'A case study.' }
    store.prefill('What problem does Fast-JiraQL solve?', context)
    expect(store.getSnapshot().pending).toMatchObject({ question: 'What problem does Fast-JiraQL solve?', context })
    expect(transport.run).not.toHaveBeenCalled()
    const pending = store.takePending()!
    await store.ask(pending.question, pending.context)
    expect(requests[0]!.context).toEqual([{ description: 'The visitor opened Ask from this page of the site', value: 'Fast-JiraQL (/work/fast-jiraql): A case study.' }])
    expect(requests[0]!.tools.map((t) => t.name)).toEqual(['draft_contact_request'])
  })

  it('keeps the conversation in this browser only, and clears it', async () => {
    const saved = new Map<string, string>()
    const storage = { getItem: (k: string) => saved.get(k) ?? null, setItem: (k: string, v: string) => void saved.set(k, v), removeItem: (k: string) => void saved.delete(k) }
    const first = setup([emits(...text('Answer.'))], { storage })
    await first.store.ask('Question?')

    const again = setup([], { storage })
    expect(again.store.getSnapshot().turns.map((t) => t.question)).toEqual(['Question?'])
    again.store.clear()
    expect(again.store.getSnapshot().turns).toEqual([])
    expect(saved.size).toBe(0)

    // Another device has its own (empty) storage.
    expect(setup([], { storage: { getItem: () => null, setItem: () => {}, removeItem: () => {} } }).store.getSnapshot().turns).toEqual([])
  })
})
