import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { routes } from './router.tsx'

describe('app smoke test', () => {
  it('renders the home route through the router', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/'] })
    render(<RouterProvider router={router} />)

    expect(await screen.findByRole('heading', { level: 1, name: 'Vishal Biyani' })).toBeInTheDocument()
  })
})
