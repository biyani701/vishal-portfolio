import type { SearchEntry, SearchGroup, SearchIndex } from '@content/schema.ts'

// Search over /search-index.json (built by scripts/content). The index is fetched once, when the palette
// first opens, so it never weighs on the first page load.

let pending: Promise<SearchEntry[]> | undefined

export function loadSearchIndex(): Promise<SearchEntry[]> {
  pending ??= fetch('/search-index.json')
    .then((response) => {
      if (!response.ok) throw new Error(`search-index.json: HTTP ${response.status}`)
      return response.json() as Promise<SearchIndex>
    })
    .then((index) => index.entries)
    .catch((error: unknown) => {
      pending = undefined // let the next open retry
      throw error
    })
  return pending
}

/** Palette groups in display order. */
export const GROUPS: { group: SearchGroup; label: string }[] = [
  { group: 'page', label: 'Pages' },
  { group: 'role', label: 'Experience' },
  { group: 'project', label: 'Work' },
]

const PER_GROUP = 5

function score(entry: SearchEntry, words: string[]): number {
  const title = entry.title.toLowerCase()
  const summary = entry.summary.toLowerCase()
  let total = 0
  for (const word of words) {
    if (title === word) total += 100
    else if (title.startsWith(word)) total += 60
    else if (title.includes(word)) total += 40
    else if (entry.keywords.some((keyword) => keyword.startsWith(word))) total += 20
    else if (summary.includes(word)) total += 10
    else return 0 // every word must match somewhere
  }
  return total
}

export type ResultGroup = {
  value: SearchGroup | 'ask'
  label: string
  items: SearchEntry[]
}

/**
 * Matches every word of the query against titles, keywords and summaries, best first, at most five per
 * group. A non-empty query always ends with the "Ask: {query}" option (specs/site-navigation).
 */
export function searchEntries(entries: SearchEntry[], query: string): ResultGroup[] {
  const q = query.trim()
  const words = q.toLowerCase().split(/\s+/).filter(Boolean)
  const groups: ResultGroup[] = []

  if (words.length) {
    const ranked = entries
      .map((entry) => ({ entry, score: score(entry, words) }))
      .filter((match) => match.score > 0)
      .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    for (const { group, label } of GROUPS) {
      const items = ranked.filter((match) => match.entry.group === group).slice(0, PER_GROUP).map((match) => match.entry)
      if (items.length) groups.push({ value: group, label, items })
    }
  } else {
    // Before typing: the pages, as a map of the site.
    groups.push({ value: 'page', label: 'Pages', items: entries.filter((entry) => entry.group === 'page') })
  }

  if (q) groups.push({ value: 'ask', label: 'Ask', items: [askEntry(q)] })
  return groups
}

export function askEntry(query: string): SearchEntry {
  return {
    id: 'ask',
    group: 'page',
    title: `Ask: ${query}`,
    summary: 'Answers come only from this site and name their sources.',
    url: `/ask?${new URLSearchParams({ q: query })}`,
    keywords: [],
  }
}
