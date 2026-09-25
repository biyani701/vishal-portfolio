import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { routes } from '@/router.tsx'
import { authSettings, fetchSession, rememberReturnPath, signInUrl, signOutUrl, takeReturnPath } from './client.ts'

const settings = { serverUrl: 'https://auth.example.test', clientId: 'portfolio', providers: [] }

function configure() {
  vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.test')
  vi.stubEnv('VITE_AUTH_SERVER_URL', 'https://auth.example.test')
}

afterEach(() => {
  vi.unstubAllEnvs()
  sessionStorage.clear()
})

describe('Auth.js contract (unchanged from apps/portfolio)', () => {
  it('signs in through the auth server, returning to /auth-callback', () => {
    expect(signInUrl(settings, 'github', 'https://vishal.biyani.xyz')).toBe(
      'https://auth.example.test/api/auth/signin/github?callbackUrl=https%3A%2F%2Fvishal.biyani.xyz%2Fauth-callback&clientId=portfolio&origin=https%3A%2F%2Fvishal.biyani.xyz',
    )
  })

  it('signs out through the auth server, returning to Home', () => {
    expect(signOutUrl(settings, 'https://vishal.biyani.xyz')).toBe(
      'https://auth.example.test/api/auth/signout?callbackUrl=https%3A%2F%2Fvishal.biyani.xyz%2F',
    )
  })

  it('reads the session with credentials and maps the user', async () => {
    const fetch = vi.fn(async () => new Response(JSON.stringify({ user: { name: 'Ada', email: 'ada@example.test', image: 'https://i' }, accessToken: 't' })))
    vi.stubGlobal('fetch', fetch)
    expect(await fetchSession(settings)).toEqual({
      user: { name: 'Ada', email: 'ada@example.test', image: 'https://i', login: undefined },
      accessToken: 't',
      provider: undefined,
    })
    expect(fetch).toHaveBeenCalledWith('https://auth.example.test/api/auth/session', expect.objectContaining({ credentials: 'include' }))
  })

  it('treats an empty or failed session response as signed out', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}')))
    expect(await fetchSession(settings)).toBeNull()
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new TypeError('offline'))))
    expect(await fetchSession(settings)).toBeNull()
  })

  it('returns only to a path on this site', () => {
    rememberReturnPath('/work/fast-jiraql')
    expect(takeReturnPath()).toBe('/work/fast-jiraql')
    expect(takeReturnPath()).toBe('/') // used once
    rememberReturnPath('//evil.example')
    expect(takeReturnPath()).toBe('/')
  })

  it('reads providers from configuration, defaulting to GitHub and Google', () => {
    configure()
    expect(authSettings()).toMatchObject({
      providers: [
        { id: 'github', name: 'GitHub' },
        { id: 'google', name: 'Google' },
      ],
    })
  })
})

describe('/signin (specs/auth-integration "Sign-in page")', () => {
  let assign: ReturnType<typeof vi.fn>
  beforeEach(() => {
    assign = vi.fn()
    vi.stubGlobal('location', { ...window.location, origin: 'https://vishal.biyani.xyz', assign })
  })

  function open(path = '/signin?from=/work') {
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />)
  }

  it('lists providers as labelled buttons and shows a busy state while redirecting', async () => {
    configure()
    open()
    await userEvent.click(await screen.findByRole('button', { name: 'Continue with GitHub' }))
    expect(screen.getByRole('status')).toHaveTextContent('Redirecting to GitHub…')
    expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeDisabled()
    expect(assign).toHaveBeenCalledWith(expect.stringMatching(/^https:\/\/auth\.example\.test\/api\/auth\/signin\/github\?/))
    expect(sessionStorage.getItem('auth_redirect')).toBe('/work')
  })

  it('shows a recoverable error when the auth server URL is missing', async () => {
    // Blank rather than unset: CI exports VITE_AUTH_SERVER_URL for the whole workflow, and Vite inlines it.
    vi.stubEnv('VITE_AUTH_SERVER_URL', '')
    open()
    await userEvent.click(await screen.findByRole('button', { name: 'Continue with GitHub' }))
    expect(screen.getByRole('alert')).toHaveTextContent("Sign-in isn't available right now")
    expect(screen.getByRole('button', { name: 'Continue with GitHub' })).toBeEnabled()
    expect(assign).not.toHaveBeenCalled()
  })
})

describe('/auth-callback', () => {
  it('reads the session and returns to where sign-in started', async () => {
    configure()
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ user: { name: 'Ada' } }))))
    rememberReturnPath('/work')
    const router = createMemoryRouter(routes, { initialEntries: ['/auth-callback'] })
    render(<RouterProvider router={router} />)
    await waitFor(() => expect(router.state.location.pathname).toBe('/work'))
    expect(router.state.historyAction).toBe('REPLACE')
  })

  it('reports a provider error', async () => {
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/api/auth/callback/github?error=AccessDenied'] })} />)
    expect(await screen.findByRole('alert')).toHaveTextContent('AccessDenied')
  })
})
