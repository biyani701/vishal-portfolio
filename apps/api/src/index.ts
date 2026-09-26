// Vercel's Hono preset only accepts an entry that imports hono itself (a value import, not `import type`).
import { Hono } from 'hono'
import { waitUntil } from '@vercel/functions'
import { openAiCatalog } from './ai/catalog.js'
import { modelResolver } from './ai/models.js'
import { createApp } from './create-app.js'
import { loadConfig } from './config.js'
import { contactDelivery } from './contact/delivery.js'
import { resendMailer } from './contact/mailer.js'
import { contactMessages } from './contact/messages.js'
import { neonDb } from './db/client.js'
import { consoleLogger, type AppEnv } from './log.js'
import { allowedOrigins, originPolicy } from './origins.js'
import { rateLimiter } from './ratelimit.js'
import { upstashStore } from './store.js'

// Vercel entry: Vercel detects Hono and serves this default export from a Node function (Fluid compute).
// loadConfig throws at start-up, naming every missing or invalid variable, so a misconfigured deployment never
// serves requests (specs/api-service "Missing email key").
const config = loadConfig(process.env)
const store = upstashStore(config.KV_REST_API_URL, config.KV_REST_API_TOKEN)

const models = modelResolver({
  catalog: openAiCatalog({ baseUrl: config.AI_BASE_URL, apiKey: config.AI_API_KEY }),
  store,
  log: consoleLogger,
  pinned: { agent: config.AI_MODEL, suggestions: config.AI_SUGGESTION_MODEL },
  prefer: config.AI_MODEL_PREFER,
  refreshHours: config.AI_MODEL_REFRESH_HOURS,
  probeLimit: config.AI_MODEL_PROBE_LIMIT,
})

const messages = contactMessages(neonDb(config.DATABASE_URL))
const mailer = resendMailer({ apiKey: config.RESEND_API_KEY, from: config.CONTACT_FROM_EMAIL, to: config.CONTACT_TO_EMAIL })

const app: Hono<AppEnv> = createApp({
  origins: originPolicy(allowedOrigins({ ALLOWED_ORIGINS: config.ALLOWED_ORIGINS, VERCEL_ENV: process.env.VERCEL_ENV })),
  version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7),
  cronSecret: config.CRON_SECRET,
  models,
  contact: {
    messages,
    delivery: contactDelivery({ messages, mailer, log: consoleLogger }),
    limiter: rateLimiter({ store, name: 'contact', limit: config.CONTACT_RATE_LIMIT_PER_IP_PER_HOUR }),
    retentionDays: config.CONTACT_RETENTION_DAYS,
    defer: waitUntil,
  },
})

export default app
