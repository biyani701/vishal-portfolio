import { announce } from '@react-aria/live-announcer'
import axe from 'axe-core'
import { MemoryRouter } from 'react-router'
import { afterAll, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { PaletteContext } from '@/features/search/context.ts'
import { expectTarget, settled } from '@/test/contract.ts'
import { AskSurface } from './AskSurface.tsx'
import { AskStoreContext } from './context.ts'
import type { AskEvent } from './model.ts'
import { AskStore } from './store.ts'
import type { AskTransport, Message, RunRequest } from './transport.ts'

// Task 11.5 in a real browser with the Programme CSS: axe finds nothing in either theme across Ask's states,
// every control is a 44px target and reachable by keyboard, and the live region hears statuses, not words.

const result = (value: unknown, sources: object[]) => JSON.stringify({ notice: 'data', result: value, sources })
const tool = (id: string, name: string, args: object, content?: string): AskEvent[] => [
  { type: 'TOOL_CALL_START', toolCallId: id, toolCallName: name },
  { type: 'TOOL_CALL_ARGS', toolCallId: id, delta: JSON.stringify(args) },
  { type: 'TOOL_CALL_END', toolCallId: id },
  ...(content === undefined ? [] : [{ type: 'TOOL_CALL_RESULT', toolCallId: id, content } as AskEvent]),
]
const words = (...deltas: string[]): AskEvent[] => deltas.map((delta) => ({ type: 'TEXT_MESSAGE_CONTENT', delta }))

type Script = (request: RunRequest, onEvent: (e: AskEvent) => void) => Promise<Message[]>
const emitting =
  (...events: AskEvent[]): Script =>
  async (request, onEvent) => {
    onEvent({ type: 'RUN_STARTED' })
    events.forEach(onEvent)
    onEvent({ type: 'RUN_FINISHED' })
    return request.messages
  }

const ANSWER = emitting(
  ...tool('t1', 'list_projects', {}, result({ projects: [{ slug: 'fast-jiraql' }] }, [{ section: 'Work', title: 'Fast-JiraQL', url: '/work/fast-jiraql' }])),
  ...tool('t2', 'get_experience', { role_id: 'corecard' }, result({ roles: [{ id: 'corecard' }] }, [{ section: 'Experience', title: 'Principal Project Analyst · CoreCard', url: '/experience#corecard' }])),
  ...words('### Engineering\n\nHe built **Fast-JiraQL** [/work/fast-jiraql] while leading the PMO [/experience#corecard].'),
)
const FAILURE_WITH_DRAFT = emitting(
  ...tool('t3', 'get_experience', {}, 'Error: unavailable'),
  ...tool('d1', 'draft_contact_request', { intent: 'role', message: 'I would like to talk about a role.' }),
  ...words('I couldn’t check his roles; here is a draft.'),
)
const INCOMPLETE: Script = async (_request, onEvent) => {
  onEvent({ type: 'RUN_STARTED' })
  words('A partial answer').forEach(onEvent)
  throw new TypeError('Failed to fetch')
}
const UNAVAILABLE: Script = async (_request, onEvent) => {
  onEvent({ type: 'RUN_STARTED' })
  onEvent({ type: 'RUN_ERROR', message: 'ask_rate_limited' })
  throw new Error('run failed')
}

async function renderAsk(scripts: Script[], options: { rail?: boolean; sendOk?: boolean; announcer?: (message: string, politeness?: 'polite' | 'assertive') => void } = {}) {
  let calls = 0
  const transport: AskTransport = {
    run: (request, onEvent) => scripts[Math.min(calls++, scripts.length - 1)]!(request, onEvent),
    suggest: async () => ['Which used Python?'],
  }
  const store = new AskStore({ transport, announce: options.announcer ?? (() => {}), sendContact: async () => options.sendOk ?? true })
  await render(
    <MemoryRouter>
      <PaletteContext value={{ openPalette: () => {} }}>
        <AskStoreContext value={store}>
          <main>
            <AskSurface variant="page" rail={options.rail ?? false} />
          </main>
        </AskStoreContext>
      </PaletteContext>
    </MemoryRouter>,
  )
  return store
}

async function violations() {
  await settled()
  const { violations } = await axe.run(document, {
    resultTypes: ['violations'],
    rules: { 'html-has-lang': { enabled: false }, 'document-title': { enabled: false } },
  })
  return violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)
}

