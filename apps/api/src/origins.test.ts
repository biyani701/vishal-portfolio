import { describe, expect, it } from 'vitest'
import { allowedOrigins, originPolicy, PRODUCTION_ORIGIN } from './origins.js'

describe('originPolicy', () => {
  const policy = originPolicy([PRODUCTION_ORIGIN, 'https://web-*-biyani701.vercel.app'])

  it('allows the site and matching previews, case-insensitively', () => {
    expect(policy.allows('https://vishal.biyani.xyz')).toBe(true)
    expect(policy.allows('https://VISHAL.biyani.xyz')).toBe(true)
    expect(policy.allows('https://web-git-feat-x-biyani701.vercel.app')).toBe(true)
  })

  it('refuses look-alikes: other schemes, ports, subdomains and suffixes', () => {
    for (const origin of [
      'http://vishal.biyani.xyz',
      'https://vishal.biyani.xyz:8443',
      'https://evil.vishal.biyani.xyz',
      'https://vishal.biyani.xyz.evil.com',
      'https://web-a.evil.com-biyani701.vercel.app',
      'https://web--biyani701.vercel.app',
      'null',
    ]) {
      expect(policy.allows(origin), origin).toBe(false)
    }
  })
})

describe('allowedOrigins', () => {
  it('defaults to the production origin, adding local dev origins outside production', () => {
    expect(allowedOrigins({ VERCEL_ENV: 'production' })).toEqual([PRODUCTION_ORIGIN])
    expect(allowedOrigins({})).toEqual([PRODUCTION_ORIGIN, 'http://localhost:5173', 'http://localhost:4173'])
  })

  it('reads a comma-separated ALLOWED_ORIGINS, trimming spaces and trailing slashes', () => {
    expect(allowedOrigins({ VERCEL_ENV: 'preview', ALLOWED_ORIGINS: ' https://a.example/ , https://web-*-x.vercel.app ' })).toEqual([
      'https://a.example',
      'https://web-*-x.vercel.app',
      'http://localhost:5173',
      'http://localhost:4173',
    ])
  })

  it('drops wildcard and plain-http origins in production even when configured', () => {
    const env = { VERCEL_ENV: 'production', ALLOWED_ORIGINS: `${PRODUCTION_ORIGIN},https://web-*-x.vercel.app,http://localhost:5173` }
    expect(allowedOrigins(env)).toEqual([PRODUCTION_ORIGIN])
  })
})
