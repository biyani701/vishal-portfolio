import { serve } from '@hono/node-server'
import app from './index.js'

// Local development only: `pnpm --filter api dev` serves the app on http://localhost:8787.
const port = Number(process.env.PORT ?? 8787)
serve({ fetch: app.fetch, port }, () => console.log(`apps/api on http://localhost:${port}`))
