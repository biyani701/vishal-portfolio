import { createHash } from 'node:crypto'
import type { Store } from './store.js'

// Per-client rate limits (design.md A6 "Limits"; CONTACT_RATE_LIMIT_PER_IP_PER_HOUR, AI_RATE_LIMIT_PER_IP_PER_HOUR).
// Fixed windows counted in the shared store: a counter per client per window, which expires when the window ends.
// The client key (an IP address) is hashed, so the store never holds a raw IP.

export interface RateLimitResult {
  allowed: boolean
  limit: number
  remaining: number
  /** Seconds until the current window ends and the count resets, for a Retry-After header. */
  retryAfterSeconds: number
}

export interface RateLimiter {
  /** Counts one request from the client and says whether it's within the limit. */
  hit(clientKey: string): Promise<RateLimitResult>
}

export interface RateLimiterOptions {
  store: Store
  /** Separates the limits of different routes, e.g. "contact" or "ask". */
  name: string
  limit: number
  windowSeconds?: number
  now?: () => number
}

const hashKey = (value: string) => createHash('sha256').update(value).digest('hex').slice(0, 32)

export function rateLimiter({ store, name, limit, windowSeconds = 3600, now = Date.now }: RateLimiterOptions): RateLimiter {
  const windowMs = windowSeconds * 1000
  return {
    async hit(clientKey) {
      const time = now()
      const start = Math.floor(time / windowMs) * windowMs
      const secondsLeft = Math.max(1, Math.ceil((start + windowMs - time) / 1000))
      const count = await store.increment(`ratelimit:${name}:${hashKey(clientKey)}:${start / 1000}`, secondsLeft)
      return { allowed: count <= limit, limit, remaining: Math.max(0, limit - count), retryAfterSeconds: secondsLeft }
    },
  }
}
