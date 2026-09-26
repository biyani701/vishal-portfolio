import { openAiCatalog } from './ai/catalog.js'
import { modelResolver } from './ai/models.js'
import { createApp } from './app.js'
import { loadConfig } from './config.js'
import { consoleLogger } from './log.js'
import { allowedOrigins, originPolicy } from './origins.js'
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

const app = createApp({
  origins: originPolicy(allowedOrigins({ ALLOWED_ORIGINS: config.ALLOWED_ORIGINS, VERCEL_ENV: process.env.VERCEL_ENV })),
  version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7),
  cronSecret: config.CRON_SECRET,
  models,
})

export default app
