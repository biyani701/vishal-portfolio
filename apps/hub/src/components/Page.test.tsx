import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { hub, labUrl, type Hub } from '../../content/sites.ts'
import { render as renderStatic } from '../entry-server.tsx'
import { Page } from './Page.tsx'

// specs/domain-hub "Hub content" and "Static, accessible and on-brand".
const renderPage = (data: Hub = hub) => render(<Page hub={data} year={2026} />)

describe('hub page', () => {
  it('leads with the name, the positioning line and the portfolio as the primary action', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Vishal Biyani.')
    expect(screen.getByText(hub.identity.line)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Visit the portfolio/ })).toHaveAttribute('href', 'https://vishal.biyani.xyz')
  })

  it('presents Sites before Labs, and Labs with a smaller heading', () => {
    renderPage()
    const headings = screen.getAllByRole('heading').map((h) => [h.tagName, h.textContent])
    expect(headings.map(([, text]) => text)).toEqual(['Vishal Biyani.', 'Sites', 'Portfolio', 'Blog', 'Knowledge Base', 'Labs'])
    expect(screen.getByRole('heading', { name: 'Sites' })).toHaveClass('text-h2')
    expect(screen.getByRole('heading', { name: 'Labs' })).toHaveClass('text-h3')
  })

  it('links a live site and shows "In progress" without a link for one that is not live', () => {
    renderPage()
    const sites = screen.getByRole('region', { name: 'Sites' })
    expect(within(sites).getByRole('link', { name: /Portfolio/ })).toHaveAttribute('href', 'https://vishal.biyani.xyz')
    for (const name of ['Blog', 'Knowledge Base']) {
      const card = within(sites).getByRole('heading', { name }).parentElement!
      expect(card.tagName).toBe('DIV')
      expect(card).toHaveTextContent('In progress')
      expect(card.closest('a')).toBeNull()
    }
    expect(sites.innerHTML).not.toMatch(/href="https:\/\/(blog|kb)\.biyani\.xyz/)
  })

  it('links each Labs entry to its page under www.biyani.xyz, and never the old portfolio or shortfall', () => {
    renderPage()
    const labs = screen.getByRole('region', { name: 'Labs' })
    expect(within(labs).getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(hub.labs.entries.map(labUrl))
    for (const path of ['portfolio', 'shortfall', 'my-oauth-proxy']) expect(labs.innerHTML).not.toContain(`/${path}/`)
  })

  it('renders the theme toggle hidden, so the page is complete without JavaScript', () => {
    renderPage()
    expect(document.querySelector('[data-theme-toggle]')).toHaveAttribute('hidden')
  })

  it('renders to static markup for the build', () => {
    const html = renderStatic(2026)
    expect(html).toContain('id="main"')
    expect(html).toContain('© 2026 Vishal Biyani')
    expect(html).not.toContain('<script')
  })
})
