import { consoleLogger } from '../log.js'
import { memoryStore } from '../store.js'
import { openAiCatalog } from './catalog.js'
import { modelResolver } from './models.js'

// `pnpm --filter api models`: runs model discovery once against the live catalog and prints the report, including
// every probe's outcome (vishal-portfolio-9cm.11.8). Needs only AI_API_KEY; reads apps/api/.env when present. The
// shared selection in KV is untouched: this uses an in-memory store.

const apiKey = process.env.AI_API_KEY
if (!apiKey) {
  consoleLogger.error('AI_API_KEY is not set')
  process.exit(1)
}

const resolver = modelResolver({
  catalog: openAiCatalog({ baseUrl: process.env.AI_BASE_URL ?? 'https://integrate.api.nvidia.com/v1', apiKey }),
  store: memoryStore(),
  log: consoleLogger,
  prefer: (process.env.AI_MODEL_PREFER ?? '').split(',').map((p) => p.trim()).filter(Boolean),
  refreshHours: 24,
  probeLimit: Number(process.env.AI_MODEL_PROBE_LIMIT ?? 6),
})

process.stdout.write(`${JSON.stringify(await resolver.refresh(), null, 2)}\n`)
