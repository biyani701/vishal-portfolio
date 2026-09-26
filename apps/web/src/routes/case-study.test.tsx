import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadProject, projects } from '@/content/index.ts'
import { routes } from '@/router.tsx'
import { stubMatchMedia } from '@/test/media.ts'
import { Toaster } from '@/ui/toast.tsx'
import { Component as CaseStudy, loader } from './case-study.tsx'

// Task 8.2: /work/:slug renders every case study with its facts, ToC, architecture figure, prose and aside
// (specs/content-pages "Work"), and the ToC folds into a disclosure on phones (design package §7).
function renderCaseStudy(slug: string) {
  const router = createMemoryRouter([{ path: '/work/:slug', loader, Component: CaseStudy }], { initialEntries: [`/work/${slug}`] })
  render(
    <Toaster>
      <RouterProvider router={router} />
    </Toaster>,
  )
  return router
}

afterEach(() => vi.unstubAllGlobals())

describe('/work/:slug', () => {
  it.each(projects.map((project) => [project.slug, project] as const))('renders the %s case study', async (slug, meta) => {
    stubMatchMedia({ width: 1440, height: 900 })
    renderCaseStudy(slug)
    expect(await screen.findByRole('heading', { level: 1, name: meta.title })).toBeInTheDocument()

    const { headings } = (await loadProject(slug))!
    const toc = screen.getByRole('navigation', { name: 'On this page' })
    expect(within(toc).getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual(headings.map((h) => `#${h.id}`))
    for (const heading of headings) {
      expect(screen.getByRole('heading', { level: heading.depth, name: heading.text })).toHaveAttribute('id', heading.id)
    }

    expect(screen.getByRole('img', { name: `${meta.title} architecture: ${meta.architecture.join(', then ')}` })).toBeInTheDocument()
    expect(screen.getByText('Year').nextElementSibling).toHaveTextContent(String(meta.year))
    const aside = screen.getByRole('complementary', { name: 'About this project' })
    expect(within(aside).getByRole('link', { name: 'Ask about this →' })).toHaveAttribute(
      'href',
      `/ask?${new URLSearchParams({ about: `/work/${slug}` })}`,
    )
    expect(document.querySelector('[data-status]')).toHaveAttribute('data-status', meta.status)
  })

  it('folds the ToC into a closed disclosure on phones and closes it again after a section is chosen', async () => {
    stubMatchMedia({ width: 390, height: 844 })
    renderCaseStudy('fast-jiraql')
    const toggle = await screen.findByRole('button', { name: 'On this page' })
    const toc = screen.getByRole('navigation', { name: 'On this page' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(within(toc).queryByRole('link', { name: 'What it does' })).toBeNull()

    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(within(toc).getByRole('link', { name: 'What it does' }))
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('keeps the ToC open as a side column from tablet up', async () => {
    stubMatchMedia({ width: 768, height: 1024 })
    renderCaseStudy('fast-jiraql')
    const toc = await screen.findByRole('navigation', { name: 'On this page' })
    expect(within(toc).queryByRole('button')).toBeNull()
    expect(within(toc).getByRole('link', { name: 'What it does' })).toBeVisible()
  })

  it('lifts code into a CodeBlock whose Copy button copies the code and confirms by toast', async () => {
    stubMatchMedia({ width: 1440, height: 900 })
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } })
    renderCaseStudy('confluence-pages-details')

    await userEvent.click(await screen.findByRole('button', { name: 'Copy bash code' }))
    expect(writeText).toHaveBeenCalledWith('pip install get-confluence-space-pages-details')
    expect(await screen.findByText('Copied to clipboard')).toBeInTheDocument()
  })

  it('links the facts back to the filtered list and the aside to related work', async () => {
    stubMatchMedia({ width: 1440, height: 900 })
    renderCaseStudy('fast-jiraql')
    expect(await screen.findByRole('link', { name: 'APIs' })).toHaveAttribute('href', '/work?domain=apis')
    expect(screen.getByRole('link', { name: 'Strawberry GraphQL' })).toHaveAttribute('href', '/work?stack=strawberry-graphql')
    expect(screen.getByRole('link', { name: 'GitHub ↗' })).toHaveAttribute('href', 'https://github.com/biyani701/fast-jiraql')
    const related = screen.getByRole('region', { name: 'Related work' })
    expect(within(related).getAllByRole('link').length).toBeGreaterThan(0)
    expect(within(related).queryByRole('link', { name: /^Fast-JiraQL/ })).toBeNull()
  })

  it('renders the 404 page, inside the shell, for an unknown project', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/work/no-such-project'] })
    render(<RouterProvider router={router} />)
    expect(await screen.findByRole('heading', { level: 1, name: 'Page not found' }, { timeout: 3000 })).toBeInTheDocument()
  })
})
