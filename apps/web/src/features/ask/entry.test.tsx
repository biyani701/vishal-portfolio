import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { routes } from '@/router.tsx'
import { stubMatchMedia } from '@/test/media.ts'

// Tasks 11.3 and 11.6 through the real shell and router: which surface Ask uses by mode, "Ask about this" with
// page context, and a rotation mid-conversation (specs/ask-experience "Surfaces by mode", "Contextual ask").

const slow = { timeout: 4000 }

function open(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
  return router
}

beforeEach(() => {
  // No request leaves a test; an ask that gets this far fails as a dropped connection.
  vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new TypeError('offline'))))
  try {
    localStorage.clear()
  } catch {
    // Storage unavailable: nothing to clear.
  }
})

describe('Ask entry points', () => {
  it('opens "Ask about this" on a phone as a bottom drawer over the case study, with the project as context', async () => {
    stubMatchMedia({ width: 390, height: 844 })
    const router = open('/work/fast-jiraql')
    await userEvent.click(await screen.findByRole('link', { name: 'Ask about this →' }, slow))

    const drawer = await screen.findByRole('dialog', { name: 'Ask' }, slow)
    expect(router.state.location.pathname).toBe('/work/fast-jiraql')
    expect(within(drawer).getByLabelText('Your question')).toHaveValue('What problem does Fast-JiraQL solve, and how was it built?')
  })

  it('continues the same conversation in the right-hand drawer when the phone rotates', async () => {
    const viewport = stubMatchMedia({ width: 390, height: 844 })
    open('/work/fast-jiraql')
    await userEvent.click(await screen.findByRole('link', { name: 'Ask about this →' }, slow))
    const drawer = await screen.findByRole('dialog', { name: 'Ask' }, slow)
    await userEvent.click(within(drawer).getByRole('button', { name: 'Ask' }))
    expect(await within(drawer).findByRole('heading', { level: 2, name: 'What problem does Fast-JiraQL solve, and how was it built?' })).toBeInTheDocument()

    act(() => viewport.resize(844, 390))
    const landscape = await screen.findByRole('dialog', { name: 'Ask' }, slow)
    await waitFor(() => expect(landscape.closest('[data-swipe-direction]') ?? landscape).toHaveAttribute('data-swipe-direction', 'right'))
    expect(within(landscape).getByRole('heading', { level: 2, name: 'What problem does Fast-JiraQL solve, and how was it built?' })).toBeInTheDocument()
  })

  it('opens the /ask page on desktop, where the question is asked and the URL tidied', async () => {
    const router = open('/work/fast-jiraql')
    await userEvent.click(await screen.findByRole('link', { name: 'Ask about this →' }, slow))
    await waitFor(() => expect(router.state.location.pathname).toBe('/ask'))
    expect(await screen.findByRole('heading', { level: 1, name: 'Ask' }, slow)).toBeInTheDocument()
    expect(screen.getByLabelText('Your question')).toHaveValue('What problem does Fast-JiraQL solve, and how was it built?')
    expect(router.state.location.search).toBe('')
    expect(screen.queryByRole('dialog', { name: 'Ask' })).not.toBeInTheDocument()
  })

  it('never opens Ask on its own', async () => {
    stubMatchMedia({ width: 390, height: 844 })
    open('/')
    expect(await screen.findByRole('heading', { level: 1 }, slow)).toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: 'Ask' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Close Ask' })).not.toBeInTheDocument()
  })
})
