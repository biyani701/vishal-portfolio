import { resolveConfig } from '@/config/schema.ts'

// The existing Auth.js server contract (specs/auth-integration), unchanged from apps/portfolio:
// - sign in:  GET {auth}/api/auth/signin/{provider}?callbackUrl={site}/auth-callback&clientId=…&origin={site}
// - session:  GET {auth}/api/auth/session (cookie credentials)
// - sign out: GET {auth}/api/auth/signout?callbackUrl={site}/
// The provider sends the visitor back to one of the preserved callback paths, which read the session and
// return them to the page they started from.

const RETURN_KEY = 'auth_redirect'

export interface AuthUser {
  name: string
  email?: string
  image?: string
  /** GitHub login, when signed in with GitHub. */
  login?: string
}

export interface Session {
  user: AuthUser
  /** OAuth access token, when the auth server exposes it (GitHub: used to list repositories on /account). */
  accessToken?: string
  provider?: string
}

export interface Provider {
  id: string
  name: string
}

const NAMES: Record<string, string> = { github: 'GitHub', google: 'Google', linkedin: 'LinkedIn', facebook: 'Facebook', auth0: 'Auth0' }

export interface AuthSettings {
  serverUrl: string
  clientId: string
  providers: Provider[]
}

/** Auth configuration, or an error to show; never throws, so a misconfigured site still renders. */
export function authSettings(): AuthSettings | { error: string } {
  try {
    const config = resolveConfig(import.meta.env, window.runtimeConfig)
    const providers = config.authProviders
      .split(',')
      .map((id) => id.trim().toLowerCase())
      .filter(Boolean)
      .map((id) => ({ id, name: NAMES[id] ?? id }))
    return { serverUrl: config.authServerUrl, clientId: config.authClientId, providers }
  } catch (error) {
    return { error: (error as Error).message }
  }
}

/** Where the provider sends the visitor back; `returnTo` is restored from session storage after the round trip. */
export function signInUrl(settings: AuthSettings, provider: string, origin = location.origin) {
  const params = new URLSearchParams({ callbackUrl: `${origin}/auth-callback`, clientId: settings.clientId, origin })
  return `${settings.serverUrl}/api/auth/signin/${encodeURIComponent(provider)}?${params}`
}

export function signOutUrl(settings: Pick<AuthSettings, 'serverUrl'>, origin = location.origin) {
  return `${settings.serverUrl}/api/auth/signout?${new URLSearchParams({ callbackUrl: `${origin}/` })}`
}

export function rememberReturnPath(path: string) {
  try {
    sessionStorage.setItem(RETURN_KEY, path)
  } catch {
    // Storage blocked: the visitor lands on Home instead.
  }
}

/** The saved page to return to, only if it's a path on this site. */
export function takeReturnPath(): string {
  let path: string | null = null
  try {
    path = sessionStorage.getItem(RETURN_KEY)
    sessionStorage.removeItem(RETURN_KEY)
  } catch {
    // ignore
  }
  return path && path.startsWith('/') && !path.startsWith('//') ? path : '/'
}

function toSession(data: unknown): Session | null {
  if (!data || typeof data !== 'object' || !('user' in data)) return null
  const raw = data as { user?: Record<string, unknown>; accessToken?: unknown; provider?: unknown }
  const user = raw.user
  if (!user || typeof user !== 'object') return null
  const text = (value: unknown) => (typeof value === 'string' && value ? value : undefined)
  return {
    user: {
      name: text(user.name) ?? text(user.login) ?? 'Signed in',
      email: text(user.email),
      image: text(user.image) ?? text(user.avatar_url),
      login: text(user.login),
    },
    accessToken: text(raw.accessToken),
    provider: text(raw.provider) ?? text(user.provider),
  }
}

/** The current session, or null when signed out or the auth server can't be reached. */
export async function fetchSession(settings: Pick<AuthSettings, 'serverUrl'>, signal?: AbortSignal): Promise<Session | null> {
  try {
    const response = await fetch(`${settings.serverUrl}/api/auth/session`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
      signal,
    })
    if (!response.ok) return null
    const body = await response.text()
    return body ? toSession(JSON.parse(body)) : null
  } catch {
    return null
  }
}
