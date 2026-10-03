import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { projects } from '@/content/index.ts'
import { Component as Work } from './work.tsx'

// /work lists every project, programmes first, and filters by kind, domain and stack, synced to the URL
// (specs/content-pages "Work"; specs/portfolio-narrative "Project kinds on Work").
function renderWork(url = '/work') {
  const router = createMemoryRouter([{ path: '/work', element: <Work /> }], { initialEntries: [url] })
  render(<RouterProvider router={router} />)
  return router
}

const cardTitles = () =>
  within(screen.getByRole('region', { name: 'Projects' }))
    .queryAllByRole('heading', { level: 3 })
    .map((h) => h.textContent)
const group = (name: string) => within(screen.getByRole('group', { name }))
const titlesWith = (test: (p: (typeof projects)[number]) => boolean) => projects.filter(test).map((p) => p.title)

describe('/work', () => {
  it('lists every project with no filter selected', () => {
    renderWork()
    expect(screen.getByRole('heading', { level: 1, name: 'Work' })).toBeInTheDocument()
    expect(cardTitles()).toEqual(projects.map((p) => p.title))
    expect(screen.getByRole('status')).toHaveTextContent(`${projects.length} projects`)
    for (const name of ['Kind', 'Domain']) expect(group(name).getByRole('button', { name: /^All/ })).toHaveAttribute('aria-pressed', 'true')
  })

  it('lists the programme case studies before the tools', () => {
    renderWork()
    const kinds = projects.map((p) => p.kind)
    expect(kinds.slice(0, 3)).toEqual(['programme', 'programme', 'programme'])
    expect(kinds.slice(3).every((kind) => kind === 'tool')).toBe(true)
  })

  it('specs/portfolio-narrative scenario: ?kind=programme lists only the three programmes and shows the filter selected', () => {
    renderWork('/work?kind=programme')
    expect(cardTitles()).toEqual([
      'Building predictable delivery at scale',
      'Stabilising a 50+ application portfolio',
      'Re-engineering market reference-data processing',
    ])
    expect(group('Kind').getByRole('button', { name: /^Programmes/ })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('status')).toHaveTextContent(`3 of ${projects.length} projects`)
  })

  it('filters by kind, writing it to the URL', async () => {
    const router = renderWork()
    await userEvent.click(group('Kind').getByRole('button', { name: /^Tools/ }))
    expect(router.state.location.search).toBe('?kind=tool')
    expect(cardTitles()).toEqual(titlesWith((p) => p.kind === 'tool'))
  })

  it('specs/content-pages scenario: ?stack=python lists only Python projects and shows the filter selected', () => {
    renderWork('/work?stack=python')
    const python = titlesWith((p) => p.stack.includes('Python'))
    expect(python.length).toBeGreaterThan(0)
    expect(cardTitles()).toEqual(python)
    expect(screen.getByRole('combobox', { name: 'Stack' })).toHaveValue('Python')
    expect(screen.getByRole('status')).toHaveTextContent(`${python.length} of ${projects.length} projects`)
  })

  it('filters by domain, writing it to the URL without adding a history entry', async () => {
    const router = renderWork()
    await userEvent.click(screen.getByRole('button', { name: /^APIs/ }))
    expect(router.state.location.search).toBe('?domain=apis')
    expect(router.state.historyAction).toBe('REPLACE')
    expect(cardTitles()).toEqual(titlesWith((p) => p.domains.includes('apis')))
    expect(screen.getByRole('button', { name: /^APIs/ })).toHaveAttribute('aria-pressed', 'true')
  })

  it('combines domain and stack, and Clear filters resets both', async () => {
    const router = renderWork('/work?domain=web&stack=python')
    expect(cardTitles()).toEqual(titlesWith((p) => p.domains.includes('web') && p.stack.includes('Python')))
    await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(router.state.location.search).toBe('')
    expect(cardTitles()).toEqual(projects.map((p) => p.title))
  })

  it('says so when nothing matches', () => {
    renderWork('/work?domain=publishing&stack=python')
    expect(cardTitles()).toEqual([])
    expect(screen.getByText(/No project matches these filters/)).toBeInTheDocument()
  })

  it('ignores filter values that match nothing', () => {
    renderWork('/work?domain=nope&stack=cobol')
    expect(cardTitles()).toEqual(projects.map((p) => p.title))
    expect(screen.queryByRole('button', { name: 'Clear filters' })).toBeNull()
  })
})
