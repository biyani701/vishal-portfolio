import { describe, expect, it, vi } from 'vitest'
import { CatalogError, openAiCatalog } from './catalog.js'

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

function setup(handler: (url: string, init: RequestInit) => Response | Promise<Response>) {
  const fetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => handler(String(url), init ?? {}))
  const catalog = openAiCatalog({ baseUrl: 'https://llm.example.test/v1/', apiKey: 'test-key', fetch: fetch as typeof globalThis.fetch, probeTimeoutMs: 1000 })
  return { catalog, fetch }
}

describe('openAiCatalog', () => {
  it('lists model ids from {base}/models with the key as a bearer token', async () => {
    const { catalog, fetch } = setup(() => json({ data: [{ id: 'a/one', created: 5 }, { id: 'b/two' }, { object: 'model' }] }))
    expect(await catalog.list()).toEqual([{ id: 'a/one', created: 5 }, { id: 'b/two' }])
    const [url, init] = fetch.mock.calls[0]!
    expect(url).toBe('https://llm.example.test/v1/models')
    expect((init!.headers as Record<string, string>).Authorization).toBe('Bearer test-key')
  })

  it('reports an unreachable catalog as a CatalogError', async () => {
    const { catalog } = setup(() => json({}, 503))
    await expect(catalog.list()).rejects.toThrow(CatalogError)
  })

  it('passes a tool probe only when the model calls the ping tool', async () => {
    const { catalog, fetch } = setup((_url, init) => {
      const body = JSON.parse(String(init.body))
      if (body.model === 'good') return json({ choices: [{ message: { tool_calls: [{ function: { name: 'ping', arguments: '{}' } }] } }] })
      if (body.model === 'chatty') return json({ choices: [{ message: { content: 'I would call ping.' } }] })
      return json({ error: 'not found' }, 404)
    })
    expect(await catalog.probeTools('good')).toMatchObject({ model: 'good', ok: true })
    expect(await catalog.probeTools('chatty')).toMatchObject({ ok: false, reason: 'no_tool_call' })
    expect(await catalog.probeTools('gone')).toMatchObject({ ok: false, reason: 'http_404' })
    const sent = JSON.parse(String(fetch.mock.calls[0]![1]!.body))
    expect(sent).toMatchObject({ model: 'good', tools: [{ type: 'function', function: { name: 'ping' } }], stream: false })
  })

  it('passes a chat probe when any text comes back', async () => {
    const { catalog } = setup((_url, init) =>
      JSON.parse(String(init.body)).model === 'quiet' ? json({ choices: [{ message: { content: '  ' } }] }) : json({ choices: [{ message: { content: 'ok' } }] }),
    )
    expect(await catalog.probeChat('talks')).toMatchObject({ ok: true })
    expect(await catalog.probeChat('quiet')).toMatchObject({ ok: false, reason: 'empty_reply' })
  })

  it('counts a slow model as failing', async () => {
    const { catalog } = setup(
      (_url, init) =>
        new Promise<Response>((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => reject(Object.assign(new Error('timed out'), { name: 'TimeoutError' })))
        }),
    )
    expect(await catalog.probeChat('slow')).toMatchObject({ ok: false, reason: 'timeout' })
  })
})
