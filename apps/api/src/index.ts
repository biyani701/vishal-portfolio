import { createApp } from './app.js'
import { loadConfig } from './config.js'
import { allowedOrigins, originPolicy } from './origins.js'

// Vercel entry: Vercel detects Hono and serves this default export from a Node function (Fluid compute).
// loadConfig throws at start-up, naming every missing or invalid variable, so a misconfigured deployment never
// serves requests (specs/api-service "Missing email key").
const config = loadConfig(process.env)

const app = createApp({
  origins: originPolicy(allowedOrigins({ ALLOWED_ORIGINS: config.ALLOWED_ORIGINS, VERCEL_ENV: process.env.VERCEL_ENV })),
  version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7),
})

export default app
