import { resolveConfig } from './schema.ts'

declare global {
  interface Window {
    /** Set by `/runtime-config.js` before the app loads; overrides the build-time `VITE_*` values. */
    runtimeConfig?: Record<string, unknown>
  }
}

export type { AppConfig } from './schema.ts'
export const config = resolveConfig(import.meta.env, window.runtimeConfig)
