import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { stubMatchMedia } from '@/test/media.ts'

// The store caches the preference per page load, so each test imports a fresh copy, as a reload would.
async function load() {
  vi.resetModules()
  const theme = await import('./theme.ts')
  const { ThemeControl } = await import('./ThemeControl.tsx')
  return { ...theme, ThemeControl }
}

const cookie = () => /(?:^|;\s*)themeMode=(\w+)/.exec(document.cookie)?.[1]
const dataTheme = () => document.documentElement.dataset.theme

beforeEach(() => {
  document.cookie = 'themeMode=; Max-Age=0; Path=/'
  localStorage.clear()
  delete window.klaro
  delete document.documentElement.dataset.theme
})

describe('reading the preference', () => {
  it('defaults to system', async () => {
    expect((await load()).readPreference()).toBe('system')
  })

  it('prefers the cookie over local storage, as the inline script in index.html does', async () => {
    localStorage.setItem('themeMode', 'light')
    expect((await load()).readPreference()).toBe('light')
    document.cookie = 'themeMode=dark; Path=/'
    expect((await load()).readPreference()).toBe('dark')
  })

  it('ignores unknown values', async () => {
    localStorage.setItem('themeMode', 'sepia')
    expect((await load()).readPreference()).toBe('system')
  })
})

describe('saving the preference', () => {
  it('writes local storage and the cookie, and applies the theme', async () => {
    const { setPreference } = await load()
    setPreference('dark')
    expect(localStorage.getItem('themeMode')).toBe('dark')
    expect(cookie()).toBe('dark')
    expect(dataTheme()).toBe('dark')
  })

  it('persists across a reload', async () => {
    ;(await load()).setPreference('dark')
    const reloaded = await load()
    expect(reloaded.getPreference()).toBe('dark')
  })

  it('without Klaro consent, uses local storage only and clears an older cookie', async () => {
    document.cookie = 'themeMode=light; Path=/'
    window.klaro = { getManager: () => ({ consents: { essentialCookies: false } }) }
    const { setPreference, readPreference } = await load()

    setPreference('dark')
    expect(cookie()).toBeUndefined()
    expect(localStorage.getItem('themeMode')).toBe('dark')
    expect(readPreference()).toBe('dark')
  })

  it('writes the cookie once consent is granted', async () => {
    const consents = { essentialCookies: false }
    window.klaro = { getManager: () => ({ consents }) }
    const { setPreference, syncTheme } = await load()
    const stop = syncTheme()
    setPreference('dark')
    expect(cookie()).toBeUndefined()

    consents.essentialCookies = true
    document.dispatchEvent(new Event('klaro-consent-changed'))
    expect(cookie()).toBe('dark')
    stop()
  })
})

describe('"system"', () => {
  it('follows the OS, including live changes', async () => {
    const os = stubMatchMedia({ width: 1440, height: 900, colorScheme: 'dark' })
    const { setPreference, syncTheme } = await load()
    const stop = syncTheme()
    expect(dataTheme()).toBe('dark')

    os.setColorScheme('light')
    expect(dataTheme()).toBe('light')

    setPreference('dark')
    os.setColorScheme('dark')
    os.setColorScheme('light')
    expect(dataTheme()).toBe('dark') // an explicit choice ignores the OS

    setPreference('system')
    expect(dataTheme()).toBe('light')
    stop()
  })
})

describe('ThemeControl', () => {
  it('shows the current preference and changes it', async () => {
    localStorage.setItem('themeMode', 'light')
    const { ThemeControl } = await load()
    render(<ThemeControl />)

    const group = screen.getByRole('group', { name: 'Theme' })
    expect(group).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Light theme' })).toHaveAttribute('aria-pressed', 'true')

    await userEvent.click(screen.getByRole('button', { name: 'Dark theme' }))
    expect(screen.getByRole('button', { name: 'Dark theme' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Light theme' })).toHaveAttribute('aria-pressed', 'false')
    expect(dataTheme()).toBe('dark')

    // Pressing the selected option keeps it selected.
    await userEvent.click(screen.getByRole('button', { name: 'Dark theme' }))
    expect(screen.getByRole('button', { name: 'Dark theme' })).toHaveAttribute('aria-pressed', 'true')
    expect(localStorage.getItem('themeMode')).toBe('dark')
  })
})
