// @vitest-environment jsdom
import '../no-telemetry.js'
import { serve, type ServerType } from '@hono/node-server'
import { CopilotKitCore } from '@copilotkit/core'
import type { AddressInfo } from 'node:net'
import { afterAll, describe, expect, it } from 'vitest'
import { createApp } from '../create-app.js'
import { consoleLogger as log } from '../log.js'
import { originPolicy, PRODUCTION_ORIGIN } from '../origins.js'
import { memoryStore } from '../store.js'
import { ASK_AGENT_ID, ASK_BASE_PATH, askHandler } from './ask.js'
import { openAiCatalog } from './catalog.js'
import { modelResolver } from './models.js'
import { SPIKE_PROMPT, spikeTools } from './spike-agent.js'

// Spike S1 against the real provider: discovery picks the agent model, then the v2 client asks a question the
// model should answer with a tool call. Skipped without a key. Run it with:
//   AI_API_KEY=nvapi-… pnpm --filter api exec vitest run src/ai/ask.live.test.ts
// (AI_BASE_URL defaults to NVIDIA's API catalog; AI_MODEL pins a model instead of discovering one.)

const apiKey = process.env.AI_API_KEY
const baseUrl = process.env.AI_BASE_URL ?? 'https://integrate.api.nvidia.com/v1'

let server: ServerType | undefined
afterAll(() => new Promise<void>((resolve) => (server ? server.close(() => resolve()) : resolve())))

describe.runIf(apiKey)('Ask runtime against the live provider (spike S1)', () => {
  it('streams a tool call and an answer from the discovered model', { timeout: 180_000 }, async () => {
    const models = modelResolver({
      catalog: openAiCatalog({ baseUrl, apiKey: apiKey! }),
      store: memoryStore(),
      log,
      pinned: { agent: process.env.AI_MODEL },
      refreshHours: 24,
      probeLimit: 6,
    })
    const selection = await models.current()
    log.info('spike: agent model', { model: selection.agent, source: selection.source.agent })

    const origins = originPolicy([PRODUCTION_ORIGIN])
    const app = createApp({
      origins,
      ask: askHandler({ models, baseUrl, apiKey: apiKey!, maxOutputTokens: 400, origins, prompt: SPIKE_PROMPT, tools: spikeTools }),
    })
    const port = await new Promise<number>((resolve) => {
      server = serve({ fetch: app.fetch, port: 0 }, (info: AddressInfo) => resolve(info.port))
    })

    const core = new CopilotKitCore({ runtimeUrl: `http://127.0.0.1:${port}${ASK_BASE_PATH}` })
    await expect.poll(() => core.getAgent(ASK_AGENT_ID), { timeout: 10_000 }).toBeDefined()
    const agent = core.getAgent(ASK_AGENT_ID)!

    const events: { type: string; [key: string]: unknown }[] = []
    const seenAt: number[] = []
    const t0 = Date.now()
    agent.subscribe({
      onEvent: ({ event }) => {
        events.push(event as (typeof events)[number])
        seenAt.push(Date.now() - t0)
      },
    })
    agent.addMessage({ id: 'u1', role: 'user', content: 'Which sections of the site mention work? Look it up with your tool.' })
    await core.runAgent({ agent })

    const summary = events.map((e, i) => `${seenAt[i]}ms ${e.type}${e.toolCallName ? ` ${String(e.toolCallName)}` : ''}`)
    log.info('spike: events', { events: summary.join(' | ') })
    log.info('spike: answer', { answer: String(agent.messages.at(-1)?.content) })

    expect(events.find((e) => e.type === 'RUN_ERROR')).toBeUndefined()
    expect(events.find((e) => e.type === 'TOOL_CALL_START')).toMatchObject({ toolCallName: 'list_site_sections' })
    expect(events.some((e) => e.type === 'TOOL_CALL_RESULT')).toBe(true)
    expect(events.filter((e) => e.type === 'TEXT_MESSAGE_CONTENT').length).toBeGreaterThan(0)
    expect(events.at(-1)?.type).toBe('RUN_FINISHED')
  })
})
