// @vitest-environment jsdom
import '../no-telemetry.js'
import { serve, type ServerType } from '@hono/node-server'
import { CopilotKitCore } from '@copilotkit/core'
import type { AddressInfo } from 'node:net'
import { afterEach, describe, expect, it } from 'vitest'
import { createApp } from '../create-app.js'
import type { Logger } from '../log.js'
import { originPolicy, PRODUCTION_ORIGIN } from '../origins.js'
import { ASK_AGENT_ID, ASK_BASE_PATH, askHandler } from './ask.js'
import type { ModelResolver } from './models.js'
import { SPIKE_PROMPT, spikeTools } from './spike-agent.js'

// Spike S1 (task 11.1): CopilotKit's v2 client, over real HTTP, to the Hono-mounted runtime and a BuiltInAgent on
// an OpenAI-compatible chat-completions model. The provider is faked at its HTTP boundary: it streams a tool call
// in pieces, then an answer once it sees the tool's result, the way NVIDIA's endpoint streams them. jsdom, because
// the client only connects to a runtime when it finds a window (a browser).

const BASE_URL = 'https://provider.test/v1'
const MODEL = 'vendor/discovered-instruct'

const quiet: Logger = { info: () => {}, warn: () => {}, error: () => {} }

const models: ModelResolver = {
  current: async () => ({ agent: MODEL, suggestions: MODEL, source: { agent: 'discovered', suggestions: 'agent' }, checkedAt: '2026-09-27T00:00:00Z' }),
  refresh: async () => {
    throw new Error('not used')
  },
  reportFailure: async () => {},
}

const chunk = (delta: object, finish: string | null = null) =>
  `data: ${JSON.stringify({ id: 'c1', object: 'chat.completion.chunk', created: 0, model: MODEL, choices: [{ index: 0, delta, finish_reason: finish }] })}\n\n`

const sse = (parts: string[]) =>
  new Response(
    new ReadableStream({
      async start(controller) {
        for (const part of parts) {
          controller.enqueue(new TextEncoder().encode(part))
          await new Promise((resolve) => setTimeout(resolve, 5))
        }
        controller.close()
      },
    }),
    { headers: { 'Content-Type': 'text/event-stream' } },
  )

interface ProviderCall {
  url: string
  body: { model: string; stream: boolean; max_tokens?: number; tools?: { function: { name: string } }[]; messages: { role: string; content?: unknown }[] }
}

function fakeProvider() {
  const calls: ProviderCall[] = []
  const fetch: typeof globalThis.fetch = async (input, init) => {
    const body = JSON.parse(String(init?.body)) as ProviderCall['body']
    calls.push({ url: String(input), body })
    const toolResult = body.messages.find((m) => m.role === 'tool')
    if (!toolResult) {
      return sse([
        chunk({ role: 'assistant', tool_calls: [{ index: 0, id: 'call_1', type: 'function', function: { name: 'list_site_sections', arguments: '' } }] }),
        chunk({ tool_calls: [{ index: 0, function: { arguments: '{"contains"' } }] }),
        chunk({ tool_calls: [{ index: 0, function: { arguments: ':"work"}' } }] }),
        chunk({}, 'tool_calls'),
        'data: [DONE]\n\n',
      ])
    }
    return sse([chunk({ role: 'assistant', content: 'The site has ' }), chunk({ content: 'a Work section.' }), chunk({}, 'stop'), 'data: [DONE]\n\n'])
  }
  return { fetch, calls }
}

let server: ServerType | undefined
afterEach(() => new Promise<void>((resolve) => (server ? server.close(() => resolve()) : resolve())))

async function start() {
  const provider = fakeProvider()
  const origins = originPolicy([PRODUCTION_ORIGIN])
  const app = createApp({
    origins,
    log: quiet,
    ask: askHandler({ models, baseUrl: BASE_URL, apiKey: 'test-key', maxOutputTokens: 1200, origins, prompt: SPIKE_PROMPT, tools: spikeTools, fetch: provider.fetch }),
  })
  const port = await new Promise<number>((resolve) => {
    server = serve({ fetch: app.fetch, port: 0 }, (info: AddressInfo) => resolve(info.port))
  })
  return { provider, app, runtimeUrl: `http://127.0.0.1:${port}${ASK_BASE_PATH}` }
}

async function connectedAgent(runtimeUrl: string) {
  const core = new CopilotKitCore({ runtimeUrl })
  await expect.poll(() => core.getAgent(ASK_AGENT_ID), { timeout: 5000 }).toBeDefined()
  return { core, agent: core.getAgent(ASK_AGENT_ID)! }
}

describe('Ask runtime (spike S1)', () => {
  it('streams a server-side tool call and the answer to the v2 client', async () => {
    const { provider, runtimeUrl } = await start()
    const { core, agent } = await connectedAgent(runtimeUrl)

    const events: { type: string; [key: string]: unknown }[] = []
    agent.subscribe({ onEvent: ({ event }) => void events.push(event as (typeof events)[number]) })
    agent.addMessage({ id: 'u1', role: 'user', content: 'Is there a section about work?' })
    await core.runAgent({ agent })

    const types = events.map((e) => e.type)
    expect(types[0]).toBe('RUN_STARTED')
    expect(types.at(-1)).toBe('RUN_FINISHED')

    // The tool call arrives as it streams: its name first, then the arguments in pieces.
    const toolStart = events.find((e) => e.type === 'TOOL_CALL_START')
    expect(toolStart).toMatchObject({ toolCallName: 'list_site_sections' })
    const args = events.filter((e) => e.type === 'TOOL_CALL_ARGS').map((e) => e.delta)
    expect(args.length).toBeGreaterThan(1)
    expect(JSON.parse(args.join(''))).toEqual({ contains: 'work' })
    expect(types.indexOf('TOOL_CALL_END')).toBeGreaterThan(types.lastIndexOf('TOOL_CALL_ARGS'))

    // The runtime ran the tool itself and streamed its result, then the answer, token by token.
    const result = events.find((e) => e.type === 'TOOL_CALL_RESULT')
    expect(JSON.parse(String(result?.content))).toEqual({ sections: ['Work'] })
    const text = events.filter((e) => e.type === 'TEXT_MESSAGE_CONTENT').map((e) => e.delta)
    expect(text).toEqual(['The site has ', 'a Work section.'])
    expect(agent.messages.at(-1)).toMatchObject({ role: 'assistant', content: 'The site has a Work section.' })

    // Two chat-completions calls on the discovered model, streamed, with the tool and the token limit.
    expect(provider.calls.map((c) => c.url)).toEqual([`${BASE_URL}/chat/completions`, `${BASE_URL}/chat/completions`])
    for (const { body } of provider.calls) {
      expect(body).toMatchObject({ model: MODEL, stream: true, max_tokens: 1200 })
      expect(body.tools?.map((t) => t.function.name)).toContain('list_site_sections')
      expect(body.messages[0]).toMatchObject({ role: 'system', content: SPIKE_PROMPT })
    }
  })

  it('refuses another origin before the runtime sees it', async () => {
    const { app } = await start()
    const res = await app.request(`${ASK_BASE_PATH}/info`, { headers: { Origin: 'https://evil.example' } })
    expect(res.status).toBe(403)
  })

  it('answers CORS for the site with the site origin, not a wildcard', async () => {
    const { app } = await start()
    const res = await app.request(`${ASK_BASE_PATH}/info`, { headers: { Origin: PRODUCTION_ORIGIN } })
    expect(res.status).toBe(200)
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe(PRODUCTION_ORIGIN)
  })
})
