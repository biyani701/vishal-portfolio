import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PaletteContext } from '@/features/search/context.ts'
import { stubMatchMedia } from '@/test/media.ts'
import { AskSurface } from './AskSurface.tsx'
import { AskStoreContext } from './context.ts'
import type { AskEvent } from './model.ts'
import { applyRequest } from './request.ts'
import { AskStore } from './store.ts'
import type { AskTransport, Message, RunRequest } from './transport.ts'

// Tasks 11.3–11.6: Ask's surface against mocked AG-UI event streams, one test per ask-experience scenario.

const result = (value: unknown, sources: object[]) => JSON.stringify({ notice: 'data', result: value, sources })
const WORK = (slug: string, title: string) => ({ section: 'Work', title, url: `/work/${slug}` })
const ROLE = { section: 'Experience', title: 'Principal Project Analyst · CoreCard Software India', url: '/experience#corecard' }

const tool = (id: string, name: string, args: object, content?: string): AskEvent[] => [
  { type: 'TOOL_CALL_START', toolCallId: id, toolCallName: name },
  { type: 'TOOL_CALL_ARGS', toolCallId: id, delta: JSON.stringify(args) },
  { type: 'TOOL_CALL_END', toolCallId: id },
  ...(content === undefined ? [] : [{ type: 'TOOL_CALL_RESULT', toolCallId: id, content } as AskEvent]),
]
const words = (...deltas: string[]): AskEvent[] => deltas.map((delta) => ({ type: 'TEXT_MESSAGE_CONTENT', delta }))

/** A run the test drives: emit events, then finish or fail it. */
function controlledRun() {
  let onEvent: (event: AskEvent) => void = () => {}
  let settle: { resolve: (messages: Message[]) => void; reject: (error: unknown) => void; messages: Message[] } | undefined
  let ready!: () => void
  const started = new Promise<void>((resolve) => (ready = resolve))
  const run = (request: RunRequest, handler: (e: AskEvent) => void, signal: AbortSignal) =>
    new Promise<Message[]>((resolve, reject) => {
      onEvent = handler
      settle = { resolve, reject, messages: request.messages }
      signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')))
      handler({ type: 'RUN_STARTED' })
      ready()
    })
  return {
    started,
    run,
    emit: (event: AskEvent) => act(() => onEvent(event)),
    finish: () => {
      act(() => onEvent({ type: 'RUN_FINISHED' }))
      settle!.resolve(settle!.messages)
    },
    fail: (error: unknown) => settle!.reject(error),
  }
}

type Script = (request: RunRequest, onEvent: (e: AskEvent) => void, signal: AbortSignal) => Promise<Message[]>
const emitting =
  (...events: AskEvent[]): Script =>
  async (request, onEvent) => {
    onEvent({ type: 'RUN_STARTED' })
    events.forEach(onEvent)
    onEvent({ type: 'RUN_FINISHED' })
    return request.messages
  }

function setup(scripts: Script[], { rail = false, variant = 'page' as 'page' | 'drawer' } = {}) {
  let calls = 0
  const transport: AskTransport = {
    run: vi.fn((request, onEvent, signal) => scripts[Math.min(calls++, scripts.length - 1)]!(request, onEvent, signal)),
    suggest: vi.fn(async () => ['Which of these used Python?']),
  }
  const announce = vi.fn()
  const sendContact = vi.fn(async () => true)
  const store = new AskStore({ transport, announce, sendContact })
  const openPalette = vi.fn()
  const view = render(
    <MemoryRouter>
      <PaletteContext value={{ openPalette }}>
        <AskStoreContext value={store}>
          <AskSurface variant={variant} rail={rail} />
        </AskStoreContext>
      </PaletteContext>
    </MemoryRouter>,
  )
  return { store, transport, announce, sendContact, openPalette, view, user: userEvent.setup() }
}

async function askVia(user: ReturnType<typeof userEvent.setup>, question: string) {
  await user.type(screen.getByLabelText('Your question'), question)
  await user.click(screen.getByRole('button', { name: 'Ask' }))
}

afterEach(() => vi.unstubAllGlobals())

