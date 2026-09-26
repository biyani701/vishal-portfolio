import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'
import { featuredProjects, highlightedProjects, profile, projects } from '@/content/index.ts'
import { Component as Home } from './home.tsx'

// Task 6.3: every Home section from specs/content-pages "Home", drawn from the content records.
function AskProbe() {
  const { pathname, search } = useLocation()
  return <p data-testid="ask">{pathname + search}</p>
}

function renderHome() {
  const router = createMemoryRouter(
    [
      { path: '/', element: <Home /> },
      { path: '/ask', element: <AskProbe /> },
    ],
    { initialEntries: ['/'] },
  )
  return render(<RouterProvider router={router} />)
}

describe('Home', () => {
  it('opens with the hero: statement, lede, both actions and the portrait', () => {
    renderHome()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('I lead delivery. I build tools. I explain payments.')
    expect(screen.getByText(profile.lede)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'See the work' })).toHaveAttribute('href', '/work')
    expect(screen.getByRole('link', { name: 'Ask about my experience' })).toHaveAttribute('href', '/ask')
    expect(screen.getByRole('img', { name: profile.portrait.alt })).toBeVisible()
  })

  it('presents the sections in order under a single h1', () => {
    renderHome()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Programme line',
      'Proof',
      'Selected work',
      'Ask the portfolio',
      'Independent projects',
      "Running a programme that has to land? Let's talk.",
    ])
  })

  it('lists the proof figures with their full labels', () => {
    renderHome()
    const proof = screen.getByRole('region', { name: 'Proof' })
    expect(within(proof).getAllByRole('listitem').map((li) => li.textContent)).toEqual(
      profile.proof.map((item) => item.value + item.label),
    )
  })

  it('shows the three featured projects, linking to their case studies and to all projects', () => {
    renderHome()
    const work = screen.getByRole('region', { name: 'Selected work' })
    const cards = within(work).getAllByRole('heading', { level: 3 })
    expect(cards.map((h) => h.textContent)).toEqual(featuredProjects.map((p) => p.title))
    expect(cards).toHaveLength(3)
    expect(within(work).getByRole('link', { name: /^Fast-JiraQL/ })).toHaveAttribute('href', '/work/fast-jiraql')
    expect(within(work).getByRole('link', { name: `All ${projects.length} projects →` })).toHaveAttribute('href', '/work')
  })

  it('highlights the separately hosted projects with their status, linking to their case studies', () => {
    renderHome()
    const section = screen.getByRole('region', { name: 'Independent projects' })
    expect(within(section).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Knowledge Base',
      'Blog Platform',
      'Multi-client OAuth Server',
    ])
    expect(within(section).getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(
      highlightedProjects.map((p) => `/work/${p.slug}`),
    )
    expect(within(section).getAllByText('In flight')).toHaveLength(2)
    expect(within(section).getByText('Delivered · 2025')).toBeVisible()
  })

  it('has no links to the removed Writing and Knowledge sections', () => {
    const { container } = renderHome()
    const hrefs = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href') ?? '')
    expect(hrefs.filter((href) => /^\/(writing|knowledge)(\/|$)/.test(href))).toEqual([])
  })

  it('ends with the contact band', () => {
    renderHome()
    expect(screen.getByRole('link', { name: 'Start a conversation' })).toHaveAttribute('href', '/contact')
  })
})

describe('Home Ask input', () => {
  it('opens Ask with the typed question', async () => {
    const user = userEvent.setup()
    renderHome()
    await user.type(screen.getByRole('textbox', { name: 'Your question' }), 'Fixed price at scale?{Enter}')
    expect(screen.getByTestId('ask')).toHaveTextContent('/ask?q=Fixed+price+at+scale%3F')
  })

  it('opens Ask with nothing filled in when the question is blank', async () => {
    const user = userEvent.setup()
    renderHome()
    await user.click(screen.getByRole('button', { name: 'Ask' }))
    expect(screen.getByTestId('ask').textContent).toBe('/ask')
  })

  it('offers starter questions as links into Ask', () => {
    renderHome()
    expect(screen.getByRole('link', { name: 'What did he run at the IFC? →' })).toHaveAttribute(
      'href',
      '/ask?q=What+did+he+run+at+the+IFC%3F',
    )
  })
})
