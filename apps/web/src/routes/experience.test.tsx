import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { describeProgramme } from '@/components/programme/buildProgramme.ts'
import { credentials, milestones, organisations, roles, skills } from '@/content/index.ts'
import { Component as Experience } from './experience.tsx'

// Task 7.1: /experience (specs/content-pages "Experience", specs/programme-line "Status and selection").
// jsdom applies no layout-mode CSS, so every Programme Line form is in the DOM; these use the lanes.
function renderExperience(url = '/experience') {
  const router = createMemoryRouter([{ path: '/experience', element: <Experience /> }], { initialEntries: [url] })
  render(<RouterProvider router={router} />)
  return router
}

const panel = () => screen.getByRole('region', { name: (_, el) => el.hasAttribute('data-role-panel') })
const lanes = () => screen.getAllByRole('figure', { name: describeProgramme(organisations, roles, milestones) })[0]!
const segment = (label: RegExp) => within(lanes()).getByRole('link', { name: label })

describe('/experience', () => {
  it('shows the current role when the URL names none', () => {
    renderExperience()
    expect(screen.getByRole('heading', { level: 1, name: 'Experience' })).toBeInTheDocument()
    expect(panel()).toHaveAttribute('data-role-panel', 'corecard')
    expect(within(panel()).getByRole('heading', { level: 2, name: 'Principal Project Analyst' })).toBeInTheDocument()
    expect(segment(/^CoreCard/)).toHaveAttribute('aria-current', 'true')
  })

  it('specs/content-pages scenario: /experience#bfs-uk selects the BFS UK role', () => {
    renderExperience('/experience#bfs-uk')
    expect(panel()).toHaveAttribute('data-role-panel', 'bfs-uk')
    expect(within(panel()).getByRole('heading', { level: 2, name: 'Delivery Lead' })).toBeInTheDocument()
    expect(within(panel()).getByText(/for BFS UK Accounts · 8 banks/)).toBeInTheDocument()
    expect(within(panel()).getByText('Dec 2014 – Sep 2019')).toBeInTheDocument()
    expect(segment(/^BFS UK/)).toHaveAttribute('aria-current', 'true')
    expect(segment(/^CoreCard/)).not.toHaveAttribute('aria-current')
  })

  it('specs/programme-line scenario: choosing a segment with the keyboard updates the panel, keeping the history entry', async () => {
    const router = renderExperience()
    segment(/^IFC/).focus()
    await userEvent.keyboard('{Enter}')
    expect(router.state.location.hash).toBe('#ifc')
    expect(router.state.historyAction).toBe('REPLACE')
    expect(panel()).toHaveAttribute('data-role-panel', 'ifc')
    expect(segment(/^IFC/)).toHaveAttribute('aria-current', 'true')
    expect(screen.getByText('Showing Senior Manager, IFC, Nov 2012 – Dec 2014')).toHaveAttribute('aria-live', 'polite')
  })

  it('moves between roles with the earlier and later links', async () => {
    renderExperience('/experience#bfs-uk')
    const nav = () => within(panel()).getByRole('navigation', { name: 'Other roles' })
    await userEvent.click(within(nav()).getByRole('link', { name: '← Earlier: IFC' }))
    expect(panel()).toHaveAttribute('data-role-panel', 'ifc')
    await userEvent.click(within(nav()).getByRole('link', { name: 'Later: BFS UK →' }))
    await userEvent.click(within(nav()).getByRole('link', { name: 'Later: CoreCard →' }))
    expect(panel()).toHaveAttribute('data-role-panel', 'corecard')
    expect(within(nav()).queryByRole('link', { name: /^Later/ })).toBeNull()
  })

  it('offers "Ask about this role" with the role as context', () => {
    renderExperience('/experience#ifc')
    expect(within(panel()).getByRole('link', { name: 'Ask about this role →' })).toHaveAttribute(
      'href',
      `/ask?${new URLSearchParams({ about: '/experience#ifc' })}`,
    )
  })

  it('treats section anchors as sections, keeping the current role', () => {
    renderExperience('/experience#skills')
    expect(panel()).toHaveAttribute('data-role-panel', 'corecard')
    expect(document.getElementById('skills')).toHaveAccessibleName('Skills over time')
  })

  it('lists every skill with its years, and the credentials ledger', () => {
    renderExperience()
    const skillsSection = screen.getByRole('region', { name: 'Skills over time' })
    for (const skill of skills) expect(within(skillsSection).getByText(skill.name)).toBeInTheDocument()
    expect(within(skillsSection).getAllByText('2010 – 2020').length).toBeGreaterThan(0)

    const ledger = screen.getByRole('region', { name: 'Credentials' })
    for (const item of [...credentials.education.map((e) => e.degree), ...credentials.certifications.map((c) => c.title), ...credentials.recognition.map((r) => r.title)]) {
      expect(within(ledger).getByText(item)).toBeInTheDocument()
    }
    expect(document.getElementById('certifications')).toBeInTheDocument()
  })
})
