import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { projects } from '@/content/index.ts'
import { ProjectCard } from './ProjectCard.tsx'

const fastJiraql = projects.find((p) => p.slug === 'fast-jiraql')!

describe('ProjectCard', () => {
  it('links to the case study with title, delivered status, summary and the first three stack items', () => {
    render(
      <MemoryRouter>
        <ProjectCard project={fastJiraql} />
      </MemoryRouter>,
    )
    const card = screen.getByRole('link')
    expect(card).toHaveAttribute('href', '/work/fast-jiraql')
    expect(screen.getByRole('heading', { level: 3, name: 'Fast-JiraQL' })).toBeVisible()
    expect(screen.getByText('Delivered · 2023')).toBeVisible()
    expect(screen.getByText(fastJiraql.summary)).toBeVisible()
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(fastJiraql.stack.slice(0, 3))
  })

  it('shows In flight instead of a delivery year for a project still being built', () => {
    render(
      <MemoryRouter>
        <ProjectCard project={{ ...fastJiraql, status: 'in-flight' }} />
      </MemoryRouter>,
    )
    expect(screen.getByText('In flight')).toBeVisible()
    expect(screen.queryByText(/Delivered/)).toBeNull()
  })

  it('draws the typographic architecture thumbnail when there is no screenshot, hidden from assistive tech', () => {
    const { container } = render(
      <MemoryRouter>
        <ProjectCard project={{ ...fastJiraql, screenshot: undefined }} />
      </MemoryRouter>,
    )
    const thumb = container.querySelector('[aria-hidden="true"]')!
    expect(thumb.textContent).toBe(fastJiraql.architecture.join(''))
    expect(screen.queryByRole('img')).toBeNull()
  })
})
