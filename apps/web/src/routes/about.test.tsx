import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { about, credentials, profile } from '@/content/index.ts'
import { Component as About } from './about.tsx'

// /about (specs/portfolio-narrative "About page"; specs/content-pages "About, Colophon and Legal").
function renderAbout() {
  return render(
    <MemoryRouter>
      <About />
    </MemoryRouter>,
  )
}

describe('/about', () => {
  it('presents the story, principles and credentials', () => {
    renderAbout()
    expect(screen.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument()
    const story = screen.getByRole('region', { name: /^Story/ })
    for (const paragraph of about.story) expect(within(story).getByText(paragraph)).toBeInTheDocument()
    const principles = screen.getByRole('region', { name: /^How I lead/ })
    expect(within(principles).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(about.principles.map((p) => p.title))
    const ledger = screen.getByRole('region', { name: 'Credentials' })
    expect(within(ledger).getByText(credentials.education[0]!.degree)).toBeInTheDocument()
  })

  it('renders no portrait (DD-4: Home only)', () => {
    const { container } = renderAbout()
    expect(container.querySelector('img')).toBeNull()
    expect(screen.queryByRole('img', { name: profile.portrait.alt })).toBeNull()
  })

  it('is final copy: no draft marking, and four principles each with an example', () => {
    const { container } = renderAbout()
    expect(container.querySelector('[data-placeholder]')).toBeNull()
    expect(screen.queryByText(/Draft copy|Placeholder copy/)).toBeNull()
    const principles = screen.getByRole('region', { name: /^How I lead/ })
    expect(about.principles).toHaveLength(4)
    for (const principle of about.principles) expect(within(principles).getByText(principle.evidence)).toBeInTheDocument()
  })

  it('says who gave the Project of the Year (specs/portfolio-narrative "Scoped recognition")', () => {
    renderAbout()
    const recognition = document.getElementById('recognition')!
    expect(within(recognition).getByText(/Cognizant internal recognition/)).toBeInTheDocument()
  })

  it('keeps the legacy #summary, #education and #recognition anchors working', () => {
    renderAbout()
    for (const id of ['summary', 'education', 'recognition']) expect(document.getElementById(id)).toBeInTheDocument()
  })
})
