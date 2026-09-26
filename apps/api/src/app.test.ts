import { describe, expect, it, vi } from 'vitest'
import { createApp } from './app.js'
import type { Logger } from './log.js'
import { originPolicy, PRODUCTION_ORIGIN } from './origins.js'

// Task 10.1: GET /health, CORS limited to the site (specs/api-service "Foreign origin"), and structured logs
// without personal data ("Observability without personal data").
function setup() {
  const lines: { level: string; msg: string; fields?: Record<string, unknown> }[] = []
  const log: Logger = {
    info: (msg, fields) => lines.push({ level: 'info', msg, fields }),
    warn: (msg, fields) => lines.push({ level: 'warn', msg, fields }),
    error: (msg, fields) => lines.push({ level: 'error', msg, fields }),
  }
  const app = createApp({ origins: originPolicy([PRODUCTION_ORIGIN]), log, version: 'abc1234' })
  return { app, lines }
}

describe('GET /health', () => {
  it('answers ok with the deployed version', async () => {
    const { app } = setup()
    const res = await app.request('/health')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ status: 'ok', version: 'abc1234' })
  })
})

describe('CORS', () => {
  it('returns CORS headers for the site origin', async () => {
    const { app } = setup()
    const res = await app.request('/health', { headers: { Origin: PRODUCTION_ORIGIN } })
    expect(res.status).toBe(200)
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe(PRODUCTION_ORIGIN)
  })

  it('answers a preflight from the site', async () => {
    const { app } = setup()
    const res = await app.request('/health', {
      method: 'OPTIONS',
      headers: { Origin: PRODUCTION_ORIGIN, 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type' },
    })
    expect(res.status).toBe(204)
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe(PRODUCTION_ORIGIN)
    expect(res.headers.get('Access-Control-Allow-Methods')).toContain('POST')
  })

  it('specs/api-service scenario: a foreign origin is rejected and the request is not processed', async () => {
    const { app, lines } = setup()
    const handler = vi.fn((c) => c.text('processed'))
    app.post('/probe', handler)
    for (const method of ['POST', 'OPTIONS']) {
      const res = await app.request('/probe', { method, headers: { Origin: 'https://evil.example' } })
      expect(res.status).toBe(403)
      expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull()
    }
    expect(handler).not.toHaveBeenCalled()
    expect(lines.at(-1)).toMatchObject({ level: 'warn', msg: 'request', fields: { status: 403, reason: 'origin_not_allowed' } })
  })

  it('lets requests without an Origin through (health checks, cron)', async () => {
    const { app } = setup()
    expect((await app.request('/health')).status).toBe(200)
  })
})

describe('request log', () => {
  it('records outcome and latency but never the body, query string, origin or client address', async () => {
    const { app, lines } = setup()
    app.post('/echo/:id', (c) => c.json({ ok: true }))
    await app.request('/echo/42?email=someone%40example.com', {
      method: 'POST',
      body: JSON.stringify({ message: 'secret text', email: 'someone@example.com' }),
      headers: { 'Content-Type': 'application/json', Origin: PRODUCTION_ORIGIN, 'x-forwarded-for': '203.0.113.9', 'x-vercel-id': 'bom1::abc' },
    })
    const entry = lines.at(-1)!
    expect(entry).toMatchObject({ level: 'info', msg: 'request', fields: { method: 'POST', route: '/echo/:id', status: 200, requestId: 'bom1::abc' } })
    expect(typeof entry.fields!.ms).toBe('number')
    const text = JSON.stringify(lines)
    for (const leak of ['secret text', 'someone', 'example.com', '203.0.113.9', '42', PRODUCTION_ORIGIN]) expect(text).not.toContain(leak)
  })

  it('logs unhandled errors by name only and answers 500', async () => {
    const { app, lines } = setup()
    app.get('/boom', () => {
      throw new TypeError('contains someone@example.com')
    })
    const res = await app.request('/boom')
    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'internal' })
    expect(lines.find((l) => l.msg === 'unhandled')).toMatchObject({ level: 'error', fields: { error: 'TypeError' } })
    expect(JSON.stringify(lines)).not.toContain('someone@example.com')
  })

  it('answers unknown routes with a JSON 404', async () => {
    const { app } = setup()
    const res = await app.request('/nope')
    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ error: 'not_found' })
  })
})

describe('cron routes', () => {
  const secret = 'test-cron-secret-0123456789'
  const selection = { agent: 'v/agent', suggestions: 'v/small', source: { agent: 'discovered' as const, suggestions: 'discovered' as const }, checkedAt: '2026-09-26T03:00:00.000Z' }

  function cronApp(refresh = vi.fn(async () => ({ ...selection, candidates: 12, probes: [{ model: 'v/agent', ok: true, ms: 800 }] }))) {
    const models = { refresh, current: vi.fn(), reportFailure: vi.fn() }
    return { app: createApp({ origins: originPolicy([PRODUCTION_ORIGIN]), log: { info() {}, warn() {}, error() {} }, cronSecret: secret, models }), refresh }
  }

  it('refuses /cron/* without the bearer secret, before doing any work', async () => {
    const { app, refresh } = cronApp()
    const attempts: Record<string, string>[] = [{}, { Authorization: 'Bearer wrong' }, { Authorization: secret }]
    for (const headers of attempts) {
      expect((await app.request('/cron/ai-models', { headers })).status).toBe(401)
    }
    expect(refresh).not.toHaveBeenCalled()
  })

  it('re-discovers the AI models and reports the selection with its probes', async () => {
    const { app, refresh } = cronApp()
    const res = await app.request('/cron/ai-models', { headers: { Authorization: `Bearer ${secret}` } })
    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ agent: 'v/agent', suggestions: 'v/small', candidates: 12, probes: [{ model: 'v/agent', ok: true }] })
    expect(refresh).toHaveBeenCalledOnce()
  })

  it('answers 503 when no model passes', async () => {
    const { NoModelAvailableError } = await import('./ai/models.js')
    const { app } = cronApp(vi.fn(async () => Promise.reject(new NoModelAvailableError('none'))))
    const res = await app.request('/cron/ai-models', { headers: { Authorization: `Bearer ${secret}` } })
    expect(res.status).toBe(503)
    expect(await res.json()).toEqual({ error: 'no_model_available' })
  })

  it('has no cron routes without a secret', async () => {
    const app = createApp({ origins: originPolicy([PRODUCTION_ORIGIN]), log: { info() {}, warn() {}, error() {} } })
    expect((await app.request('/cron/ai-models', { headers: { Authorization: 'Bearer anything' } })).status).toBe(404)
  })
})
