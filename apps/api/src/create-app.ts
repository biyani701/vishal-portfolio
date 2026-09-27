import { createHash, timingSafeEqual } from 'node:crypto'
import { Hono, type MiddlewareHandler } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { cors } from 'hono/cors'
import type { askHandler } from './ai/ask.js'
import { clientIp } from './client-ip.js'
import { NoModelAvailableError, type ModelResolver } from './ai/models.js'
import type { ContactDelivery } from './contact/delivery.js'
import type { ContactMessages } from './contact/messages.js'
import { parseContact } from './contact/schema.js'
import { consoleLogger, requestLog, type AppEnv, type Logger } from './log.js'
import type { OriginPolicy } from './origins.js'
import type { RateLimiter } from './ratelimit.js'

// apps/api (design.md A6; specs/api-service). Not named app.ts: Vercel's Hono preset treats src/app.* as the entry
// and requires a default export there. Built by a factory so tests can pass their own origins and logger;
// src/index.ts is the Vercel entry.

export interface AppOptions {
  origins: OriginPolicy
  log?: Logger
  /** The deployed commit, for /health. */
  version?: string
  /** Bearer token Vercel Cron sends to /cron/* (CRON_SECRET). Without it, cron routes answer 404. */
  cronSecret?: string
  /** Automatic AI model selection (src/ai/models.ts). */
  models?: ModelResolver
  /** POST /contact and its daily job (src/contact). */
  contact?: ContactOptions
  /** The Ask runtime's AG-UI endpoints under /ask (src/ai/ask.ts). */
  ask?: ReturnType<typeof askHandler>
}

export interface ContactOptions {
  messages: ContactMessages
  delivery: ContactDelivery
  /** Per-IP limit on submissions (CONTACT_RATE_LIMIT_PER_IP_PER_HOUR). */
  limiter: RateLimiter
  /** CONTACT_RETENTION_DAYS: the daily job deletes older messages. */
  retentionDays: number
  /** Keeps work running after the response (Vercel's waitUntil). */
  defer?: (work: Promise<unknown>) => void
  now?: () => Date
}

/** The error's name only: messages can echo input. */
const errorName = (error: unknown) => (error instanceof Error ? error.name : 'unknown')

/** Constant-time comparison of the Authorization header with `Bearer <secret>`. */
function cronAuth(secret: string): MiddlewareHandler<AppEnv> {
  const expected = createHash('sha256').update(`Bearer ${secret}`).digest()
  return async (c, next) => {
    const given = createHash('sha256').update(c.req.header('Authorization') ?? '').digest()
    if (!timingSafeEqual(given, expected)) {
      c.set('reason', 'cron_unauthorized')
      return c.json({ error: 'unauthorized' }, 401)
    }
    await next()
  }
}

export function createApp({ origins, log = consoleLogger, version, cronSecret, models, contact, ask }: AppOptions) {
  const app = new Hono<AppEnv>()

  app.use(requestLog(log))

  // specs/api-service "Foreign origin": a browser request from any other origin is refused before it reaches a
  // handler, rather than being processed and merely denied CORS headers. Requests without an Origin (health
  // checks, cron, curl) aren't browser requests and pass; routes that need more protection add their own.
  app.use(async (c, next) => {
    const origin = c.req.header('Origin')
    if (origin && !origins.allows(origin)) {
      c.set('reason', 'origin_not_allowed')
      return c.json({ error: 'origin_not_allowed' }, 403)
    }
    await next()
  })

  app.use(
    cors({
      origin: (origin) => (origins.allows(origin) ? origin : null),
      allowMethods: ['GET', 'POST', 'OPTIONS'],
      allowHeaders: ['Content-Type'],
      maxAge: 600,
    }),
  )

  app.get('/health', (c) => c.json({ status: 'ok', ...(version && { version }) }))

  if (contact) {
    const { messages, delivery, limiter, defer = (work) => void work, now = () => new Date() } = contact

    // specs/api-service "Contact endpoint": validate, drop honeypot hits, rate-limit per IP, store, then email.
    // Success means stored: an email failure still answers 201, and the message is retried later.
    app.post('/contact', bodyLimit({ maxSize: 32 * 1024, onError: (c) => c.json({ error: 'too_large' }, 413) }), async (c) => {
      const parsed = parseContact(await c.req.json().catch(() => undefined))
      if (!parsed.ok) {
        c.set('reason', 'invalid')
        return c.json({ error: 'invalid', fields: parsed.fields }, 400)
      }
      if (parsed.honeypot) {
        // Looks like success, so a bot learns nothing. Nothing is stored or sent.
        c.set('reason', 'honeypot')
        return c.json({ status: 'received' }, 201)
      }

      // If the store is down, let the message through: losing a visitor's message is worse than a burst.
      const limit = await limiter.hit(clientIp(c.req.raw.headers)).catch((error: unknown) => {
        log.warn('contact rate limit unavailable', { error: errorName(error) })
        return undefined
      })
      if (limit && !limit.allowed) {
        c.set('reason', 'rate_limited')
        c.header('Retry-After', String(limit.retryAfterSeconds))
        return c.json({ error: 'rate_limited', retryAfterSeconds: limit.retryAfterSeconds }, 429)
      }

      let stored
      try {
        stored = await messages.insert(parsed.input, now())
      } catch (error) {
        log.error('contact store failed', { error: errorName(error) })
        c.set('reason', 'store_failed')
        return c.json({ error: 'unavailable' }, 503)
      }

      try {
        // Email works again, so clear any backlog after responding.
        if (await delivery.deliver(stored)) {
          defer(delivery.retryPending().catch((error: unknown) => log.warn('contact retry failed', { error: errorName(error) })))
        }
      } catch (error) {
        // Recording the outcome failed. The message is stored and still pending, so the daily job retries it.
        log.error('contact delivery bookkeeping failed', { id: stored.id, error: errorName(error) })
      }
      return c.json({ status: 'received' }, 201)
    })
  }

  if (ask) app.route('/', ask)

  // Scheduled jobs (vercel.json "crons"), callable only with CRON_SECRET.
  if (cronSecret) {
    app.use('/cron/*', cronAuth(cronSecret))

    if (contact) {
      // Daily (the Hobby plan's cron limit): retry undelivered notifications, flag any still undelivered after
      // 24 hours, and delete messages older than CONTACT_RETENTION_DAYS.
      app.get('/cron/contact', async (c) => c.json(await contact.delivery.runDaily(contact.retentionDays)))
    }

    if (models) {
      // Daily: re-discover the AI models, since the provider's free catalog rotates (vishal-portfolio-9cm.11.7).
      app.get('/cron/ai-models', async (c) => {
        try {
          const report = await models.refresh()
          return c.json({
            agent: report.agent,
            suggestions: report.suggestions,
            source: report.source,
            checkedAt: report.checkedAt,
            candidates: report.candidates,
            probes: report.probes,
          })
        } catch (error) {
          if (!(error instanceof NoModelAvailableError)) throw error
          c.set('reason', 'no_model_available')
          return c.json({ error: 'no_model_available' }, 503)
        }
      })
    }
  }

  app.notFound((c) => c.json({ error: 'not_found' }, 404))
  app.onError((error, c) => {
    log.error('unhandled', { route: c.req.routePath, error: errorName(error) })
    return c.json({ error: 'internal' }, 500)
  })

  return app
}
