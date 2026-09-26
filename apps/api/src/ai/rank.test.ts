import { describe, expect, it } from 'vitest'
import { generation, parameterBillions, preferenceMatchers, rankCandidates } from './rank.js'

// Ids shaped like a real catalog's; the ranking must work from their shape alone, without naming models.
const catalog = [
  { id: 'vendor-a/text-embed-v2' },
  { id: 'vendor-a/rerank-qa-1b' },
  { id: 'vendor-b/content-safety-guard-8b' },
  { id: 'vendor-b/vision-chat-11b-vl-instruct' },
  { id: 'vendor-c/giant-405b-instruct', created: 1_700_000_000 },
  { id: 'vendor-c/mid-70b-instruct', created: 1_700_000_000 },
  { id: 'vendor-c/newer-mid-49b-instruct', created: 1_750_000_000 },
  { id: 'vendor-d/small-8b-instruct' },
  { id: 'vendor-d/tiny-1b-instruct' },
  { id: 'vendor-e/base-70b' },
  { id: 'vendor-f/moe-8x7b-instruct' },
]
const ids = (models: { id: string }[]) => models.map((m) => m.id)

describe('parameterBillions', () => {
  it('reads dense and mixture-of-experts sizes, and nothing from version numbers', () => {
    expect(parameterBillions('meta/llama-3.3-70b-instruct')).toBe(70)
    expect(parameterBillions('vendor/model-49b-v1.5')).toBe(49)
    expect(parameterBillions('mistralai/mixtral-8x22b-instruct')).toBe(176)
    expect(parameterBillions('vendor/model-v2.5-instruct')).toBeUndefined()
    expect(parameterBillions('vendor/phi-3.5-mini-instruct')).toBeUndefined()
  })
})

describe('generation', () => {
  it('reads the first bare version number after the vendor', () => {
    expect(generation('meta/llama-3.3-70b-instruct')).toBe(3.3)
    expect(generation('google/gemma-4-31b-it')).toBe(4)
    expect(generation('meta/llama2-70b')).toBe(2)
    expect(generation('vendor/model-51b-instruct')).toBeUndefined()
  })
})

describe('rankCandidates', () => {
  it('prefers conversational models over code-specialised ones, and newer generations of a size', () => {
    const models = [{ id: 'v/codemodel-34b-instruct' }, { id: 'v/family2-70b-instruct' }, { id: 'v/family-3.1-70b-instruct' }]
    expect(ids(rankCandidates(models, 'agent'))).toEqual(['v/family-3.1-70b-instruct', 'v/family2-70b-instruct', 'v/codemodel-34b-instruct'])
  })

  it('leaves out embedding, reranking, safety and vision models', () => {
    const ranked = ids(rankCandidates(catalog, 'agent'))
    for (const id of ['vendor-a/text-embed-v2', 'vendor-a/rerank-qa-1b', 'vendor-b/content-safety-guard-8b', 'vendor-b/vision-chat-11b-vl-instruct']) {
      expect(ranked).not.toContain(id)
    }
  })

  it('puts mid-to-large instruct models first for the agent, newer first on a tie', () => {
    expect(ids(rankCandidates(catalog, 'agent')).slice(0, 3)).toEqual([
      'vendor-c/newer-mid-49b-instruct',
      'vendor-c/mid-70b-instruct',
      'vendor-f/moe-8x7b-instruct',
    ])
  })

  it('puts small instruct models first for suggestions', () => {
    expect(ids(rankCandidates(catalog, 'suggestions'))[0]).toBe('vendor-d/small-8b-instruct')
  })

  it('tries AI_MODEL_PREFER patterns first, in their order', () => {
    const prefer = preferenceMatchers(['*base-70b', 'vendor-d/*'])
    expect(ids(rankCandidates(catalog, 'agent', prefer)).slice(0, 3)).toEqual([
      'vendor-e/base-70b',
      'vendor-d/small-8b-instruct',
      'vendor-d/tiny-1b-instruct',
    ])
  })
})
