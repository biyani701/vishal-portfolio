import { describe, expect, it, vi } from 'vitest'
import type { Logger } from '../log.js'
import { memoryStore } from '../store.js'
import { dailyBudget } from './budget.js'
import { contextSource, ContextUnavailableError, type ContextSource } from './context.js'
import { fixtureContext, INJECTION } from './fixtures/context.js'
import { documents, searchIndex } from './search.js'
import { askTools, DATA_NOTICE } from './tools.js'

// Task 11.2: the read-only tools over ai-context.json, the corpus cache and the daily budget.
const quiet: Logger = { info: () => {}, warn: () => {}, error: () => {} }
const corpus: ContextSource = { get: async () => fixtureContext() }

function tool<R>(name: string, source: ContextSource = corpus) {
  const found = askTools(source).find((t) => t.name === name)
  if (!found?.execute) throw new Error(`no tool ${name}`)
  return (args: unknown) => found.execute!(args as never) as Promise<{ notice: string; result: R; sources: { section: string; title: string; url: string }[] }>
}

interface Card {
  slug: string
  stack: string[]
}

describe('search', () => {
  it('ranks the record that matches best first, with title words counting more', () => {
    const search = searchIndex(documents(fixtureContext()))
    expect(search('GraphQL Jira API')[0]!.doc).toMatchObject({ kind: 'project', id: 'fast-jiraql', section: 'Work' })
    expect(search('Agile coaching')[0]!.doc).toMatchObject({ kind: 'role', id: 'corecard', section: 'Experience' })
    expect(search('the of and')).toEqual([])
  })
})

describe('tools', () => {
  it('search_site returns hits with section-grouped sources', async () => {
    const { notice, result, sources } = await tool<{ kind: string; id: string; url: string }[]>('search_site')({ query: 'banking payments' })
    expect(notice).toBe(DATA_NOTICE)
    expect(result[0]).toMatchObject({ kind: 'role', id: 'lloyds', url: '/experience#lloyds' })
    expect(sources[0]).toEqual({ section: 'Experience', title: 'Delivery Manager · Tech Mahindra', url: '/experience#lloyds' })
  })

  it('list_projects filters by stack, domain and type, as compact cards', async () => {
    const list = tool<{ projects: Card[] }>('list_projects')
    expect((await list({ stack: 'python' })).result.projects.map((p) => p.slug)).toEqual(['fast-jiraql'])
    expect((await list({ domain: 'apis', type: 'open-source' })).result.projects).toHaveLength(1)
    const { result } = await list({})
    expect(result.projects).toHaveLength(2)
    expect(result.projects[0]).not.toHaveProperty('body')
    expect(result.projects[0]!.stack).toHaveLength(6)
  })

  it('get_project reads a case study, and says which slugs exist when one is unknown', async () => {
    const get = tool<{ found: boolean; project?: { title: string; body: string }; known?: string[] }>('get_project')
    const { result, sources } = await get({ slug: 'fast-jiraql' })
    expect(result).toMatchObject({ found: true, project: { title: 'Fast-JiraQL', body: expect.stringContaining('REST and GraphQL') } })
    expect(sources).toEqual([{ section: 'Work', title: 'Fast-JiraQL', url: '/work/fast-jiraql' }])
    expect((await get({ slug: 'nope' })).result).toEqual({ found: false, known: ['fast-jiraql', 'evil-notes'] })
  })

  it('get_experience reads all roles with credentials, or one role', async () => {
    const get = tool<{ roles: { id: string }[]; education?: { institution: string }[] }>('get_experience')
    const all = await get({})
    expect(all.result.roles).toHaveLength(2)
    expect(all.result.education?.[0]?.institution).toBe('IIT Bombay')
    expect(all.sources.at(-1)).toMatchObject({ title: 'Credentials' })
    expect((await get({ role_id: 'corecard' })).result.roles.map((r) => r.id)).toEqual(['corecard'])
  })

  it('get_profile groups skills and leaves About out while it is a draft', async () => {
    const { result, sources } = await tool<{ skills: Record<string, string[]>; about: unknown }>('get_profile')({})
    expect(result.skills).toEqual({ Programming: ['Python'], Frameworks: ['FastAPI'] })
    expect(result.about).toBeNull()
    expect(sources.map((s) => s.section)).toEqual(['Home'])
  })

  it('returns injected text only as marked data inside the result (prompt-injection fixture)', async () => {
    const out = await tool<{ project: { body: string } }>('get_project')({ slug: 'evil-notes' })
    expect(out.notice).toBe(DATA_NOTICE)
    expect(out.result.project.body).toBe(INJECTION)
    expect(Object.keys(out)).toEqual(['notice', 'result', 'sources'])
  })

  it('has no tool that writes or sends anything', () => {
    expect(askTools(corpus).map((t) => t.name).sort()).toEqual(['get_experience', 'get_profile', 'get_project', 'list_projects', 'search_site'])
  })
})

describe('contextSource', () => {
  const body = () => new Response(JSON.stringify(fixtureContext()), { headers: { ETag: '"v1"', 'Content-Type': 'application/json' } })

  it('caches the corpus, then revalidates with its ETag', async () => {
    let clock = 0
    const fetch = vi.fn(async (_url: string | URL | Request, init?: RequestInit) =>
      (init?.headers as Record<string, string>)['If-None-Match'] === '"v1"' ? new Response(null, { status: 304 }) : body(),
    )
    const source = contextSource({ url: 'https://site.test/ai-context.json', log: quiet, fetch: fetch as typeof globalThis.fetch, now: () => clock })
    const first = await source.get()
    await source.get()
    expect(fetch).toHaveBeenCalledTimes(1)
    clock += 10 * 60_000
    expect(await source.get()).toBe(first)
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('keeps the last good copy when the site is down, and fails only if it never loaded', async () => {
    let clock = 0
    let up = true
    const fetch = vi.fn(async () => (up ? body() : new Response('down', { status: 503 })))
    const source = contextSource({ url: 'https://site.test/ai-context.json', log: quiet, fetch: fetch as typeof globalThis.fetch, now: () => clock })
    const first = await source.get()
    up = false
    clock += 10 * 60_000
    expect(await source.get()).toBe(first)

    const never = contextSource({ url: 'https://site.test/ai-context.json', log: quiet, fetch: fetch as typeof globalThis.fetch })
    await expect(never.get()).rejects.toThrow(ContextUnavailableError)
  })
})

describe('dailyBudget', () => {
  it('is exhausted once the day’s tokens reach the cap, and resets the next UTC day', async () => {
    let clock = Date.parse('2026-09-27T10:00:00Z')
    const budget = dailyBudget({ store: memoryStore(() => clock), dailyUsd: 1, usdPerMillionTokens: 1, now: () => clock })
    await budget.record(600_000)
    expect(await budget.exhausted()).toBe(false)
    await budget.record(400_000)
    expect(await budget.exhausted()).toBe(true)
    clock = Date.parse('2026-09-28T00:00:01Z')
    expect(await budget.exhausted()).toBe(false)
  })

  it('never binds at a price of 0', async () => {
    const budget = dailyBudget({ store: memoryStore(), dailyUsd: 1, usdPerMillionTokens: 0 })
    await budget.record(10_000_000)
    expect(await budget.exhausted()).toBe(false)
  })
})
