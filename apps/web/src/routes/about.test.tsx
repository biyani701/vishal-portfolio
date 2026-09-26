import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { about, credentials, profile } from '@/content/index.ts'
import { Component as About } from './about.tsx'

// Task 7.2: /about (specs/content-pages "About, Colophon and Legal").
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
    const principles = screen.getByRole('region', { name: /^How I work/ })
    expect(within(principles).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(about.principles.map((p) => p.title))
    const ledger = screen.getByRole('region', { name: 'Credentials' })
    expect(within(ledger).getByText(credentials.education[0]!.degree)).toBeInTheDocument()
  })

  it('renders no portrait (DD-4: Home only)', () => {
    const { container } = renderAbout()
    expect(container.querySelector('img')).toBeNull()
    expect(screen.queryByRole('img', { name: profile.portrait.alt })).toBeNull()
  })

  it('clearly marks placeholder copy while About is a draft', () => {
    expect(about.draft).toBe(true)
    renderAbout()
    expect(screen.getByRole('complementary', { name: 'Placeholder copy' })).toHaveTextContent('are a draft')
    expect(within(screen.getByRole('region', { name: /^Story/ })).getByText('Draft copy')).toBeInTheDocument()
    expect(within(screen.getByRole('region', { name: /^How I work/ })).getByText('Draft copy')).toBeInTheDocument()
    expect(within(screen.getByRole('region', { name: 'Credentials' })).queryByText('Draft copy')).toBeNull()
  })

  it('keeps the legacy #summary, #education and #recognition anchors working', () => {
    renderAbout()
    for (const id of ['summary', 'education', 'recognition']) expect(document.getElementById(id)).toBeInTheDocument()
  })
})
