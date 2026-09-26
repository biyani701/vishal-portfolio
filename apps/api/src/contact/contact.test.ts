import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp } from '../create-app.js'
import { migrate } from '../db/migrate.js'
import { pgliteDb } from '../db/testing.js'
import type { Logger } from '../log.js'
import { originPolicy, PRODUCTION_ORIGIN } from '../origins.js'
import { rateLimiter } from '../ratelimit.js'
import { memoryStore } from '../store.js'
import { contactDelivery } from './delivery.js'
import { MailerError, type Mailer } from './mailer.js'
import { contactMessages } from './messages.js'

// vishal-portfolio-9cm.10.5 (tasks.md 10.3): POST /contact and its daily job, against a real Postgres (PGlite).
const secret = 'test-cron-secret-0123456789'
const DAY = 24 * 60 * 60 * 1000
const valid = { intent: 'role', name: 'Ada Lovelace', email: 'ada@example.com', message: 'Are you open to a programme lead role?' }

let db: ReturnType<typeof pgliteDb> | undefined
afterEach(async () => {
  await db?.close()
  db = undefined
})

async function setup({ retentionDays = 365, limit = 5 } = {}) {
  db = pgliteDb()
  const quiet: Logger = { info() {}, warn() {}, error() {} }
  await migrate(db, quiet)

  let clock = Date.parse('2026-09-27T09:09:00Z')
  const now = () => new Date(clock)
  const lines: { level: string; msg: string; fields?: Record<string, unknown> }[] = []
  const log: Logger = {
    info: (msg, fields) => lines.push({ level: 'info', msg, fields }),
    warn: (msg, fields) => lines.push({ level: 'warn', msg, fields }),
    error: (msg, fields) => lines.push({ level: 'error', msg, fields }),
  }
  const mail = { down: false }
  const mailer = { notify: vi.fn(async () => (mail.down ? Promise.reject(new MailerError('status_503')) : undefined)) } satisfies Mailer
  const store = memoryStore(() => clock)
  const messages = contactMessages(db)
  const deferred: Promise<unknown>[] = []

  const build = (days: number) =>
    createApp({
      origins: originPolicy([PRODUCTION_ORIGIN]),
      log,
      cronSecret: secret,
      contact: {
        messages,
        delivery: contactDelivery({ messages, mailer, log, now }),
        limiter: rateLimiter({ store, name: 'contact', limit, now: () => clock }),
        retentionDays: days,
        defer: (work) => deferred.push(work),
        now,
      },
    })
  const app = build(retentionDays)

  const post = (body: unknown, ip = '203.0.113.7') =>
    app.request('/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: PRODUCTION_ORIGIN, 'x-real-ip': ip },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    })
  const cron = (target = app) => target.request('/cron/contact', { headers: { Authorization: `Bearer ${secret}` } })
  const rows = () =>
    db!.query<{ name: string; status: string; email_attempts: number; source: string }>(
      'select name, status, email_attempts, source from contact_messages order by created_at',
    )
  const settle = async () => {
    await Promise.all(deferred.splice(0))
  }
  return { app, build, post, cron, rows, mail, mailer, lines, settle, advance: (ms: number) => (clock += ms) }
}

describe('POST /contact', () => {
  it('stores the message, emails the owner, and answers 201', async () => {
    const { post, rows, mailer } = await setup()
    const res = await post(valid)
    expect(res.status).toBe(201)
    expect(await res.json()).toEqual({ status: 'received' })
    expect(await rows()).toEqual([{ name: 'Ada Lovelace', status: 'sent', email_attempts: 1, source: 'page' }])
    expect(mailer.notify).toHaveBeenCalledWith(expect.objectContaining({ email: 'ada@example.com', intent: 'role' }))
  })

  it('accepts a request drafted in Ask through the same endpoint', async () => {
    const { post, rows } = await setup()
    expect((await post({ ...valid, source: 'ask' })).status).toBe(201)
    expect((await rows())[0]!.source).toBe('ask')
  })

  it.each([
    ['a missing email', { ...valid, email: undefined }, { email: 'required' }],
    ['an invalid email', { ...valid, email: 'not-an-address' }, { email: 'invalid' }],
    ['a blank name and message', { ...valid, name: '  ', message: '' }, { name: 'required', message: 'required' }],
    ['an unknown intent', { ...valid, intent: 'sales' }, { intent: 'invalid' }],
    ['an over-long message', { ...valid, message: 'x'.repeat(5001) }, { message: 'too_long' }],
  ])('rejects %s with a code per field, storing nothing', async (_, body, fields) => {
    const { post, rows, mailer } = await setup()
    const res = await post(body)
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'invalid', fields })
    expect(await rows()).toEqual([])
    expect(mailer.notify).not.toHaveBeenCalled()
  })

  it('rejects a body that is not JSON', async () => {
    const { post } = await setup()
    expect((await post('name=Ada')).status).toBe(400)
  })

  it('answers a honeypot hit like a success, but stores and sends nothing', async () => {
    const { post, rows, mailer } = await setup()
    const res = await post({ ...valid, website: 'https://spam.example' })
    expect(res.status).toBe(201)
    expect(await rows()).toEqual([])
    expect(mailer.notify).not.toHaveBeenCalled()
  })

  it('rate-limits each IP per hour and says when to try again', async () => {
    const { post, rows, advance } = await setup({ limit: 2 })
    expect((await post(valid)).status).toBe(201)
    expect((await post(valid)).status).toBe(201)
    const limited = await post(valid)
    expect(limited.status).toBe(429)
    expect(limited.headers.get('Retry-After')).toBe(String(51 * 60))
    expect(await limited.json()).toEqual({ error: 'rate_limited', retryAfterSeconds: 51 * 60 })
    expect((await post(valid, '198.51.100.2')).status).toBe(201)
    expect(await rows()).toHaveLength(3)
    advance(51 * 60 * 1000)
    expect((await post(valid)).status).toBe(201)
  })

  it('refuses with 503, so the form says nothing was sent, when the message cannot be stored', async () => {
    const { post } = await setup()
    await db!.query('drop table contact_messages')
    const res = await post(valid)
    expect(res.status).toBe(503)
    expect(await res.json()).toEqual({ error: 'unavailable' })
  })

  it('never logs the visitor’s name, email, message or IP', async () => {
    const { post, lines, mail } = await setup()
    await post(valid)
    mail.down = true
    await post(valid)
    const logged = JSON.stringify(lines)
    for (const value of [valid.name, valid.email, valid.message, '203.0.113.7']) expect(logged).not.toContain(value)
  })
})

