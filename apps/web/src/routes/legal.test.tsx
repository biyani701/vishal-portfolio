import { render, screen, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { legal } from '@/content/index.ts'
import { routes } from '@/router.tsx'

// Task 10.5 (specs/content-pages "About, Colophon and Legal"): privacy, terms and colophon from content/legal.ts.

async function open(path: string) {
  render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />)
  return screen.findByRole('heading', { level: 1 }, { timeout: 3000 })
}

describe('legal pages', () => {
  it('covers cookies, analytics, AI conversations and contact storage and retention (Privacy coverage)', async () => {
    expect(await open('/legal/privacy')).toHaveTextContent('Privacy policy')
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(headings).toEqual(expect.arrayContaining(['Messages you send through the contact form', 'Questions you ask with Ask', 'Cookies and storage in your browser', 'Analytics']))

    const section = (name: string) => screen.getByRole('region', { name })
    expect(section('Messages you send through the contact form')).toHaveTextContent('deleted automatically 365 days after they arrive')
    expect(section('Questions you ask with Ask')).toHaveTextContent('does not store your questions or answers')
    expect(section('Questions you ask with Ask')).toHaveTextContent('NVIDIA')
    expect(section('Cookies and storage in your browser')).toHaveTextContent('no advertising or tracking cookies')
    expect(section('Analytics')).toHaveTextContent('does not use analytics at present')
    expect(screen.getByText(/Last updated/)).toHaveTextContent('27 September 2026')
  })

  it('marks the text as a draft until the owner has reviewed it', async () => {
    await open('/legal/terms')
    const draft = screen.queryByRole('complementary', { name: 'Draft' })
    if (legal.draft) expect(draft).toHaveTextContent('waiting for Vishal’s review')
    else expect(draft).not.toBeInTheDocument()
  })

  it('shows the terms, with Ask’s answers described as AI-written', async () => {
    expect(await open('/legal/terms')).toHaveTextContent('Terms of use')
    expect(screen.getByRole('region', { name: 'Ask' })).toHaveTextContent('written by an AI model')
  })

  it('shows the colophon: stack, type, services and credits', async () => {
    expect(await open('/colophon')).toHaveTextContent('Colophon')
    const type = screen.getByRole('region', { name: 'Type' })
    expect(within(type).getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      'Bricolage Grotesque for headings and interface text',
      'Newsreader for reading text',
      'JetBrains Mono for code and small labels',
    ])
    expect(screen.getByRole('region', { name: 'Credits' })).toBeInTheDocument()
  })

  it('no longer has placeholder pages', async () => {
    await open('/colophon')
    expect(screen.queryByText(/arrives in P\d+/)).not.toBeInTheDocument()
  })
})
