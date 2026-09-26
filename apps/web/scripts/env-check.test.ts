// @vitest-environment node
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'
import { afterEach, describe, expect, it } from 'vitest'

const root = fileURLToPath(new URL('..', import.meta.url))
// An empty env dir, so local .env files can't satisfy the check.
const envDir = mkdtempSync(join(tmpdir(), 'web-env-'))
const saved = { ...process.env }
const valid = { VITE_API_BASE_URL: 'https://api.example.test' }

async function buildWith(vars: Record<string, string>) {
  for (const name of Object.keys(process.env)) if (name.startsWith('VITE_')) delete process.env[name]
  Object.assign(process.env, vars)
  return build({ root, envDir, logLevel: 'silent', build: { write: false } })
}

afterEach(() => {
  process.env = { ...saved }
})

describe('build-time configuration check', { timeout: 60_000 }, () => {
  it('fails the build naming a missing VITE_API_BASE_URL', async () => {
    await expect(buildWith({ VITE_ANALYTICS_API_URL: 'https://a.example.test' })).rejects.toThrow(
      'missing required variable VITE_API_BASE_URL',
    )
  })

  it('rejects an invalid URL', async () => {
    await expect(buildWith({ ...valid, VITE_API_BASE_URL: 'api.example.test' })).rejects.toThrow(
      'VITE_API_BASE_URL must be an absolute http(s) URL',
    )
  })

  it('rejects secret-looking VITE_* variables', async () => {
    await expect(buildWith({ ...valid, VITE_STRIPE_SECRET: 'x' })).rejects.toThrow('VITE_STRIPE_SECRET looks like a secret')
  })

  it('builds when the required variables are set', async () => {
    await expect(buildWith(valid)).resolves.toBeDefined()
  })
})
