import type { Plugin } from 'vite'
import { checkUrl, configKeys, requiredEnvNames } from '../src/config/schema.ts'

// Vite inlines every VITE_* variable into the public bundle, so names like these must never exist.
const SECRET_LIKE = /SECRET|TOKEN|PASSWORD|PRIVATE/i

/** Fails `vite build` when a required VITE_* variable is missing or invalid (specs/web-platform "Missing variable"). */
export function envCheck(): Plugin {
  return {
    name: 'portfolio:env-check',
    apply: 'build',
    configResolved({ env }) {
      const value = (name: string) => String(env[name] ?? '').trim()
      const problems = requiredEnvNames.filter((name) => !value(name)).map((name) => `missing required variable ${name}`)

      for (const key of Object.values(configKeys)) {
        const problem = key.url && value(key.env) ? checkUrl(key.env, value(key.env)) : undefined
        if (problem) problems.push(problem)
      }

      for (const name of Object.keys(env)) {
        if (name.startsWith('VITE_') && SECRET_LIKE.test(name)) {
          problems.push(`${name} looks like a secret; VITE_* variables are public`)
        }
      }

      if (problems.length) {
        throw new Error(
          `Build configuration error: ${problems.join('; ')}.\n` +
            'Set build variables in the environment or apps/web/.env.local (see apps/web/.env.example).',
        )
      }
    },
  }
}
