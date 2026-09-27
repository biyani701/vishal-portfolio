import { roleDates } from '@content/derive.ts'
import { organisations, projects, roles } from '@/content/index.ts'
import type { AskContext } from './model.ts'
import type { AskStore } from './store.ts'
import type { Role } from '@content/schema.ts'

// Ask's entry contract (specs/ask-experience "Entry points"): every entry point is an /ask URL.
// - q: a question to send now (the Home input, the palette's "Ask: …")
// - prefill: a question to put in the composer (Home's starters)
// - about: the page Ask was opened from ("Ask about this"); it becomes context and a suggested question

export interface AskRequest {
  q?: string
  prefill?: string
  about?: string
}

export const askHref = (request: AskRequest = {}) => {
  const params = new URLSearchParams(Object.entries(request).filter((entry): entry is [string, string] => Boolean(entry[1])))
  return params.toString() ? `/ask?${params}` : '/ask'
}

export function parseAskHref(href: string): AskRequest {
  const url = new URL(href, 'https://site.invalid')
  const get = (key: string) => url.searchParams.get(key)?.trim().slice(0, 1000) || undefined
  return { q: get('q'), prefill: get('prefill'), about: get('about') }
}

export const hasRequest = (request: AskRequest) => Boolean(request.q || request.prefill || request.about)

/** The page an "Ask about this" link came from, as context for the agent and a question to suggest. */
export function resolveAbout(about: string | undefined): { context: AskContext; question: string } | undefined {
  if (!about) return undefined
  const project = /^\/work\/([a-z0-9-]+)$/.exec(about)
  if (project) {
    const meta = projects.find((p) => p.slug === project[1])
    if (!meta) return undefined
    return {
      context: { url: about, title: meta.title, description: `Case study. ${meta.summary} Stack: ${meta.stack.join(', ')}.` },
      question: `What problem does ${meta.title} solve, and how was it built?`,
    }
  }
  const role = /^\/experience#([a-z0-9-]+)$/.exec(about)
  if (role) {
    const found = (roles as readonly Role[]).find((r) => r.id === role[1])
    const org = found && organisations.find((o) => o.id === found.org)
    if (!found || !org) return undefined
    const title = `${found.title} at ${org.name}`
    return {
      context: { url: about, title, description: `Role, ${roleDates(found)}${found.client ? `, for ${found.client}` : ''}.` },
      question: `What did Vishal achieve as ${title}?`,
    }
  }
  return undefined
}

/** Acts on an entry request: send the question, or fill the composer (with page context for "Ask about this"). */
export function applyRequest(store: AskStore, request: AskRequest) {
  const about = resolveAbout(request.about)
  if (request.q) void store.ask(request.q, about?.context)
  else if (request.prefill) store.prefill(request.prefill, about?.context)
  else if (about) store.prefill(about.question, about.context)
}
