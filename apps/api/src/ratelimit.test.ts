import { describe, expect, it } from 'vitest'
import { rateLimiter } from './ratelimit.js'
import { memoryStore } from './store.js'

// vishal-portfolio-9cm.10.2: per-IP fixed-window limits in the shared store.
function setup(limit = 3) {
  let clock = Date.parse('2026-09-26T10:15:00Z')
  const now = () => clock
  const store = memoryStore(now)
  const limiter = rateLimiter({ store, name: 'contact', limit, now })
  return { store, limiter, advance: (seconds: number) => (clock += seconds * 1000) }
}

describe('rateLimiter', () => {
  it('allows up to the limit in a window, then refuses with the time left in the window', async () => {
    const { limiter } = setup(3)
    const results = []
    for (let i = 0; i < 4; i++) results.push(await limiter.hit('203.0.113.7'))
    expect(results.map((result) => [result.allowed, result.remaining])).toEqual([
      [true, 2],
      [true, 1],
      [true, 0],
      [false, 0],
    ])
    expect(results[3]!.retryAfterSeconds).toBe(45 * 60)
  })

  it('starts counting again in the next window', async () => {
    const { limiter, advance } = setup(1)
    await limiter.hit('203.0.113.7')
    expect((await limiter.hit('203.0.113.7')).allowed).toBe(false)
    advance(45 * 60)
    expect((await limiter.hit('203.0.113.7')).allowed).toBe(true)
  })

  it('counts each client and each limiter separately', async () => {
    const { store, limiter } = setup(1)
    const ask = rateLimiter({ store, name: 'ask', limit: 1, now: () => Date.parse('2026-09-26T10:15:00Z') })
    expect((await limiter.hit('203.0.113.7')).allowed).toBe(true)
    expect((await limiter.hit('198.51.100.2')).allowed).toBe(true)
    expect((await ask.hit('203.0.113.7')).allowed).toBe(true)
    expect((await limiter.hit('203.0.113.7')).allowed).toBe(false)
  })

  it('never puts the raw IP in the store, and lets counters expire with their window', async () => {
    const { store, limiter, advance } = setup()
    await limiter.hit('203.0.113.7')
    expect(store.keys()).toHaveLength(1)
    expect(store.keys()[0]).toMatch(/^ratelimit:contact:[0-9a-f]{32}:\d+$/)
    expect(store.keys()[0]).not.toContain('203.0.113.7')
    advance(45 * 60)
    expect(store.keys()).toEqual([])
  })
})
