import { consoleLogger } from '../log.js'
import { neonDb } from './client.js'
import { migrate } from './migrate.js'

// `pnpm migrate`: run by the Vercel build (vercel.json) against the deployment's DATABASE_URL, which the Neon
// integration points at the preview's own branch or at production. Locally it reads apps/api/.env.
// Only DATABASE_URL is needed here, so a build doesn't depend on the rest of the configuration.

const url = process.env.DATABASE_URL?.trim()
if (!url) {
  consoleLogger.error('migrations failed', { error: 'DATABASE_URL is required' })
  process.exit(1)
}

try {
  await migrate(neonDb(url), consoleLogger)
} catch (error) {
  consoleLogger.error('migrations failed', { error: error instanceof Error ? error.message : String(error) })
  process.exit(1)
}
