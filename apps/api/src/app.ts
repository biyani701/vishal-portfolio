import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { consoleLogger, requestLog, type AppEnv, type Logger } from './log.js'
import type { OriginPolicy } from './origins.js'

// apps/api (design.md A6; specs/api-service). Built by a factory so tests can pass their own origins and logger;
// src/index.ts is the Vercel entry. Routes arrive in later tasks: POST /contact (10.3) and the Ask runtime (11.2).

export interface AppOptions {
  origins: OriginPolicy
  log?: Logger
  /** The deployed commit, for /health. */
  version?: string
}

export function createApp({ origins, log = consoleLogger, version }: AppOptions) {
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

  app.notFound((c) => c.json({ error: 'not_found' }, 404))
  app.onError((error, c) => {
    // The error's name only: messages can echo input.
    log.error('unhandled', { route: c.req.routePath, error: error.name })
    return c.json({ error: 'internal' }, 500)
  })

  return app
}
