import type { ToolDefinition } from '@copilotkit/runtime/v2'
import { Hono } from 'hono'
import type { AppEnv } from '../log.js'
import type { OriginPolicy } from '../origins.js'
import type { ModelResolver } from './models.js'

// The Ask runtime (design.md A5, spike S1). CopilotKit's v2 runtime serves the AG-UI endpoints under /ask through
// its Hono adapter, so it runs in the same Vercel Node function as the rest of apps/api. The agent is CopilotKit's
// BuiltInAgent over an OpenAI-compatible chat-completions model (AI_BASE_URL). The model is whichever one
// discovery selected (src/ai/models.ts), so agents are built per request rather than once at start-up.
//
// Left at the runtime's safe defaults: the client can't override the model or limits (no overridableProperties),
// and system or developer messages it sends are not forwarded to the model.
//
// The runtime takes over a second to import, so it loads on the first /ask request rather than with the
// function: /health and /contact share the function and would otherwise pay for it on every cold start.

export const ASK_BASE_PATH = '/ask'
export const ASK_AGENT_ID = 'ask'

/** CopilotKit's defineTool without importing the runtime (theirs only returns its argument). */
export const defineAskTool = <P extends ToolDefinition['parameters']>(tool: ToolDefinition<P>) => tool

export interface AskOptions {
  models: ModelResolver
  baseUrl: string
  apiKey: string
  /** AI_MAX_OUTPUT_TOKENS: the most one answer may generate. */
  maxOutputTokens: number
  origins: OriginPolicy
  prompt: string
  tools: ToolDefinition[]
  /** Test seam for the provider's HTTP calls. */
  fetch?: typeof globalThis.fetch
}

async function loadRuntime({ models, baseUrl, apiKey, maxOutputTokens, origins, prompt, tools, fetch }: AskOptions) {
  const [{ createOpenAI }, { BuiltInAgent, CopilotRuntime }, { createCopilotHonoHandler }] = await Promise.all([
    import('@ai-sdk/openai'),
    import('@copilotkit/runtime/v2'),
    import('@copilotkit/runtime/v2/hono'),
  ])
  const provider = createOpenAI({ baseURL: baseUrl, apiKey, ...(fetch && { fetch }) })

  const runtime = new CopilotRuntime({
    agents: async () => {
      const { agent } = await models.current()
      return {
        [ASK_AGENT_ID]: new BuiltInAgent({
          // .chat(): the provider speaks chat completions, not OpenAI's Responses API (the SDK's default).
          model: provider.chat(agent),
          prompt,
          tools,
          maxOutputTokens,
          // Enough for a lookup or two and the answer; each step is another model call.
          maxSteps: 4,
        }),
      }
    },
  })

  return createCopilotHonoHandler({
    runtime,
    basePath: ASK_BASE_PATH,
    // Its own CORS defaults to any origin; keep it to the site's, as for every other route.
    cors: { origin: (origin) => (origins.allows(origin) ? origin : null) },
  })
}

export function askHandler(options: AskOptions) {
  const app = new Hono<AppEnv>()
  let runtime: ReturnType<typeof loadRuntime> | undefined

  const serve = async (request: Request) => {
    runtime ??= loadRuntime(options).catch((error: unknown) => {
      runtime = undefined // try again on the next request
      throw error
    })
    return (await runtime).fetch(request)
  }

  app.all(ASK_BASE_PATH, (c) => serve(c.req.raw))
  app.all(`${ASK_BASE_PATH}/*`, (c) => serve(c.req.raw))
  return app
}