const initialTheme = document.documentElement.dataset.theme
afterAll(() => {
  document.documentElement.dataset.theme = initialTheme
})

describe.each(['light', 'dark'] as const)('Ask in the %s theme', (theme) => {
  it('has no axe violations: answer with rail, failure with draft, send failure, incomplete and unavailable', async () => {
    document.documentElement.dataset.theme = theme
    const store = await renderAsk([ANSWER, FAILURE_WITH_DRAFT, INCOMPLETE, UNAVAILABLE], { rail: true, sendOk: false })
    await store.ask('Which projects show hands-on engineering?')
    await store.ask('I want to hire him')
    await store.ask('A question that drops')
    await store.ask('One more')
    await expect.element(page.getByText('Answer complete · 2 sources')).toBeVisible()

    // Open every disclosure so its contents are checked too.
    for (const details of page.getByRole('button', { name: 'Details' }).elements()) (details as HTMLElement).click()
    const turn = store.getSnapshot().turns[1]!
    await store.sendDraft(turn.id, { intent: 'role', name: 'Ada', email: 'ada@example.com', message: 'Hello' })
    await expect.element(page.getByRole('alert')).toBeVisible()

    expect(await violations()).toEqual([])
  })
})

describe('Ask by keyboard', () => {
  it('asks with Enter, keeps focus in the composer, and reaches every control by Tab', async () => {
    await renderAsk([ANSWER])
    await page.getByLabelText('Your question').click()
    await userEvent.keyboard('Which projects show hands-on engineering?{Enter}')
    await expect.element(page.getByText('Answer complete · 2 sources')).toBeVisible()
    expect(document.activeElement).toBe(page.getByLabelText('Your question').element())

    // Walk the page from the top: every button and link is reached, and each is a 44px target.
    ;(document.activeElement as HTMLElement).blur()
    const controls = [...document.querySelectorAll('main a[href], main button:not([disabled]), main textarea')]
    const reached = new Set<Element>()
    for (let i = 0; i < controls.length + 5; i++) {
      await userEvent.keyboard('{Tab}')
      if (document.activeElement) reached.add(document.activeElement)
    }
    // Scrolling while tabbing can show or hide "Jump to latest"; check the controls still on the page.
    for (const control of controls.filter((c) => c.isConnected)) {
      expect(reached.has(control), `${control.textContent} is reachable by Tab`).toBe(true)
      if (control.tagName !== 'TEXTAREA') expectTarget(control)
    }

    // Details opens from the keyboard.
    page.getByRole('button', { name: 'Details' }).first().element().focus()
    await userEvent.keyboard('{Enter}')
    await expect.element(page.getByText('list_projects')).toBeVisible()
  })
})

describe('Ask with a screen reader (live region smoke test)', () => {
  it('hears "Answer started", step updates and "Answer complete, 2 sources", never the streamed words', async () => {
    const heard: string[] = []
    const spy = vi.fn((message: string, politeness?: 'polite' | 'assertive') => {
      heard.push(message)
      announce(message, politeness)
    })
    const store = await renderAsk([ANSWER], { announcer: spy })
    await store.ask('Which projects show hands-on engineering?')

    // The announcer's live regions exist in the page and carry the statuses.
    await expect.poll(() => document.querySelector('[aria-live="polite"]')?.textContent ?? '').toContain('Answer complete, 2 sources')
    expect(heard[0]).toBe('Answer started')
    expect(heard).toContain('Looked through projects')
    expect(heard.join(' | ')).not.toContain('He built')
    expect(document.querySelector('[aria-live="polite"]')!.textContent).not.toContain('He built')
  })
})
