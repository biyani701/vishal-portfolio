import { describe, expect, it } from 'vitest'
import { requiredEnvNames, resolveConfig } from './schema.ts'

const env = {
  VITE_API_BASE_URL: 'https://api.example.test/',
}

describe('resolveConfig', () => {
  it('reads VITE_* variables and trims trailing slashes', () => {
    expect(resolveConfig(env)).toEqual({
      apiBaseUrl: 'https://api.example.test',
      analyticsApiUrl: undefined,
    })
  })

  it('lets runtime-config.js override build values', () => {
    const config = resolveConfig(env, { API_BASE_URL: 'https://api.other.test', ANALYTICS_API_URL: 'https://a.test/api' })
    expect(config.apiBaseUrl).toBe('https://api.other.test')
    expect(config.analyticsApiUrl).toBe('https://a.test/api')
  })

  it('ignores empty runtime values', () => {
    expect(resolveConfig(env, { API_BASE_URL: '  ' }).apiBaseUrl).toBe('https://api.example.test')
  })

  it('names a missing required variable', () => {
    expect(() => resolveConfig({ VITE_ANALYTICS_API_URL: 'https://a.test/api' })).toThrow('VITE_API_BASE_URL is required')
  })

  it('rejects a non-URL, naming where it came from', () => {
    expect(() => resolveConfig(env, { ANALYTICS_API_URL: 'a.test/api' })).toThrow('runtimeConfig.ANALYTICS_API_URL')
  })

  it('requires only the API URL', () => {
    expect(requiredEnvNames).toEqual(['VITE_API_BASE_URL'])
  })
})
