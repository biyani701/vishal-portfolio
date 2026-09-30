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

const section = (name: string) => screen.getByRole('region', { name })

describe('legal pages', () => {
  it('covers cookies, analytics, AI conversations and contact storage and retention (Privacy coverage)', async () => {
    expect(await open('/legal/privacy')).toHaveTextContent('Privacy policy')
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(headings).toEqual(
      expect.arrayContaining(['Messages you send through the contact form', 'Questions you ask with Ask', 'Cookies and browser storage', 'Analytics', 'Hosting and service providers']),
    )

    expect(section('Messages you send through the contact form')).toHaveTextContent('deleted from the database automatically 365 days after they arrive')
    expect(section('Messages you send through the contact form')).toHaveTextContent('not deleted automatically')
    expect(section('Questions you ask with Ask')).toHaveTextContent('does not store your questions or answers')
    expect(section('Questions you ask with Ask')).toHaveTextContent('NVIDIA')
    expect(section('Cookies and browser storage')).toHaveTextContent('no advertising or tracking cookies')
    expect(section('Analytics')).toHaveTextContent('does not currently use analytics')
  })

  it('draws the flows with a text alternative', async () => {
    await open('/legal/privacy')
    expect(within(section('Questions you ask with Ask')).getByRole('img')).toHaveAccessibleName(/NVIDIA’s AI service/)
    expect(within(section('Messages you send through the contact form')).getByRole('img')).toHaveAccessibleName(/Neon Postgres/)
  })

  it('lists each service provider in a table with row headers', async () => {
    await open('/legal/privacy')
    const table = within(section('Hosting and service providers')).getByRole('table', { name: 'Service providers and the information each handles' })
    expect(within(table).getAllByRole('columnheader').map((th) => th.textContent)).toEqual(['Service', 'What it does', 'Information involved'])
    expect(within(table).getAllByRole('rowheader').map((th) => th.textContent)).toEqual(['GitHub Pages', 'Vercel', 'Neon', 'Resend', 'Upstash', 'NVIDIA API catalog'])
  })

  it('dates every page the same, with no draft notice', async () => {
    for (const path of ['/legal/privacy', '/legal/terms', '/colophon']) {
      const view = render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />)
      await screen.findByRole('heading', { level: 1 }, { timeout: 3000 })
      expect(screen.getByText(/Last updated:/)).toHaveTextContent(`Last updated: ${new Date(legal.updated).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}`)
      expect(screen.queryByRole('complementary', { name: 'Draft' })).not.toBeInTheDocument()
      expect(screen.queryByText(/waiting for .* review/)).not.toBeInTheDocument()
      view.unmount()
    }
  })

  it('links the pages to each other through the router', async () => {
    await open('/legal/terms')
    expect(within(section('Using this site')).getByRole('link', { name: 'privacy policy' })).toHaveAttribute('href', '/legal/privacy')
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/legal/privacy'] })} />)
    expect(await screen.findByRole('link', { name: 'terms of use' })).toHaveAttribute('href', '/legal/terms')
  })

  it('shows the terms: content licence apart from code, acceptable use, and Ask as AI-written, not advice', async () => {
    expect(await open('/legal/terms')).toHaveTextContent('Terms of use')
    const copyright = section('Content and copyright')
    expect(copyright).toHaveTextContent('who keeps the copyright')
    expect(copyright).toHaveTextContent('open source under the MIT License; that licence covers the code only, not the writing, photographs or branding')
    expect(within(section('Acceptable use')).getAllByRole('listitem').length).toBeGreaterThan(2)
    expect(section('Ask')).toHaveTextContent('written by an AI model')
    expect(section('Ask')).toHaveTextContent('isn’t legal, financial, medical, employment or any other professional advice')
    expect(section('Changes and governing law')).toHaveTextContent('laws of India')
  })

  it('shows the colophon: stack, architecture, repository, type, licences and credits', async () => {
    expect(await open('/colophon')).toHaveTextContent('Colophon')
    expect(within(section('Built with')).getByRole('link', { name: 'github.com/biyani701/vishal-portfolio' })).toHaveAttribute('href', 'https://github.com/biyani701/vishal-portfolio')
    expect(within(section('How it fits together')).getByRole('img')).toHaveAccessibleName(/Upstash Redis/)
    const type = section('Type')
    expect(within(type).getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      'Bricolage Grotesque for headings and interface text',
      'Newsreader for reading text',
      'JetBrains Mono for code and small labels',
    ])
    const licences = section('Licences')
    expect(within(licences).getByRole('link', { name: 'MIT License' })).toHaveAttribute('href', 'https://github.com/biyani701/vishal-portfolio/blob/main/LICENSE')
    expect(licences).toHaveTextContent('The MIT License covers the code only')
    expect(licences).toHaveTextContent('SIL Open Font License')
    expect(section('Credits')).toHaveTextContent('AI assistance')
  })

  it('no longer has placeholder pages', async () => {
    await open('/colophon')
    expect(screen.queryByText(/arrives in P\d+/)).not.toBeInTheDocument()
  })
})
