import type { Logger } from '../log.js'

// The Ask corpus (design.md A5): /ai-context.json, which apps/web builds from the published content only
// (apps/web/scripts/content/indexes.ts buildAiContext). Fetched from the site and cached per instance: revalidated
// with its ETag at most every few minutes, and the last good copy kept while the site can't be reached.
// The types mirror what the build emits; only the fields the tools read are listed.

export interface AiRole {
  id: string
  organisation: string
  client?: string
  title: string
  dates: string
  status: string
  location?: string
  outcomes: string[]
  skills: string[]
  url: string
}

export interface AiProject {
  slug: string
  title: string
  year?: number
  type?: string
  status?: string
  summary: string
  domains: string[]
  stack: string[]
  outcomes?: string[]
  links?: Record<string, string>
  url: string
  body: string
}

export interface AiContext {
  version: 1
  site: string
  profile: {
    name: string
    positioning?: string
    location?: string
    currentRole?: string
    summary?: string
    proof?: string[]
    links?: Record<string, string> | { label: string; url: string }[]
  }
  roles: AiRole[]
  about: { story?: unknown; principles?: unknown } | null
  milestones: { id: string; title: string; kind?: string; when: string }[]
  skills: { name: string; group: string; since?: string; until?: string; use?: string }[]
  education: { id: string; degree: string; institution: string; start?: number; end?: number }[]
  projects: AiProject[]
}

export interface ContextSource {
  /** The corpus, from cache when it was checked recently. Throws only if it has never been loaded. */
  get(): Promise<AiContext>
}

export class ContextUnavailableError extends Error {
  override name = 'ContextUnavailableError'
}

export interface ContextSourceOptions {
  url: string
  log: Logger
  /** How long a copy is used before it's revalidated. */
  revalidateMs?: number
  fetch?: typeof globalThis.fetch
  now?: () => number
}

const isContext = (value: unknown): value is AiContext =>
  typeof value === 'object' && value !== null && (value as AiContext).version === 1 && Array.isArray((value as AiContext).projects) && Array.isArray((value as AiContext).roles)

export function contextSource({ url, log, revalidateMs = 5 * 60_000, fetch: fetcher = globalThis.fetch, now = Date.now }: ContextSourceOptions): ContextSource {
  let cached: { context: AiContext; etag?: string; checkedAt: number } | undefined
  let inflight: Promise<AiContext> | undefined

  async function load(): Promise<AiContext> {
    try {
      const res = await fetcher(url, {
        headers: { Accept: 'application/json', ...(cached?.etag && { 'If-None-Match': cached.etag }) },
        signal: AbortSignal.timeout(5000),
      })
      if (res.status === 304 && cached) {
        cached = { ...cached, checkedAt: now() }
        return cached.context
      }
      if (!res.ok) throw new ContextUnavailableError(`http_${res.status}`)
      const body: unknown = await res.json()
      if (!isContext(body)) throw new ContextUnavailableError('unexpected_shape')
      cached = { context: body, etag: res.headers.get('ETag') ?? undefined, checkedAt: now() }
      return body
    } catch (error) {
      if (cached) {
        // Keep answering from the last good copy; try again after another interval.
        log.warn('ai_context_stale', { error: (error as Error).name })
        cached = { ...cached, checkedAt: now() }
        return cached.context
      }
      log.error('ai_context_unavailable', { error: (error as Error).name })
      throw error instanceof ContextUnavailableError ? error : new ContextUnavailableError((error as Error).name)
    }
  }

  return {
    get() {
      if (cached && now() - cached.checkedAt < revalidateMs) return Promise.resolve(cached.context)
      inflight ??= load().finally(() => {
        inflight = undefined
      })
      return inflight
    },
  }
}
