// Ranking catalog models for automatic selection (vishal-portfolio-9cm.11.7). The provider rotates what it
// offers, so nothing here names a model: candidates are ordered by generic signals read from the id, and the
// probes in models.ts have the final say. The order only decides which few models get probed first.

export interface CatalogModel {
  id: string
  /** Unix seconds, when the provider reports it. */
  created?: number
}

/**
 * Ids that are clearly not chat models (embeddings, rerankers, vision, speech, safety classifiers, image and
 * video generation). A miss here only costs a probe; a false positive would hide a usable model, so the terms
 * are broad categories rather than model names.
 */
const NOT_CHAT =
  /(embed|rerank|retriev|guard|safety|reward|classif|clip|vision|[-_/]vl[-_\d]|vlm|ocr|parse|asr|tts|whisper|audio|speech|image|diffus|video|detect|segment|pii|translat)/i
/** Tuned for following instructions in a conversation. */
const CHAT_SIGNAL = /(instruct|chat|[-_]it\b|[-_]it[-_])/i
/** Specialised for writing code: weaker at conversation and at choosing tools from prose. */
const CODE_SIGNAL = /(code|coder|codestral)/i

/**
 * The model generation from the id: the first bare version number after the vendor ("llama-3.3-70b" → 3.3,
 * "gemma-4-31b" → 4, "llama2-70b" → 2). Only a tie-breaker: providers don't report reliable release dates (NVIDIA
 * returns the same `created` for every model), and newer generations of a size are usually better.
 */
export function generation(id: string): number | undefined {
  const name = id.toLowerCase().split('/').pop() ?? ''
  for (const token of name.split(/[-_]/)) {
    const bare = /^(\d+(?:\.\d+)?)$/.exec(token) ?? /^[a-z]+(\d+(?:\.\d+)?)$/.exec(token)
    if (bare) return Number(bare[1])
  }
  return undefined
}

/** Parameter count in billions from the id: "…-70b-…" → 70, "mixtral-8x22b" → 176; undefined if absent. */
export function parameterBillions(id: string): number | undefined {
  const name = id.toLowerCase()
  const moe = /(\d+)x(\d+(?:\.\d+)?)b(?![a-z])/.exec(name)
  if (moe) return Number(moe[1]) * Number(moe[2])
  const size = /(?:^|[-_/.])(\d+(?:\.\d+)?)b(?![a-z])/.exec(name)
  return size ? Number(size[1]) : undefined
}

/** Turns "llama-3.3-*-instruct" style patterns into case-insensitive matchers for AI_MODEL_PREFER. */
export function preferenceMatchers(patterns: readonly string[]) {
  return patterns.map((pattern) => new RegExp(`^${pattern.split('*').map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*')}$`, 'i'))
}

export type Role = 'agent' | 'suggestions'

/**
 * Candidates for a role, best first. The agent (tool calls, longer answers) prefers mid-to-large instruct models;
 * suggestions (short follow-up questions) prefer small ones. Preferred patterns come first in their given order,
 * then the score, then newer, then the id for a stable order.
 */
export function rankCandidates(models: readonly CatalogModel[], role: Role, prefer: readonly RegExp[] = []): CatalogModel[] {
  const preferIndex = (id: string) => {
    const index = prefer.findIndex((re) => re.test(id))
    return index === -1 ? prefer.length : index
  }
  const score = (id: string) => {
    const size = parameterBillions(id)
    let value = (CHAT_SIGNAL.test(id) ? 2 : 0) - (CODE_SIGNAL.test(id) ? 3 : 0)
    if (role === 'agent') {
      if (size === undefined) value += 0
      else if (size < 7) value -= 3
      else if (size < 20) value += 0
      else if (size <= 130) value += 3
      else value += 1 // very large: capable but slow
    } else {
      if (size === undefined) value += 0
      else if (size < 3) value -= 1
      else if (size <= 15) value += 3
      else if (size <= 40) value += 1
    }
    return value
  }

  return models
    .filter((model) => !NOT_CHAT.test(model.id))
    .map((model) => ({ model, prefer: preferIndex(model.id), score: score(model.id), generation: generation(model.id) ?? 0 }))
    .sort(
      (a, b) =>
        a.prefer - b.prefer ||
        b.score - a.score ||
        b.generation - a.generation ||
        (b.model.created ?? 0) - (a.model.created ?? 0) ||
        a.model.id.localeCompare(b.model.id),
    )
    .map(({ model }) => model)
}
