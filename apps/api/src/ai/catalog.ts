import type { CatalogModel } from './rank.js'

// The provider's catalog over its OpenAI-compatible API (design.md A5): the model list, and two small probes that
// check what the list can't tell us: whether a model is available to this key right now, answers, and (for the
// agent) makes tool calls. Probe prompts and replies are never logged, only outcomes and timings.

export interface ProbeResult {
  model: string
  ok: boolean
  ms: number
  /** Why a probe failed, e.g. "http_404", "timeout", "no_tool_call". */
  reason?: string
}

export interface Catalog {
  list(): Promise<CatalogModel[]>
  /** Asks the model to call a `ping` tool; ok only if it does. */
  probeTools(model: string): Promise<ProbeResult>
  /** Asks for a one-word reply; ok if any text comes back. */
  probeChat(model: string): Promise<ProbeResult>
}

export interface CatalogOptions {
  baseUrl: string
  apiKey: string
  /** Longest acceptable probe; slower models count as failing (they'd make Ask feel broken). */
  probeTimeoutMs?: number
  fetch?: typeof fetch
}

export class CatalogError extends Error {
  override name = 'CatalogError'
}

interface ChatResponse {
  choices?: { message?: { content?: string | null; tool_calls?: { function?: { name?: string } }[] } }[]
}

export function openAiCatalog({ baseUrl, apiKey, probeTimeoutMs = 15_000, fetch: fetcher = globalThis.fetch }: CatalogOptions): Catalog {
  const root = baseUrl.replace(/\/+$/, '')
  const headers = { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', Accept: 'application/json' }

  async function chat(model: string, body: Record<string, unknown>): Promise<{ ms: number; status: number; json?: ChatResponse; reason?: string }> {
    const started = performance.now()
    try {
      const res = await fetcher(`${root}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ model, temperature: 0, max_tokens: 64, stream: false, ...body }),
        signal: AbortSignal.timeout(probeTimeoutMs),
      })
      const ms = Math.round(performance.now() - started)
      if (!res.ok) return { ms, status: res.status, reason: `http_${res.status}` }
      return { ms, status: res.status, json: (await res.json()) as ChatResponse }
    } catch (error) {
      const ms = Math.round(performance.now() - started)
      const name = (error as Error).name
      return { ms, status: 0, reason: name === 'TimeoutError' || name === 'AbortError' ? 'timeout' : 'network' }
    }
  }

  return {
    async list() {
      let res: Response
      try {
        res = await fetcher(`${root}/models`, { headers, signal: AbortSignal.timeout(probeTimeoutMs) })
      } catch (error) {
        throw new CatalogError(`model list unavailable (${(error as Error).name})`)
      }
      if (!res.ok) throw new CatalogError(`model list unavailable (http_${res.status})`)
      const body = (await res.json()) as { data?: { id?: unknown; created?: unknown }[] }
      return (body.data ?? [])
        .filter((entry): entry is { id: string; created?: unknown } => typeof entry.id === 'string' && entry.id.length > 0)
        .map((entry) => ({ id: entry.id, ...(typeof entry.created === 'number' && { created: entry.created }) }))
    },

    async probeTools(model) {
      const { ms, json, reason } = await chat(model, {
        messages: [{ role: 'user', content: 'Call the ping tool now. Do not reply with text.' }],
        tools: [
          {
            type: 'function',
            function: { name: 'ping', description: 'Checks that tool calling works.', parameters: { type: 'object', properties: {} } },
          },
        ],
        tool_choice: 'auto',
      })
      if (reason) return { model, ok: false, ms, reason }
      const called = json?.choices?.[0]?.message?.tool_calls?.some((call) => call.function?.name === 'ping')
      return called ? { model, ok: true, ms } : { model, ok: false, ms, reason: 'no_tool_call' }
    },

    async probeChat(model) {
      const { ms, json, reason } = await chat(model, { messages: [{ role: 'user', content: 'Reply with the single word: ok' }] })
      if (reason) return { model, ok: false, ms, reason }
      const text = json?.choices?.[0]?.message?.content
      return typeof text === 'string' && text.trim() ? { model, ok: true, ms } : { model, ok: false, ms, reason: 'empty_reply' }
    },
  }
}
