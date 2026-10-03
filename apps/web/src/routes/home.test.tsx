import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'
import { featuredProgrammes, featuredTools, profile, projects } from '@/content/index.ts'
import { Component as Home } from './home.tsx'

// Every Home section from specs/portfolio-narrative "Home story order", drawn from the content records.
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
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('I lead delivery. I understand payments. I build tools.')
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
      'Programmes I’ve led',
      'Delivery tools',
      'Ask the portfolio',
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

  it('shows the three programme case studies first, linking to their case studies and to all programmes', () => {
    renderHome()
    const section = screen.getByRole('region', { name: 'Programmes I’ve led' })
    const cards = within(section).getAllByRole('heading', { level: 3 })
    expect(cards.map((h) => h.textContent)).toEqual(featuredProgrammes.map((p) => p.title))
    expect(cards.map((h) => h.textContent)).toEqual([
      'Building predictable delivery at scale',
      'Stabilising a 50+ application portfolio',
      'Re-engineering market reference-data processing',
    ])
    expect(within(section).getByRole('link', { name: /Building predictable delivery at scale/ })).toHaveAttribute('href', '/work/corecard-predictable-delivery')
    const all = projects.filter((p) => p.kind === 'programme').length
    expect(within(section).getByRole('link', { name: `All ${all} programmes →` })).toHaveAttribute('href', '/work?kind=programme')
  })

  it('shows three delivery tools after the programmes, with no independent projects on Home', () => {
    renderHome()
    const section = screen.getByRole('region', { name: 'Delivery tools' })
    expect(within(section).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(featuredTools.map((p) => p.title))
    expect(featuredTools.map((p) => p.slug)).toEqual(['fast-jiraql', 'jira-dashboard', 'confluence-pages-details'])
    const titles = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    for (const title of ['Blog Platform', 'Knowledge Base', 'Multi-client OAuth Server']) expect(titles).not.toContain(title)
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

  it('offers starter questions as links that fill in Ask', () => {
    renderHome()
    expect(screen.getByRole('link', { name: 'What did he change at the IFC? →' })).toHaveAttribute(
      'href',
      '/ask?prefill=What+did+he+change+at+the+IFC%3F',
    )
  })
})