describe('Ask surface', () => {
  it('offers starters before the first question, and asks one when chosen', async () => {
    const { user, transport } = setup([emitting(...words('Answer.'))])
    await user.click(screen.getByRole('button', { name: 'Which projects show hands-on engineering?' }))
    expect(transport.run).toHaveBeenCalledOnce()
    expect(await screen.findByRole('heading', { level: 2, name: 'Which projects show hands-on engineering?' })).toBeInTheDocument()
  })

  it('answers the engineering-projects question with compact project cards that link to the case studies', async () => {
    const { user } = setup(
      [
        emitting(
          ...tool('t1', 'list_projects', { type: 'open-source' }, result({ projects: [{ slug: 'fast-jiraql' }, { slug: 'confluence-pages-details' }] }, [WORK('fast-jiraql', 'Fast-JiraQL'), WORK('confluence-pages-details', 'Confluence Pages Details')])),
          ...words('Two open-source tools show hands-on engineering: **Fast-JiraQL** [/work/fast-jiraql] and a Confluence reporter [/work/confluence-pages-details].'),
        ),
      ],
      { rail: true },
    )
    await askVia(user, 'Which projects show hands-on engineering?')

    const projects = await screen.findByRole('list', { name: 'Projects' })
    expect(within(projects).getByRole('link', { name: /Fast-JiraQL/ })).toHaveAttribute('href', '/work/fast-jiraql')
    expect(within(projects).getAllByRole('link')).toHaveLength(2)
    // The question is a heading and the answer serif prose with superscript citations, no bubbles.
    expect(screen.getByRole('heading', { level: 2, name: 'Which projects show hands-on engineering?' })).toBeInTheDocument()
    const answer = screen.getByRole('group', { name: 'Answer' })
    expect(within(answer).getByText('Fast-JiraQL').tagName).toBe('STRONG')
    expect(within(answer).getByRole('link', { name: 'Source 1' })).toHaveAttribute('href', '#ask-0-source-1')
    // Sources rail, grouped by section and numbered by first citation.
    const rail = screen.getByRole('complementary', { name: 'Sources' })
    expect(within(rail).getByRole('heading', { name: 'Work' })).toBeInTheDocument()
    expect(within(rail).getAllByRole('link').map((a) => a.textContent)).toEqual(['Fast-JiraQL', 'Confluence Pages Details'])
    expect(screen.getByText('Answer complete · 2 sources')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open Fast-JiraQL' })).toHaveAttribute('href', '/work/fast-jiraql')
    // Follow-ups arrive after the answer.
    expect(await screen.findByRole('button', { name: 'Which of these used Python?' })).toBeInTheDocument()
  })

  it('shows a running step as an In-flight line whose Details show the tool call', async () => {
    const run = controlledRun()
    const { user } = setup([run.run])
    await askVia(user, 'Where has he worked?')
    await run.started
    tool('t1', 'get_experience', {}).forEach(run.emit)

    const steps = screen.getByRole('list', { name: 'Steps' })
    expect(within(steps).getByText('In flight')).toBeInTheDocument()
    expect(within(steps).getByText('Looking through roles…')).toBeInTheDocument()
    await user.click(within(steps).getByRole('button', { name: 'Details' }))
    expect(within(steps).getByText('get_experience')).toBeInTheDocument()
    expect(within(steps).getByText('running')).toBeInTheDocument()
    // No raw reasoning or tool jargon in the sentence itself; the answer region is busy while streaming.
    expect(screen.getByRole('group', { name: 'Answer' })).toHaveAttribute('aria-busy', 'true')

    run.emit({ type: 'TOOL_CALL_RESULT', toolCallId: 't1', content: result({ roles: [{ id: 'corecard' }, { id: 'lloyds' }] }, [ROLE]) })
    expect(within(steps).getByText('Done')).toBeInTheDocument()
    expect(within(steps).getByText('Looked through roles')).toBeInTheDocument()
    run.finish()
    await waitFor(() => expect(screen.getByRole('group', { name: 'Answer' })).toHaveAttribute('aria-busy', 'false'))
  })

  it('keeps a partial answer marked Incomplete when the connection drops, and Try again resends the question', async () => {
    const run = controlledRun()
    const { user, transport } = setup([run.run, emitting(...words('The whole answer.'))])
    await askVia(user, 'Tell me about CoreCard')
    await run.started
    words('He led the ', 'Agile PMO').forEach(run.emit)
    await act(async () => run.fail(new TypeError('Failed to fetch')))

    expect(await screen.findByText('Incomplete')).toBeInTheDocument()
    expect(screen.getByText('He led the Agile PMO')).toBeInTheDocument()
    expect(screen.getByText('The connection dropped before the answer finished.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Copy what’s here' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByText('The whole answer.')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2, name: 'Tell me about CoreCard' })).toHaveLength(1)
    expect((transport.run as ReturnType<typeof vi.fn>).mock.calls[1]![0].messages.map((m: Message) => m.content)).toEqual(['Tell me about CoreCard'])
  })

  it('offers Stop while streaming, keeping what was written', async () => {
    const run = controlledRun()
    const { user } = setup([run.run])
    await askVia(user, 'A long question')
    await run.started
    words('Half an answer').forEach(run.emit)
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(await screen.findByText('You stopped this answer.')).toBeInTheDocument()
    expect(screen.getByText('Half an answer')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ask' })).toBeInTheDocument()
  })

  it('says when nothing could be cited, for a question outside the site', async () => {
    const { user } = setup([emitting(...words('The site doesn’t cover salary expectations. The contact page is the best way to ask.'))], { rail: true })
    await askVia(user, 'What are his salary expectations?')
    expect(await screen.findByText(/doesn’t cover salary/)).toBeInTheDocument()
    expect(within(screen.getByRole('complementary', { name: 'Sources' })).getByText(/No sources/)).toBeInTheDocument()
    expect(screen.getByText('Answer complete · 0 sources')).toBeInTheDocument()
  })

  it('collapses sources into "N sources" under the answer on smaller screens, first four then Show more', async () => {
    const many = ['fast-jiraql', 'jira-dashboard', 'confluence-pages-details', 'blog-platform', 'knowledge-base', 'auth-poc'].map((slug) => WORK(slug, slug))
    const { user } = setup([emitting(...tool('t1', 'list_projects', {}, result({ projects: [] }, many)), ...words('Six projects.'))])
    await askVia(user, 'All projects?')
    await user.click(await screen.findByRole('button', { name: '6 sources' }))
    expect(screen.getAllByRole('link', { name: /^[a-z-]+$/ })).toHaveLength(4)
    await user.click(screen.getByRole('button', { name: 'Show 2 more' }))
    expect(screen.getAllByRole('link', { name: /^[a-z-]+$/ })).toHaveLength(6)
  })

  it('keeps the draft usable when a lookup failed, leaving its details out and saying so', async () => {
    const draft = { intent: 'role', message: 'I would like to talk about a delivery director role.' }
    const { user, sendContact, announce } = setup([
      emitting(...tool('t1', 'get_experience', {}, 'Error: unavailable'), ...tool('d1', 'draft_contact_request', draft), ...words('I couldn’t check his roles, but here is a draft.')),
    ])
    await askVia(user, 'I want to hire him')

    // The failed step shows Failed with Retry; the answer says what it couldn't do.
    const steps = await screen.findByRole('list', { name: 'Steps' })
    expect(within(steps).getByText('Failed')).toBeInTheDocument()
    expect(within(steps).getByRole('button', { name: 'Retry' })).toBeInTheDocument()
    expect(within(steps).getByText('Couldn’t look through roles')).toBeInTheDocument()

    const form = screen.getByRole('form', { name: 'Send a request to Vishal?' })
    expect(within(form).getByRole('note')).toHaveTextContent('This draft leaves out role details')
    expect(within(form).getByLabelText('Note')).toHaveValue(draft.message)
    expect(sendContact).not.toHaveBeenCalled()

    // Nothing is sent without the visitor's details and confirmation.
    await user.click(within(form).getByRole('button', { name: 'Send request' }))
    expect(within(form).getByText('Add your name, a valid email and a note.')).toBeInTheDocument()
    expect(sendContact).not.toHaveBeenCalled()

    await user.type(within(form).getByLabelText('Your name'), 'Ada Lovelace')
    await user.type(within(form).getByLabelText('Your email'), 'ada@example.com')

    // A send failure keeps the values, alerts, and offers Try again and the contact form.
    sendContact.mockResolvedValueOnce(false)
    await user.click(within(form).getByRole('button', { name: 'Send request' }))
    const alert = await within(form).findByRole('alert')
    expect(alert).toHaveTextContent('Couldn’t send your request. Your note is kept. Nothing was sent.')
    expect(within(alert).getByRole('link', { name: 'Open the contact form instead' })).toHaveAttribute('href', expect.stringContaining('/contact?intent=role'))
    expect(within(form).getByLabelText('Your name')).toHaveValue('Ada Lovelace')
    expect(announce).toHaveBeenCalledWith('Couldn’t send your request. Your note is kept. Nothing was sent.', 'assertive')

    await user.click(within(form).getByRole('button', { name: 'Try again' }))
    expect(await screen.findByText(/Request sent/)).toBeInTheDocument()
    expect(sendContact).toHaveBeenLastCalledWith({ intent: 'role', name: 'Ada Lovelace', email: 'ada@example.com', message: draft.message })
  })

  it('offers search and Contact when answers are unavailable', async () => {
    const { user, openPalette } = setup([
      async (_r, onEvent) => {
        onEvent({ type: 'RUN_STARTED' })
        onEvent({ type: 'RUN_ERROR', message: 'ask_budget_exhausted' })
        throw new Error('run failed')
      },
    ])
    await askVia(user, 'Anything?')
    expect(await screen.findByText(/reached its limit for today/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Send a message' })).toHaveAttribute('href', '/contact')
    await user.click(screen.getByRole('button', { name: 'Search the site' }))
    expect(openPalette).toHaveBeenCalledWith('Anything?')
  })

  it('announces statuses, not words, and returns focus to the composer (screen-reader session)', async () => {
    const { user, announce } = setup([
      emitting(
        ...tool('t1', 'get_experience', {}, result({ roles: [] }, [ROLE])),
        ...tool('t2', 'get_project', { slug: 'fast-jiraql' }, result({ found: true, project: { slug: 'fast-jiraql' } }, [WORK('fast-jiraql', 'Fast-JiraQL')])),
        ...tool('t3', 'get_profile', {}, result({}, [{ section: 'Home', title: 'Vishal Biyani', url: '/' }])),
        ...words('He built ', 'Fast-JiraQL [/work/fast-jiraql] at ', 'CoreCard [/experience#corecard] [/].'),
      ),
    ])
    await askVia(user, 'Summarise him')
    await screen.findByText('Answer complete · 3 sources')
    const said = announce.mock.calls.map(([m]) => m as string)
    expect(said[0]).toBe('Answer started')
    expect(said).toContain('Looking through roles…')
    expect(said).toContain('Read the Fast-JiraQL case study')
    expect(said.at(-1)).toBe('Answer complete, 3 sources')
    expect(said.some((m) => m.includes('He built'))).toBe(false)
    expect(screen.getByLabelText('Your question')).toHaveFocus()
  })

  it('shows "Jump to latest" when the newest content is out of view', async () => {
    let report: (visible: boolean) => void = () => {}
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
          report = (visible) => act(() => callback([{ isIntersecting: visible }]))
        }
        observe() {}
        disconnect() {}
      },
    )
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView
    const { user } = setup([emitting(...words('An answer.'))])
    await askVia(user, 'Question')
    expect(screen.queryByRole('button', { name: 'Jump to latest' })).not.toBeInTheDocument()
    report(false)
    await user.click(screen.getByRole('button', { name: 'Jump to latest' }))
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'end', behavior: 'smooth' })
  })

  it('opens "Ask about this" with the project as context and a suggested question, sent only by the visitor (contextual ask)', async () => {
    const { user, store, transport } = setup([emitting(...words('Fast-JiraQL answers Jira questions over REST and GraphQL.'))])
    act(() => applyRequest(store, { about: '/work/fast-jiraql' }))

    const composer = screen.getByLabelText('Your question')
    expect(composer).toHaveValue('What problem does Fast-JiraQL solve, and how was it built?')
    expect(composer).toHaveFocus()
    expect(transport.run).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Ask' }))
    expect(await screen.findByText('About Fast-JiraQL')).toBeInTheDocument()
    const request = (transport.run as ReturnType<typeof vi.fn>).mock.calls[0]![0] as RunRequest
    expect(request.context[0]!.value).toContain('Fast-JiraQL (/work/fast-jiraql)')
  })

  it('renders the drawer variant with a close button and the composer pinned', () => {
    stubMatchMedia({ width: 390, height: 844 })
    setup([], { variant: 'drawer' })
    expect(screen.getByRole('button', { name: 'Close Ask' })).toBeInTheDocument()
    expect(screen.getByLabelText('Your question')).toHaveFocus()
  })
})
