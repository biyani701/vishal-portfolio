import { describe, expect, it, vi } from 'vitest'
import type { Logger } from '../log.js'
import { memoryStore } from '../store.js'
import { CatalogError, type Catalog, type ProbeResult } from './catalog.js'
import { isModelGone, modelResolver, NoModelAvailableError } from './models.js'
import type { CatalogModel } from './rank.js'

// vishal-portfolio-9cm.11.7: automatic model selection against a fake catalog.
const quietLog: Logger = { info: () => {}, warn: () => {}, error: () => {} }

function fakeCatalog(models: CatalogModel[], works: { tools: string[]; chat: string[] }) {
  const probe = (kind: 'tools' | 'chat') =>
    vi.fn(async (model: string): Promise<ProbeResult> => (works[kind].includes(model) ? { model, ok: true, ms: 5 } : { model, ok: false, ms: 5, reason: 'no_tool_call' }))
  const catalog = { list: vi.fn(async () => models), probeTools: probe('tools'), probeChat: probe('chat') } satisfies Catalog
  return catalog
}

const models = [
  { id: 'v/big-70b-instruct' },
  { id: 'v/mid-49b-instruct' },
  { id: 'v/other-32b-instruct' },
  { id: 'v/small-8b-instruct' },
  { id: 'v/tiny-3b-instruct' },
  { id: 'v/text-embed-1' },
]

function setup(options: { works?: { tools: string[]; chat: string[] }; pinned?: { agent?: string; suggestions?: string }; probeLimit?: number } = {}) {
  let clock = Date.parse('2026-09-26T00:00:00Z')
  const now = () => clock
  const catalog = fakeCatalog(models, options.works ?? { tools: ['v/mid-49b-instruct', 'v/small-8b-instruct'], chat: ['v/small-8b-instruct', 'v/tiny-3b-instruct'] })
  const store = memoryStore(now)
  const resolver = modelResolver({ catalog, store, log: quietLog, pinned: options.pinned, refreshHours: 24, probeLimit: options.probeLimit ?? 6, now })
  return { resolver, catalog, store, advance: (hours: number) => (clock += hours * 3600_000) }
}

describe('modelResolver', () => {
  it('picks the first ranked model that passes the tool probe, and a small chat model for suggestions', async () => {
    const { resolver, catalog } = setup()
    const selection = await resolver.current()
    expect(selection).toMatchObject({
      agent: 'v/mid-49b-instruct',
      suggestions: 'v/small-8b-instruct',
      source: { agent: 'discovered', suggestions: 'discovered' },
    })
    // big-70b ranked first but failed its probe; the embedding model was never probed.
    expect(catalog.probeTools.mock.calls.map(([id]) => id)).toEqual(['v/big-70b-instruct', 'v/mid-49b-instruct'])
    expect(catalog.probeTools.mock.calls.flat()).not.toContain('v/text-embed-1')
  })

  it('serves the stored selection without probing again until it is stale, then refreshes', async () => {
    const { resolver, catalog, advance } = setup()
    await resolver.current()
    const probes = catalog.probeTools.mock.calls.length
    advance(23)
    await resolver.current()
    expect(catalog.probeTools.mock.calls.length).toBe(probes)
    advance(2)
    await resolver.current()
    expect(catalog.list).toHaveBeenCalledTimes(2)
  })

  it('shares one refresh between concurrent requests', async () => {
    const { resolver, catalog } = setup()
    await Promise.all([resolver.current(), resolver.current(), resolver.current()])
    expect(catalog.list).toHaveBeenCalledTimes(1)
  })

  it('keeps the last selection while the catalog is unreachable', async () => {
    const { resolver, catalog, advance } = setup()
    const first = await resolver.current()
    advance(30)
    catalog.list.mockRejectedValueOnce(new CatalogError('model list unavailable (http_503)'))
    expect(await resolver.current()).toEqual(first)
  })

  it('fails over when the selected model disappears, skipping it on later refreshes', async () => {
    const { resolver } = setup()
    expect((await resolver.current()).agent).toBe('v/mid-49b-instruct')
    expect(isModelGone(404)).toBe(true)
    await resolver.reportFailure('v/mid-49b-instruct', 'http_404')
    expect((await resolver.current()).agent).toBe('v/small-8b-instruct')
    expect((await resolver.refresh()).agent).toBe('v/small-8b-instruct')
  })

  it('treats rate limits as transient, not as a gone model', () => {
    expect(isModelGone(429)).toBe(false)
    expect(isModelGone(500)).toBe(false)
  })

  it('uses pinned models as given, without the catalog when both are pinned', async () => {
    const { resolver, catalog } = setup({ pinned: { agent: 'pinned/agent', suggestions: 'pinned/suggest' } })
    expect(await resolver.current()).toMatchObject({ agent: 'pinned/agent', suggestions: 'pinned/suggest', source: { agent: 'pinned', suggestions: 'pinned' } })
    expect(catalog.list).not.toHaveBeenCalled()
  })

  it('discovers the unpinned role when only one is pinned', async () => {
    const { resolver } = setup({ pinned: { agent: 'pinned/agent' } })
    expect(await resolver.current()).toMatchObject({ agent: 'pinned/agent', suggestions: 'v/small-8b-instruct', source: { agent: 'pinned', suggestions: 'discovered' } })
  })

  it('falls back to the agent model for suggestions when no other model answers', async () => {
    const { resolver } = setup({ works: { tools: ['v/mid-49b-instruct'], chat: [] } })
    expect(await resolver.current()).toMatchObject({ suggestions: 'v/mid-49b-instruct', source: { suggestions: 'agent' } })
  })

  it('reports no model when nothing passes within the probe limit', async () => {
    const { resolver, catalog } = setup({ works: { tools: ['v/tiny-3b-instruct'], chat: [] }, probeLimit: 2 })
    await expect(resolver.current()).rejects.toThrow(NoModelAvailableError)
    expect(catalog.probeTools).toHaveBeenCalledTimes(2)
  })
})
