import { describe, expect, it } from 'vitest'
import { requiredEnvNames, resolveConfig } from './schema.ts'

const env = {
  VITE_API_BASE_URL: 'https://api.example.test/',
  VITE_AUTH_SERVER_URL: 'https://auth.example.test',
}

describe('resolveConfig', () => {
  it('reads VITE_* variables, trims trailing slashes and applies fallbacks', () => {
    expect(resolveConfig(env)).toEqual({
      apiBaseUrl: 'https://api.example.test',
      authServerUrl: 'https://auth.example.test',
      authClientId: 'portfolio',
      authProviders: 'github,google',
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
    expect(() => resolveConfig({ VITE_AUTH_SERVER_URL: 'https://auth.example.test' })).toThrow(
      'VITE_API_BASE_URL is required',
    )
  })

  it('rejects a non-URL, naming where it came from', () => {
    expect(() => resolveConfig(env, { AUTH_SERVER_URL: 'auth.example.test' })).toThrow('runtimeConfig.AUTH_SERVER_URL')
  })

  it('requires the API and auth server URLs', () => {
    expect(requiredEnvNames).toEqual(['VITE_API_BASE_URL', 'VITE_AUTH_SERVER_URL'])
  })
})
