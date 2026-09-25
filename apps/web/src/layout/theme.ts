import { useSyncExternalStore } from 'react'

// Theme preference (specs/design-system "Themes"): light, dark or follow the OS. It is saved to the
// `themeMode` cookie when Klaro consent allows (the essential-cookies service, as in apps/portfolio) and
// always to local storage. The inline script in index.html reads both, in the same order, before first paint.
export type ThemePreference = 'light' | 'dark' | 'system'
export type Theme = 'light' | 'dark'

declare global {
  interface Window {
    /** Klaro consent manager, when the consent banner is loaded on the page. */
    klaro?: { getManager?: () => { consents?: Record<string, boolean> } | undefined }
  }
}

export const THEME_KEY = 'themeMode'
const COOKIE = /(?:^|;\s*)themeMode=(light|dark|system)\b/
const DARK_QUERY = '(prefers-color-scheme: dark)'
const ONE_YEAR = 60 * 60 * 24 * 365

export const isPreference = (value: unknown): value is ThemePreference =>
  value === 'light' || value === 'dark' || value === 'system'

/** The saved preference: cookie first, then local storage, else follow the OS. */
export function readPreference(): ThemePreference {
  try {
    const saved = COOKIE.exec(document.cookie)?.[1] ?? localStorage.getItem(THEME_KEY)
    return isPreference(saved) ? saved : 'system'
  } catch {
    return 'system'
  }
}

export const resolveTheme = (preference: ThemePreference): Theme =>
  preference === 'system' ? (matchMedia(DARK_QUERY).matches ? 'dark' : 'light') : preference

/** Without Klaro on the page there is nothing to consent to, so the cookie is written (apps/portfolio behaviour). */
function cookieConsent() {
  if (!window.klaro) return true
  try {
    return window.klaro.getManager?.()?.consents?.essentialCookies === true
  } catch {
    return false
  }
}

function persist(preference: ThemePreference) {
  try {
    localStorage.setItem(THEME_KEY, preference)
  } catch {
    // Storage blocked; the choice lasts for this page view.
  }
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  // Without consent, drop any older cookie: it takes precedence at load and would undo this choice.
  const lifetime = cookieConsent() ? ONE_YEAR : 0
  document.cookie = `${THEME_KEY}=${preference}; Max-Age=${lifetime}; Path=/; SameSite=Strict${secure}`
}

let current: ThemePreference | undefined
const listeners = new Set<() => void>()

export const getPreference = (): ThemePreference => (current ??= readPreference())

export function applyTheme() {
  document.documentElement.dataset.theme = resolveTheme(getPreference())
}

export function setPreference(preference: ThemePreference) {
  current = preference
  persist(preference)
  applyTheme()
  listeners.forEach((listener) => listener())
}

/**
 * Keeps `data-theme` in step with the OS while the preference is "system", and writes the cookie once
 * Klaro consent is granted. Returns the cleanup function; the AppShell runs it for the app's lifetime.
 */
export function syncTheme() {
  const media = matchMedia(DARK_QUERY)
  const onSchemeChange = () => {
    if (getPreference() === 'system') applyTheme()
  }
  const onConsentChange = () => {
    if (cookieConsent()) persist(getPreference())
  }
  applyTheme()
  media.addEventListener('change', onSchemeChange)
  document.addEventListener('klaro-consent-changed', onConsentChange)
  return () => {
    media.removeEventListener('change', onSchemeChange)
    document.removeEventListener('klaro-consent-changed', onConsentChange)
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useThemePreference(): ThemePreference {
  return useSyncExternalStore(subscribe, getPreference, () => 'system')
}
