import { act, render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { stubMatchMedia } from '@/test/media.ts'
import { routes } from './router.tsx'

function renderApp(path = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}

describe('app smoke test', () => {
  it('renders the home route through the router', async () => {
    renderApp()
    // The lazy Home module can take over a second to load in jsdom on a cold run.
    const hero = await screen.findByRole('heading', { level: 1, name: 'I lead delivery. I build tools. I explain payments.' }, { timeout: 3000 })
    expect(hero).toBeInTheDocument()
  })
})

describe('AppShell', () => {
  it('frames every page with a header, a skip link to the main landmark and a footer', async () => {
    renderApp('/work')
    expect(await screen.findByRole('heading', { level: 1, name: 'Work' })).toBeInTheDocument()

    const main = screen.getByRole('main')
    expect(main).toHaveAttribute('id', 'main')
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main')
    expect(screen.getByRole('banner')).toContainElement(screen.getByRole('link', { name: 'Vishal Biyani' }))
    expect(screen.getByRole('banner')).toContainElement(screen.getByRole('button', { name: /^Theme: / }))
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('exposes the layout mode and follows viewport changes', async () => {
    const viewport = stubMatchMedia({ width: 390, height: 844 })
    const { container } = renderApp()
    await screen.findByRole('main')
    const shell = container.querySelector('[data-layout-mode]')
    expect(shell).toHaveAttribute('data-layout-mode', 'mobile')

    act(() => viewport.resize(844, 390))
    expect(shell).toHaveAttribute('data-layout-mode', 'compact-landscape')
  })
})
