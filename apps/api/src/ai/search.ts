import type { AiContext } from './context.js'

// Keyword search over the Ask corpus (design.md A5): tens of records, so an in-memory BM25 index is enough and no
// vector database is needed. Every published record is one document; the index is rebuilt when the corpus changes.

/** The site sections sources are grouped by (specs/ask-experience "Grounding and sources"). */
export type Section = 'Experience' | 'Work' | 'About' | 'Home'

export interface Source {
  section: Section
  title: string
  url: string
}

export interface SearchDoc extends Source {
  kind: 'project' | 'role' | 'milestone' | 'skill' | 'education' | 'profile' | 'about'
  id: string
  /** A short plain-text excerpt shown to the model. */
  snippet: string
  text: string
}

const STOP = new Set('a an and are as at be by for from has have he his i in is it its of on or that the this to was were what which who with you your'.split(' '))

export const tokens = (text: string) =>
  text
    .toLowerCase()
    .split(/[^a-z0-9+#]+/)
    .filter((word) => word.length > 1 && !STOP.has(word))

const clip = (text: string, max = 240) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text)
const plain = (value: unknown): string => (typeof value === 'string' ? value : Array.isArray(value) ? value.map(plain).join(' ') : value && typeof value === 'object' ? Object.values(value).map(plain).join(' ') : '')

export function documents(context: AiContext): SearchDoc[] {
  const { profile } = context
  const docs: SearchDoc[] = [
    {
      kind: 'profile',
      id: 'profile',
      section: 'Home',
      title: profile.name,
      url: '/',
      snippet: clip([profile.positioning, profile.summary].filter(Boolean).join('. ')),
      text: plain([profile.name, profile.positioning, profile.location, profile.currentRole, profile.summary, profile.proof]),
    },
    ...context.roles.map((role) => ({
      kind: 'role' as const,
      id: role.id,
      section: 'Experience' as const,
      title: `${role.title} · ${role.organisation}`,
      url: role.url,
      snippet: clip(`${role.dates}. ${role.outcomes.join(' ')}`),
      text: plain([role.title, role.organisation, role.client, role.location, role.outcomes, role.skills]),
    })),
    ...context.projects.map((project) => ({
      kind: 'project' as const,
      id: project.slug,
      section: 'Work' as const,
      title: project.title,
      url: project.url,
      snippet: clip(project.summary),
      text: plain([project.title, project.summary, project.domains, project.stack, project.outcomes, project.body]),
    })),
    ...context.milestones.map((milestone) => ({
      kind: 'milestone' as const,
      id: milestone.id,
      section: 'Experience' as const,
      title: milestone.title,
      url: '/experience#credentials',
      snippet: clip([`${milestone.title}, ${milestone.when}`, milestone.detail].filter(Boolean).join('. ')),
      text: plain([milestone.title, milestone.kind, milestone.when, milestone.detail]),
    })),
    ...context.education.map((entry) => ({
      kind: 'education' as const,
      id: entry.id,
      section: 'Experience' as const,
      title: `${entry.degree}, ${entry.institution}`,
      url: '/experience#education',
      snippet: `${entry.degree}, ${entry.institution} (${entry.start ?? '?'}–${entry.end ?? '?'})`,
      text: plain([entry.degree, entry.institution]),
    })),
  ]
  // Skills are many and short: one document per group keeps them from crowding out everything else.
  const groups = new Map<string, string[]>()
  for (const skill of context.skills) groups.set(skill.group, [...(groups.get(skill.group) ?? []), skill.name])
  for (const [group, names] of groups) {
    docs.push({ kind: 'skill', id: `skills:${group}`, section: 'Experience', title: `Skills: ${group}`, url: '/experience#skills', snippet: clip(names.join(', ')), text: plain([group, names]) })
  }
  if (context.about) {
    docs.push({ kind: 'about', id: 'about', section: 'About', title: 'About', url: '/about', snippet: clip(plain(context.about)), text: plain(context.about) })
  }
  return docs
}

export interface Hit {
  doc: SearchDoc
  score: number
}

/** BM25 (k1 1.2, b 0.75) with title words counted twice. */
export function searchIndex(docs: SearchDoc[]) {
  const tokenised = docs.map((doc) => [...tokens(doc.title), ...tokens(doc.title), ...tokens(doc.text)])
  const avg = tokenised.reduce((sum, words) => sum + words.length, 0) / Math.max(1, tokenised.length)
  const df = new Map<string, number>()
  for (const words of tokenised) for (const word of new Set(words)) df.set(word, (df.get(word) ?? 0) + 1)
  const counts = tokenised.map((words) => {
    const tf = new Map<string, number>()
    for (const word of words) tf.set(word, (tf.get(word) ?? 0) + 1)
    return tf
  })

  return (query: string, limit = 6): Hit[] => {
    const terms = [...new Set(tokens(query))]
    return docs
      .map((doc, i) => {
        let score = 0
        for (const term of terms) {
          const f = counts[i]!.get(term) ?? 0
          if (!f) continue
          const idf = Math.log(1 + (docs.length - (df.get(term) ?? 0) + 0.5) / ((df.get(term) ?? 0) + 0.5))
          score += (idf * f * 2.2) / (f + 1.2 * (0.25 + (0.75 * tokenised[i]!.length) / avg))
        }
        return { doc, score }
      })
      .filter((hit) => hit.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }
}
