import type { MiddlewareHandler } from 'hono'

// Structured logs (specs/api-service "Observability without personal data"): one JSON line per event with
// outcomes, latency and reasons. Callers pass only safe fields; request bodies, query strings, email
// addresses, IPs and conversation text are never logged. Vercel collects stdout/stderr.

export type LogFields = Record<string, string | number | boolean | null | undefined>

export interface Logger {
  info(msg: string, fields?: LogFields): void
  warn(msg: string, fields?: LogFields): void
  error(msg: string, fields?: LogFields): void
}

const line = (level: string, msg: string, fields?: LogFields) => JSON.stringify({ level, msg, ...fields })

export const consoleLogger: Logger = {
  info: (msg, fields) => console.log(line('info', msg, fields)),
  warn: (msg, fields) => console.warn(line('warn', msg, fields)),
  error: (msg, fields) => console.error(line('error', msg, fields)),
}

export type AppEnv = { Variables: { reason?: string } }

/**
 * Logs every request once it's answered: method, the matched route pattern (never the raw URL, which could
 * carry a query string), status, duration, Vercel's request id and any `reason` a handler set.
 */
export function requestLog(log: Logger): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const started = performance.now()
    await next()
    const status = c.res.status
    const fields: LogFields = {
      method: c.req.method,
      route: c.req.routePath,
      status,
      ms: Math.round(performance.now() - started),
      requestId: c.req.header('x-vercel-id'),
      reason: c.get('reason'),
    }
    if (status >= 500) log.error('request', fields)
    else if (status >= 400) log.warn('request', fields)
    else log.info('request', fields)
  }
}
