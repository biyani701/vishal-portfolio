import { Redis } from '@upstash/redis'

// A small key-value store for state shared by every function instance: the AI model selection, per-IP
// rate-limit counters (src/ratelimit.ts) and, later, the daily AI spend. Upstash Redis in deployments (KV_REST_API_URL /
// KV_REST_API_TOKEN from the Vercel Marketplace), in memory for tests.

export interface Store {
  get<T>(key: string): Promise<T | null>
  set(key: string, value: unknown, ttlSeconds: number): Promise<void>
  delete(key: string): Promise<void>
  /** Adds 1 and returns the new count. A new key expires after ttlSeconds; later increments keep that expiry. */
  increment(key: string, ttlSeconds: number): Promise<number>
}

export function upstashStore(url: string, token: string): Store {
  const redis = new Redis({ url, token })
  return {
    get: (key) => redis.get(key),
    set: async (key, value, ttlSeconds) => {
      await redis.set(key, value, { ex: Math.max(1, Math.round(ttlSeconds)) })
    },
    delete: async (key) => {
      await redis.del(key)
    },
    increment: async (key, ttlSeconds) => {
      // One MULTI round trip, so a counter can't be left without its expiry.
      const [count] = await redis.multi().incr(key).expire(key, Math.max(1, Math.round(ttlSeconds)), 'NX').exec<[number, number]>()
      return count
    },
  }
}

export function memoryStore(now: () => number = Date.now): Store & { keys(): string[] } {
  const entries = new Map<string, { value: unknown; expires: number }>()
  const live = (key: string) => {
    const entry = entries.get(key)
    if (entry && entry.expires <= now()) entries.delete(key)
    return entries.get(key)
  }
  return {
    get: async <T>(key: string) => (live(key)?.value as T | undefined) ?? null,
    set: async (key, value, ttlSeconds) => {
      entries.set(key, { value: structuredClone(value), expires: now() + ttlSeconds * 1000 })
    },
    delete: async (key) => {
      entries.delete(key)
    },
    increment: async (key, ttlSeconds) => {
      const entry = live(key)
      const count = ((entry?.value as number | undefined) ?? 0) + 1
      entries.set(key, { value: count, expires: entry?.expires ?? now() + ttlSeconds * 1000 })
      return count
    },
    keys: () => [...entries.keys()].filter((key) => live(key)),
  }
}
