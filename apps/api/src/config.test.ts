import { readFileSync } from 'node:fs'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ConfigError, configSchema, loadConfig, requiredKeys } from './config.js'

// Task 10.2a (design.md A9; specs/api-service "Configurable limits and retention"). Values here are fakes.
const complete = {
  RESEND_API_KEY: 'test-resend-key',
  CONTACT_FROM_EMAIL: 'contact@example.test',
  CONTACT_TO_EMAIL: 'owner@example.test',
  AI_API_KEY: 'test-ai-key',
  DATABASE_URL: 'postgres://user:pass@db.example.test/portfolio',
  KV_REST_API_URL: 'https://kv.example.test',
  KV_REST_API_TOKEN: 'test-kv-token',
  CRON_SECRET: 'test-cron-secret-0123456789',
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

describe('loadConfig', () => {
  it('applies the documented defaults for limits, retention and models', () => {
    expect(loadConfig(complete)).toMatchObject({
      CONTACT_RETENTION_DAYS: 365,
      CONTACT_RATE_LIMIT_PER_IP_PER_HOUR: 5,
      AI_RATE_LIMIT_PER_IP_PER_HOUR: 30,
      AI_MAX_OUTPUT_TOKENS: 1200,
      AI_DAILY_BUDGET_USD: 2,
      AI_BASE_URL: 'https://integrate.api.nvidia.com/v1',
      AI_MODEL_PREFER: [],
      AI_MODEL_REFRESH_HOURS: 24,
      AI_MODEL_PROBE_LIMIT: 6,
    })
  })

  it('specs/api-service scenario: retention changes with configuration alone', () => {
    expect(loadConfig({ ...complete, CONTACT_RETENTION_DAYS: '180' }).CONTACT_RETENTION_DAYS).toBe(180)
  })

  it('specs/api-service scenario: a missing RESEND_API_KEY fails naming it', () => {
    const rest = { ...complete, RESEND_API_KEY: undefined }
    expect(() => loadConfig(rest)).toThrow(ConfigError)
    expect(() => loadConfig(rest)).toThrow('RESEND_API_KEY is required')
  })

  it('names every missing or invalid variable at once, and treats empty values as unset', () => {
    const run = () => loadConfig({ ...complete, DATABASE_URL: '', AI_API_KEY: undefined, CONTACT_RETENTION_DAYS: 'a year', CONTACT_TO_EMAIL: 'owner' })
    expect(run).toThrow(
      'apps/api configuration: CONTACT_RETENTION_DAYS must be a whole number; CONTACT_TO_EMAIL must be an email address; AI_API_KEY is required; DATABASE_URL is required',
    )
  })

  it('discovers models unless pinned, and reads preference patterns as a list', () => {
    const config = loadConfig(complete)
    expect(config.AI_MODEL).toBeUndefined()
    expect(config.AI_SUGGESTION_MODEL).toBeUndefined()
    expect(loadConfig({ ...complete, AI_MODEL_PREFER: ' *nemotron* , *llama*instruct ' }).AI_MODEL_PREFER).toEqual(['*nemotron*', '*llama*instruct'])
  })

  it('requires a CRON_SECRET of at least 16 characters', () => {
    expect(() => loadConfig({ ...complete, CRON_SECRET: undefined })).toThrow('CRON_SECRET is required')
    expect(() => loadConfig({ ...complete, CRON_SECRET: 'short' })).toThrow('CRON_SECRET must be at least 16 characters')
  })

  it('switches LLM provider through configuration alone', () => {
    const config = loadConfig({ ...complete, AI_BASE_URL: 'https://llm.example.test/v1', AI_MODEL: 'some/model' })
    expect(config).toMatchObject({ AI_BASE_URL: 'https://llm.example.test/v1', AI_MODEL: 'some/model' })
    expect(() => loadConfig({ ...complete, AI_BASE_URL: 'http://llm.example.test' })).toThrow('AI_BASE_URL must be an https:// URL')
  })

  it('rejects non-postgres database URLs and non-https KV URLs', () => {
    expect(() => loadConfig({ ...complete, DATABASE_URL: 'mysql://db' })).toThrow('DATABASE_URL must be a postgres:// URL')
    expect(() => loadConfig({ ...complete, KV_REST_API_URL: 'http://kv' })).toThrow('KV_REST_API_URL must be an https:// URL')
  })

  it('refuses start-up from the Vercel entry when a required variable is missing', async () => {
    for (const [key, value] of Object.entries(complete)) vi.stubEnv(key, key === 'RESEND_API_KEY' ? '' : value)
    await expect(import('./index.js')).rejects.toThrow('RESEND_API_KEY is required')
  })

  it('starts from the Vercel entry with a complete environment', async () => {
    for (const [key, value] of Object.entries(complete)) vi.stubEnv(key, value)
    const app = (await import('./index.js')).default
    expect((await app.request('/health')).status).toBe(200)
  })
})

describe('.env.example', () => {
  const example = readFileSync(new URL('../.env.example', import.meta.url), 'utf8')
  // Any line ending: Windows checkouts get CRLF (core.autocrlf).
  const lines = example.split(/\r?\n/).filter((line) => /^[A-Z_]+=/.test(line))

  it('lists every configuration key', () => {
    expect(lines.map((line) => line.split('=')[0]).sort()).toEqual(Object.keys(configSchema.shape).sort())
    expect(requiredKeys).toContain('RESEND_API_KEY')
  })

  it('carries no values, only comments', () => {
    for (const line of lines) expect(line.split('=')[1]!.replace(/#.*$/, '').trim(), line).toBe('')
  })
})
