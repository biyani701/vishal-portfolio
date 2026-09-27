import { describe, expect, it, vi } from 'vitest'
import type { Logger } from '../log.js'
import { ASK_ERRORS, AskError, guardModel } from './guard.js'
import type { ModelResolver } from './models.js'

// Task 11.2: the model wrapper. No raw reasoning reaches the page, provider errors become codes, usage is budgeted.
const quiet: Logger = { info: () => {}, warn: () => {}, error: () => {} }
type Model = Parameters<typeof guardModel>[0]

const usage = { inputTokens: { total: 40, noCache: 40, cacheRead: 0, cacheWrite: 0 }, outputTokens: { total: 10, text: 10, reasoning: 0 } }

function fakeModel(parts: unknown[], error?: unknown): Model {
  return {
    specificationVersion: 'v3',
    provider: 'test',
    modelId: 'vendor/model',
    supportedUrls: {},
    doGenerate: vi.fn(),
    doStream: vi.fn(async () => {
      if (error) throw error
      return { stream: new ReadableStream({ start: (c) => (parts.forEach((p) => c.enqueue(p)), c.close()) }) }
    }),
  } as unknown as Model
}

async function drain(model: Model) {
  const { stream } = await model.doStream({ prompt: [], tools: [] } as never)
  const out: { type: string }[] = []
  for await (const part of stream as unknown as AsyncIterable<{ type: string }>) out.push(part)
  return out
}

const deps = () => ({ budget: { exhausted: async () => false, record: vi.fn(async () => {}) }, models: { reportFailure: vi.fn(async () => {}) } as unknown as ModelResolver, log: quiet })

describe('guardModel', () => {
  it('drops reasoning, passes the answer and records its tokens', async () => {
    const d = deps()
    const parts = await drain(
      guardModel(
        fakeModel([
          { type: 'reasoning-start', id: 'r' },
          { type: 'reasoning-delta', id: 'r', delta: 'secret chain of thought' },
          { type: 'reasoning-end', id: 'r' },
          { type: 'text-delta', id: 't', delta: 'Hello' },
          { type: 'finish', finishReason: 'stop', usage },
        ]),
        d,
      ),
    )
    expect(parts.map((p) => p.type)).toEqual(['text-delta', 'finish'])
    expect(d.budget.record).toHaveBeenCalledWith(50)
  })

  it('turns provider errors into codes and reports a gone model', async () => {
    const d = deps()
    await expect(drain(guardModel(fakeModel([], Object.assign(new Error('upstream said no'), { statusCode: 429 })), d))).rejects.toThrow(ASK_ERRORS.rateLimited)
    await expect(drain(guardModel(fakeModel([], Object.assign(new Error('nope'), { statusCode: 410 })), d))).rejects.toThrow(ASK_ERRORS.unavailable)
    expect(d.models.reportFailure).toHaveBeenCalledWith('vendor/model', 'http_410')
    await expect(drain(guardModel(fakeModel([], new TypeError('boom')), d))).rejects.toBeInstanceOf(AskError)
  })

  it('removes the state-editing tools BuiltInAgent adds', async () => {
    const model = fakeModel([{ type: 'finish', finishReason: 'stop', usage }])
    const guarded = guardModel(model, deps())
    await guarded.doStream({ prompt: [], tools: [{ type: 'function', name: 'AGUISendStateSnapshot' }, { type: 'function', name: 'search_site' }] } as never)
    const sent = (model.doStream as ReturnType<typeof vi.fn>).mock.calls[0]![0] as { tools: { name: string }[] }
    expect(sent.tools.map((t) => t.name)).toEqual(['search_site'])
  })
})
