import { wrapLanguageModel } from 'ai'
import type { Logger } from '../log.js'
import type { Budget } from './budget.js'
import { isModelGone, type ModelResolver } from './models.js'

// Wraps the agent's model (task 11.2):
// - counts each call's tokens against the daily budget;
// - drops reasoning parts, so the model's raw reasoning never reaches the page (specs/ask-experience "Activity");
// - removes the state-editing tools BuiltInAgent always adds (AGUISendState*): Ask keeps no shared state, and a
//   tool that writes to the page is one more thing injected text could try to call;
// - replaces provider errors with a stable code, so neither provider messages nor anything they echo reach the
//   visitor: the page reads the code from the AG-UI RUN_ERROR message and picks its copy;
// - reports a model that's gone (404/410/403/402), so the next request fails over to another (src/ai/models.ts).

type LanguageModelV3 = Parameters<typeof wrapLanguageModel>[0]['model']
type LanguageModelV3StreamPart = Awaited<ReturnType<LanguageModelV3['doStream']>>['stream'] extends ReadableStream<infer P> ? P : never

/** Codes the page understands (apps/web features/ask). */
export const ASK_ERRORS = {
  rateLimited: 'ask_rate_limited',
  budget: 'ask_budget_exhausted',
  unavailable: 'ask_unavailable',
  failed: 'ask_failed',
} as const

export class AskError extends Error {
  override name = 'AskError'
  constructor(readonly code: (typeof ASK_ERRORS)[keyof typeof ASK_ERRORS]) {
    super(code)
  }
}

const statusOf = (error: unknown): number | undefined => {
  const status = (error as { statusCode?: unknown })?.statusCode
  return typeof status === 'number' ? status : undefined
}

export function guardModel(model: LanguageModelV3, { budget, models, log }: { budget: Budget; models: ModelResolver; log: Logger }): LanguageModelV3 {
  const translate = (error: unknown): AskError => {
    if (error instanceof AskError) return error
    const status = statusOf(error)
    if (status === 429) {
      log.warn('ask_provider_rate_limited', { model: model.modelId })
      return new AskError(ASK_ERRORS.rateLimited)
    }
    if (status && isModelGone(status)) {
      void models.reportFailure(model.modelId, `http_${status}`)
      return new AskError(ASK_ERRORS.unavailable)
    }
    log.error('ask_model_error', { model: model.modelId, status: status ?? 0, error: (error as Error)?.name ?? 'unknown' })
    return new AskError(ASK_ERRORS.failed)
  }

  const record = (usage: { inputTokens?: { total?: number }; outputTokens?: { total?: number } } | undefined) =>
    budget.record((usage?.inputTokens?.total ?? 0) + (usage?.outputTokens?.total ?? 0)).catch((error: unknown) => log.warn('ask_budget_unavailable', { error: (error as Error).name }))

  return wrapLanguageModel({
    model,
    middleware: {
      specificationVersion: 'v3',
      transformParams: async ({ params }) => ({ ...params, tools: params.tools?.filter((tool) => !tool.name.startsWith('AGUISendState')) }),
      wrapGenerate: async ({ doGenerate }) => {
        try {
          const result = await doGenerate()
          await record(result.usage)
          return { ...result, content: result.content.filter((part) => part.type !== 'reasoning') }
        } catch (error) {
          throw translate(error)
        }
      },
      wrapStream: async ({ doStream }) => {
        let result
        try {
          result = await doStream()
        } catch (error) {
          throw translate(error)
        }
        const stream = result.stream.pipeThrough(
          new TransformStream<LanguageModelV3StreamPart, LanguageModelV3StreamPart>({
            async transform(part, controller) {
              if (part.type === 'reasoning-start' || part.type === 'reasoning-delta' || part.type === 'reasoning-end') return
              if (part.type === 'error') {
                controller.enqueue({ type: 'error', error: translate(part.error) })
                return
              }
              if (part.type === 'finish') await record(part.usage)
              controller.enqueue(part)
            },
          }),
        )
        return { ...result, stream }
      },
    },
  })
}