describe('email provider outage', () => {
  it('still answers 201 and keeps the message pending, then the daily job delivers it', async () => {
    const { post, cron, rows, mail } = await setup()
    mail.down = true
    expect((await post(valid)).status).toBe(201)
    expect(await rows()).toEqual([expect.objectContaining({ status: 'pending_email', email_attempts: 1 })])

    mail.down = false
    const res = await cron()
    expect(await res.json()).toEqual({ retried: 1, sent: 1, flagged: 0, purged: 0 })
    expect(await rows()).toEqual([expect.objectContaining({ status: 'sent', email_attempts: 2 })])
  })

  it('clears the backlog after the next successful submission', async () => {
    const { post, rows, mail, settle } = await setup()
    mail.down = true
    await post(valid)
    mail.down = false
    await post({ ...valid, name: 'Grace Hopper' })
    await settle()
    expect((await rows()).map((row) => row.status)).toEqual(['sent', 'sent'])
  })

  it('flags a message still undelivered after 24 hours, tells the owner, and stops retrying it', async () => {
    const { post, cron, rows, mail, mailer, lines, advance } = await setup()
    mail.down = true
    await post(valid)
    advance(25 * 60 * 60 * 1000)
    expect(await (await cron()).json()).toEqual({ retried: 1, sent: 0, flagged: 1, purged: 0 })
    expect((await rows())[0]!.status).toBe('flagged')
    expect(lines).toContainEqual({ level: 'error', msg: 'contact messages flagged', fields: { flagged: 1, afterHours: 24 } })

    mail.down = false
    mailer.notify.mockClear()
    await cron()
    expect(mailer.notify).not.toHaveBeenCalled()
  })
})

describe('retention', () => {
  it('purges messages older than CONTACT_RETENTION_DAYS, and a changed value takes effect with no code change', async () => {
    const { post, cron, build, rows, advance } = await setup({ retentionDays: 365 })
    await post({ ...valid, name: 'Old' })
    advance(200 * DAY)
    await post({ ...valid, name: 'Recent' })
    advance(200 * DAY)
    await post({ ...valid, name: 'New' })
    // Ages now: Old 400 days, Recent 200 days, New 0 days.

    expect(await (await cron()).json()).toMatchObject({ purged: 1 })
    expect((await rows()).map((row) => row.name)).toEqual(['Recent', 'New'])

    expect(await (await cron(build(180))).json()).toMatchObject({ purged: 1 })
    expect((await rows()).map((row) => row.name)).toEqual(['New'])
  })

  it('refuses the daily job without the cron secret', async () => {
    const { app } = await setup()
    expect((await app.request('/cron/contact')).status).toBe(401)
  })
})
