// Client configuration keys (specs/web-platform "Configuration"). Each value comes from a `VITE_*` build
// variable and can be overridden after deploy by `public/runtime-config.js` (window.runtimeConfig).
// Shared by the app and the build-time check, so it must stay free of DOM and Node APIs.

interface ConfigKey {
  /** Build variable, set in CI or `.env.local`. */
  env: `VITE_${string}`
  /** Key in `window.runtimeConfig`; names match the old apps/portfolio runtime config. */
  runtime: string
  required: boolean
  url: boolean
  fallback?: string
}

export const configKeys = {
  apiBaseUrl: { env: 'VITE_API_BASE_URL', runtime: 'API_BASE_URL', required: true, url: true },
  /** Analytics is off when unset. */
  analyticsApiUrl: { env: 'VITE_ANALYTICS_API_URL', runtime: 'ANALYTICS_API_URL', required: false, url: true },
} as const satisfies Record<string, ConfigKey>

type Keys = typeof configKeys
export type AppConfig = {
  [K in keyof Keys]: Keys[K] extends { required: true } | { fallback: string } ? string : string | undefined
}

const keyList: [string, ConfigKey][] = Object.entries(configKeys)

export const requiredEnvNames = keyList.filter(([, key]) => key.required).map(([, key]) => key.env)

/** Returns an error message if `value` isn't an absolute http(s) URL. */
export function checkUrl(name: string, value: string): string | undefined {
  try {
    const { protocol } = new URL(value)
    if (protocol === 'http:' || protocol === 'https:') return undefined
  } catch {
    // Not parseable; reported below.
  }
  return `${name} must be an absolute http(s) URL, got "${value}"`
}

const nonEmpty = (value: unknown) => (typeof value === 'string' && value.trim() ? value.trim() : undefined)

/** Merges build variables with runtime overrides; throws naming every missing or invalid value. */
export function resolveConfig(env: Record<string, unknown>, runtime: Record<string, unknown> = {}): AppConfig {
  const resolved: Record<string, string | undefined> = {}
  const problems: string[] = []

  for (const [name, key] of keyList) {
    const fromRuntime = nonEmpty(runtime[key.runtime])
    let value = fromRuntime ?? nonEmpty(env[key.env]) ?? key.fallback

    if (value === undefined) {
      if (key.required) problems.push(`${key.env} is required`)
    } else if (key.url) {
      const problem = checkUrl(fromRuntime ? `runtimeConfig.${key.runtime}` : key.env, value)
      if (problem) problems.push(problem)
      value = value.replace(/\/+$/, '')
    }
    resolved[name] = value
  }

  if (problems.length) throw new Error(`Invalid configuration: ${problems.join('; ')}`)
  return resolved as AppConfig
}
