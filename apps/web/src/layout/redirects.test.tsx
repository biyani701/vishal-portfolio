import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { routes } from '@/router.tsx'
import { legacyHomeAnchors, legacyRedirects } from './redirects.ts'

/** Opens `path` as if arriving from `/start`, so Back shows where history leads. */
function open(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: ['/start', path], initialIndex: 1 })
  render(<RouterProvider router={router} />)
  return router
}

const withSampleParams = (path: string) => path.replace(/:(\w+)/g, (_, name: string) => `${name.toLowerCase()}-1`)

async function expectReplacedWith(router: ReturnType<typeof open>, pathname: string, rest: { search?: string; hash?: string } = {}) {
  await waitFor(() => expect(router.state.location.pathname).toBe(pathname))
  expect(router.state.historyAction).toBe('REPLACE')
  expect(router.state.location).toMatchObject(rest)
  // The destination is a real page, not the 404.
  expect(await screen.findByRole('heading', { level: 1 })).not.toHaveTextContent('Page not found')

  await act(() => router.navigate(-1))
  expect(router.state.location.pathname).toBe('/start')
}

// The route migration map (design/exploration/02-information-architecture.md): each old path or home
// anchor on a row marked "redirect".
function documentedRedirects() {
  const doc = readFileSync(resolve(process.cwd(), '../../design/exploration/02-information-architecture.md'), 'utf8')
  const table = doc.split('## Route migration map')[1]!.split('\n## ')[0]!
  const rows = table.split('\n').filter((line) => line.startsWith('|') && /redirect/.test(line.split('|')[3] ?? ''))
  return rows.flatMap((row) => [...row.split('|')[1]!.matchAll(/`([^`]+)`/g)].map((m) => m[1]!))
}

describe('legacy redirects', () => {
  it('cover every redirect in the route migration map', () => {
    const documented = documentedRedirects()
    expect(documented.length).toBeGreaterThan(10)
    const implemented = [...legacyRedirects.map((r) => r.from), ...Object.keys(legacyHomeAnchors)]
    // Param names differ between the doc and the table (:blogId vs :id), so compare with params blanked.
    const shape = (path: string) => path.replace(/:\w+/g, ':')
    expect(implemented.map(shape).sort()).toEqual(documented.map(shape).sort())
  })

  it.each(legacyRedirects)('$from → $to, replacing the history entry', async ({ from, to }) => {
    const router = open(`${withSampleParams(from)}?ref=old`)
    await expectReplacedWith(router, withSampleParams(to), { search: '?ref=old' })
  })

  it.each(Object.entries(legacyHomeAnchors))('/%s → %s, replacing the history entry', async (anchor, to) => {
    const router = open(`/${anchor}`)
    const [pathname, hash = ''] = to.split('#')
    await expectReplacedWith(router, pathname!, { hash: hash && `#${hash}` })
  })

  it('specs/site-navigation example: /blogs/ai-agents lands on /writing/ai-agents', async () => {
    const router = open('/blogs/ai-agents')
    await expectReplacedWith(router, '/writing/ai-agents')
  })

  it('specs/site-navigation example: an old sign-in link lands on / with no sign-in or account control', async () => {
    const router = open('/signin?from=/work')
    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
    expect(router.state.historyAction).toBe('REPLACE')
    expect(await screen.findByRole('heading', { level: 1 })).not.toHaveTextContent('Page not found')
    expect(screen.queryByRole('link', { name: /sign in|account/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /sign out|account/i })).not.toBeInTheDocument()
  })
})

describe('not found', () => {
  it('renders inside the shell with search, Ask and the main sections', async () => {
    const router = open('/nope')
    expect(await screen.findByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByText('/nope')).toBeInTheDocument()

    const sections = screen.getByRole('navigation', { name: 'Main sections' })
    for (const name of ['Home', 'Work', 'Experience', 'Writing', 'Knowledge', 'About', 'Ask', 'Contact']) {
      expect(within(sections).getByRole('link', { name })).toBeInTheDocument()
    }

    await userEvent.type(screen.getByLabelText('What were you looking for?'), 'fixed price')
    await userEvent.click(within(screen.getByRole('search')).getByRole('button', { name: 'Ask' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/ask'))
    expect(router.state.location.search).toBe('?q=fixed+price')
  })
})
