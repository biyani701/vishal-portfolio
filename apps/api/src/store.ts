import { Redis } from '@upstash/redis'

// A small key-value store for state shared by every function instance: the AI model selection now, and the
// rate-limit counters and daily AI spend later (task 10.2). Upstash Redis in deployments (KV_REST_API_URL /
// KV_REST_API_TOKEN from the Vercel Marketplace), in memory for tests.

export interface Store {
  get<T>(key: string): Promise<T | null>
  set(key: string, value: unknown, ttlSeconds: number): Promise<void>
  delete(key: string): Promise<void>
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
    keys: () => [...entries.keys()].filter((key) => live(key)),
  }
}
