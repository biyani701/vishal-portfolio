// CORS allow-list (specs/api-service "Service boundary"; design.md A9 `ALLOWED_ORIGINS`). Browser requests are
// accepted only from the site: the production origin, plus preview and local origins outside production.
// Patterns may use `*` for one DNS label or part of one, e.g. https://web-*-biyani701.vercel.app for PR previews.

export const PRODUCTION_ORIGIN = 'https://vishal.biyani.xyz'
const LOCAL_ORIGINS = ['http://localhost:5173', 'http://localhost:4173']

export interface OriginPolicy {
  patterns: readonly string[]
  allows(origin: string): boolean
}

const escape = (text: string) => text.replace(/[.+?^${}()|[\]\\]/g, '\\$&')

/** `*` matches letters, digits and hyphens only, so it can never span a dot or reach another domain. */
function compile(pattern: string) {
  return new RegExp(`^${pattern.split('*').map(escape).join('[a-z0-9-]+')}$`)
}

export function originPolicy(patterns: readonly string[]): OriginPolicy {
  const compiled = patterns.map(compile)
  return { patterns, allows: (origin) => compiled.some((re) => re.test(origin.toLowerCase())) }
}

export interface OriginEnv {
  ALLOWED_ORIGINS?: string
  /** Set by Vercel: production, preview or development. Unset locally. */
  VERCEL_ENV?: string
}

/**
 * The allow-list for this environment. Production accepts only exact origins: wildcard patterns and localhost
 * are dropped there even if configured, so a preview setting copied into production can't widen it.
 */
export function allowedOrigins(env: OriginEnv): string[] {
  const configured = (env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean)
  const base = configured.length > 0 ? configured : [PRODUCTION_ORIGIN]
  if (env.VERCEL_ENV === 'production') return base.filter((origin) => !origin.includes('*') && !origin.startsWith('http://'))
  return [...new Set([...base, ...LOCAL_ORIGINS])]
}
