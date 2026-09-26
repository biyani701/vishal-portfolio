import { createHash, timingSafeEqual } from 'node:crypto'
import { Hono, type MiddlewareHandler } from 'hono'
import { cors } from 'hono/cors'
import { NoModelAvailableError, type ModelResolver } from './ai/models.js'
import { consoleLogger, requestLog, type AppEnv, type Logger } from './log.js'
import type { OriginPolicy } from './origins.js'

// apps/api (design.md A6; specs/api-service). Built by a factory so tests can pass their own origins and logger;
// src/index.ts is the Vercel entry. Routes arrive in later tasks: POST /contact (10.3) and the Ask runtime (11.2).

export interface AppOptions {
  origins: OriginPolicy
  log?: Logger
  /** The deployed commit, for /health. */
  version?: string
  /** Bearer token Vercel Cron sends to /cron/* (CRON_SECRET). Without it, cron routes answer 404. */
  cronSecret?: string
  /** Automatic AI model selection (src/ai/models.ts). */
  models?: ModelResolver
}

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

export function createApp({ origins, log = consoleLogger, version, cronSecret, models }: AppOptions) {
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

  // Scheduled jobs (vercel.json "crons"), callable only with CRON_SECRET. Contact retry and purge join in 10.3.
  if (cronSecret) {
    app.use('/cron/*', cronAuth(cronSecret))

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
    // The error's name only: messages can echo input.
    log.error('unhandled', { route: c.req.routePath, error: error.name })
    return c.json({ error: 'internal' }, 500)
  })

  return app
}
