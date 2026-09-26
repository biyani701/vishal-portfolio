import type { Logger } from '../log.js'
import type { Store } from '../store.js'
import type { Catalog, ProbeResult } from './catalog.js'
import { preferenceMatchers, rankCandidates } from './rank.js'

// Automatic model selection (vishal-portfolio-9cm.11.7). The provider's free catalog rotates, so the models Ask
// uses are discovered rather than configured: list the catalog, rank candidates, and probe the first few. The
// agent model must make a tool call; the suggestion model only has to answer. The selection is shared through the
// store so every instance agrees and probes stay rare on a rate-limited tier; a daily cron refreshes it, and a
// model that disappears is marked bad and replaced on the next request. AI_MODEL / AI_SUGGESTION_MODEL pin either.

export interface ModelSelection {
  agent: string
  suggestions: string
  source: { agent: 'pinned' | 'discovered'; suggestions: 'pinned' | 'discovered' | 'agent' }
  /** ISO time of the refresh that produced this selection. */
  checkedAt: string
}

export interface RefreshReport extends ModelSelection {
  /** Every probe this refresh ran, in order (outcomes and timings only). */
  probes: ProbeResult[]
  candidates: number
}

export class NoModelAvailableError extends Error {
  override name = 'NoModelAvailableError'
}

/** Responses that mean the model itself is gone or not available to this key (not a transient limit). */
export const isModelGone = (status: number) => status === 404 || status === 410 || status === 403 || status === 402

export interface ResolverOptions {
  catalog: Catalog
  store: Store
  log: Logger
  pinned?: { agent?: string; suggestions?: string }
  /** AI_MODEL_PREFER patterns, e.g. ["*nemotron*", "*llama*instruct"]. */
  prefer?: readonly string[]
  /** How long a selection stays current before the next request refreshes it. */
  refreshHours: number
  /** Most probes per role in one refresh. */
  probeLimit: number
  now?: () => number
}

export interface ModelResolver {
  /** The models to use now: cached, or refreshed when stale. Throws NoModelAvailableError if none works. */
  current(): Promise<ModelSelection>
  /** Re-discovers now (the daily cron). */
  refresh(): Promise<RefreshReport>
  /** Call when a model answered with a "gone" status (isModelGone); it's skipped until the next day's refresh. */
  reportFailure(model: string, reason: string): Promise<void>
}

const toSelection = ({ agent, suggestions, source, checkedAt }: RefreshReport): ModelSelection => ({ agent, suggestions, source, checkedAt })

const SELECTION_KEY = 'ai:models:selection'
const BAD_KEY = 'ai:models:bad'
/** Instances re-read the shared selection this often, so a failover elsewhere reaches them quickly. */
const LOCAL_TTL_MS = 5 * 60_000
/** Keep the last selection long after it's stale, as a fallback when the catalog can't be reached. */
const STALE_KEEP_SECONDS = 7 * 24 * 3600

export function modelResolver({ catalog, store, log, pinned = {}, prefer = [], refreshHours, probeLimit, now = Date.now }: ResolverOptions): ModelResolver {
  const matchers = preferenceMatchers(prefer)
  const refreshMs = refreshHours * 3600_000
  let local: { selection: ModelSelection; at: number } | undefined
  let inflight: Promise<RefreshReport> | undefined

  const fresh = (selection: ModelSelection) => now() - Date.parse(selection.checkedAt) < refreshMs

  async function badModels(): Promise<Record<string, number>> {
    const bad = (await store.get<Record<string, number>>(BAD_KEY)) ?? {}
    return Object.fromEntries(Object.entries(bad).filter(([, until]) => until > now()))
  }

  async function discover(): Promise<RefreshReport> {
    const checkedAt = new Date(now()).toISOString()
    if (pinned.agent && pinned.suggestions) {
      return { agent: pinned.agent, suggestions: pinned.suggestions, source: { agent: 'pinned', suggestions: 'pinned' }, checkedAt, probes: [], candidates: 0 }
    }

    const models = await catalog.list()
    const ids = new Set(models.map((model) => model.id))
    for (const id of [pinned.agent, pinned.suggestions]) {
      if (id && !ids.has(id)) log.warn('ai_model_pin_missing', { model: id })
    }
    const bad = await badModels()
    const probes: ProbeResult[] = []

    async function firstPassing(role: 'agent' | 'suggestions', skip?: string) {
      const candidates = rankCandidates(models, role, matchers).filter((model) => !bad[model.id] && model.id !== skip)
      for (const { id } of candidates.slice(0, probeLimit)) {
        const result = role === 'agent' ? await catalog.probeTools(id) : await catalog.probeChat(id)
        probes.push(result)
        if (result.ok) return id
      }
      return undefined
    }

    const agent = pinned.agent ?? (await firstPassing('agent'))
    if (!agent) {
      log.error('ai_models_none', { candidates: models.length, probes: probes.length })
      throw new NoModelAvailableError(`no tool-capable model among ${probes.length} probed of ${models.length} listed`)
    }
    const discoveredSuggestions = pinned.suggestions ? undefined : await firstPassing('suggestions', agent)
    const suggestions = pinned.suggestions ?? discoveredSuggestions ?? agent

    return {
      agent,
      suggestions,
      source: {
        agent: pinned.agent ? 'pinned' : 'discovered',
        suggestions: pinned.suggestions ? 'pinned' : discoveredSuggestions ? 'discovered' : 'agent',
      },
      checkedAt,
      probes,
      candidates: models.length,
    }
  }

  function refresh(): Promise<RefreshReport> {
    inflight ??= (async () => {
      try {
        const report = await discover()
        const selection = toSelection(report)
        await store.set(SELECTION_KEY, selection, STALE_KEEP_SECONDS)
        local = { selection, at: now() }
        log.info('ai_models_selected', {
          agent: selection.agent,
          suggestions: selection.suggestions,
          agentSource: selection.source.agent,
          suggestionsSource: selection.source.suggestions,
          probes: report.probes.length,
          failedProbes: report.probes.filter((probe) => !probe.ok).length,
        })
        return report
      } finally {
        inflight = undefined
      }
    })()
    return inflight
  }

  return {
    refresh,

    async current() {
      if (local && fresh(local.selection) && now() - local.at < LOCAL_TTL_MS) return local.selection
      const stored = await store.get<ModelSelection>(SELECTION_KEY)
      if (stored && fresh(stored)) {
        local = { selection: stored, at: now() }
        return stored
      }
      try {
        return toSelection(await refresh())
      } catch (error) {
        // Keep answering with the last good models while the catalog is unreachable or nothing passes.
        if (stored) {
          log.warn('ai_models_stale', { error: (error as Error).name, checkedAt: stored.checkedAt })
          local = { selection: stored, at: now() }
          return stored
        }
        throw error
      }
    },

    async reportFailure(model, reason) {
      if (model === pinned.agent || model === pinned.suggestions) {
        log.error('ai_model_pin_failed', { model, reason })
        return
      }
      const bad = await badModels()
      bad[model] = now() + refreshMs
      await store.set(BAD_KEY, bad, refreshHours * 3600)
      const stored = await store.get<ModelSelection>(SELECTION_KEY)
      if (stored && (stored.agent === model || stored.suggestions === model)) await store.delete(SELECTION_KEY)
      local = undefined
      log.warn('ai_model_failed', { model, reason })
    },
  }
}
