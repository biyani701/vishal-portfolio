import { milestonesOf, periodLabel, roleDates, roleStatus } from '../../content/derive.ts'
import type { Content } from './load.ts'

// Build artefacts (design.md "System architecture"): /search-index.json feeds the ⌘K palette, and
// /ai-context.json is the only corpus Ask's tools read. Both are built from the published records only, in a
// fixed order and without timestamps, so the same content always produces byte-identical files.

export type SearchGroup = 'page' | 'role' | 'project' | 'article' | 'topic' | 'term'

export interface SearchEntry {
  id: string
  group: SearchGroup
  title: string
  /** Secondary line, e.g. a term's full form or a project's summary. */
  summary: string
  url: string
  keywords: string[]
}

export interface SearchIndex {
  version: 1
  entries: SearchEntry[]
}

const PAGES: [path: string, title: string, summary: string][] = [
  ['/', 'Home', 'Who Vishal is, the Programme Line and selected work'],
  ['/work', 'Work', 'All projects, filterable by domain and stack'],
  ['/experience', 'Experience', 'Roles, engagements, skills over time and credentials'],
  ['/writing', 'Writing', 'Articles'],
  ['/knowledge', 'Knowledge', 'Domain knowledge: payments, reference data, capital markets'],
  ['/knowledge/glossary', 'Glossary', 'Payments and financial-services terms'],
  ['/about', 'About', 'Story, principles and credentials'],
  ['/ask', 'Ask', 'Ask a question about this portfolio'],
  ['/contact', 'Contact', 'Send a message'],
  ['/colophon', 'Colophon', 'How this site is built'],
  ['/legal/privacy', 'Privacy policy', 'Cookies, analytics, AI questions and contact messages'],
  ['/legal/terms', 'Terms of use', 'Terms for using this site'],
]

const words = (...parts: (string | undefined)[]) =>
  [...new Set(parts.flatMap((part) => (part ?? '').toLowerCase().split(/[^a-z0-9+#.]+/)).filter((w) => w.length > 1))].sort()

export function buildSearchIndex(content: Content): SearchIndex {
  const entries: SearchEntry[] = [
    ...PAGES.map(([url, title, summary]) => ({ id: `page:${url}`, group: 'page' as const, title, summary, url, keywords: words(title, summary) })),
    ...content.roles.map((role) => ({
      id: `role:${role.id}`,
      group: 'role' as const,
      title: `${role.label} · ${role.title}`,
      summary: roleDates(role),
      url: `/experience#${role.id}`,
      keywords: words(role.label, role.client, role.title, ...role.skills),
    })),
    ...content.projects.map(({ meta }) => ({
      id: `project:${meta.slug}`,
      group: 'project' as const,
      title: meta.title,
      summary: meta.summary,
      url: `/work/${meta.slug}`,
      keywords: words(meta.title, ...meta.stack, ...meta.domains),
    })),
    ...content.writing.map(({ meta }) => ({
      id: `article:${meta.slug}`,
      group: 'article' as const,
      title: meta.title,
      summary: meta.summary,
      url: `/writing/${meta.slug}`,
      keywords: words(meta.title, ...meta.topics),
    })),
    ...content.domains.map((domain) => ({
      id: `topic:${domain.id}`,
      group: 'topic' as const,
      title: domain.name,
      summary: domain.summary,
      url: `/knowledge/${domain.id}`,
      keywords: words(domain.name),
    })),
    ...content.topics.map(({ meta }) => ({
      id: `topic:${meta.domain}/${meta.slug}`,
      group: 'topic' as const,
      title: meta.title,
      summary: meta.summary,
      url: `/knowledge/${meta.domain}/${meta.slug}`,
      keywords: words(meta.title),
    })),
    ...content.glossary.map((term) => ({
      id: `term:${term.id}`,
      group: 'term' as const,
      title: term.term,
      summary: term.fullForm,
      url: `/knowledge/glossary#${term.id}`,
      keywords: words(term.term, term.fullForm, term.category),
    })),
  ]
  return { version: 1, entries }
}

/** The Ask corpus: every published fact, as plain data. The agent never sees anything the site doesn't show. */
export function buildAiContext(content: Content) {
  const { profile } = content
  return {
    version: 1,
    site: 'https://vishal.biyani.xyz',
    profile: {
      name: profile.name,
      positioning: profile.positioning,
      location: profile.location,
      currentRole: profile.currentRole,
      summary: profile.summary,
      proof: profile.proof.map(({ value, label }) => `${value} ${label}`),
      links: profile.links,
    },
    roles: content.roles.map((role) => ({
      id: role.id,
      organisation: content.organisations.find((org) => org.id === role.org)!.name,
      client: role.client,
      title: role.title,
      dates: roleDates(role),
      start: role.start,
      end: role.end ?? null,
      status: roleStatus(role),
      location: role.location,
      outcomes: role.outcomes,
      skills: role.skills,
      url: `/experience#${role.id}`,
    })),
    milestones: milestonesOf(content.credentials).map((m) => ({ ...m, when: periodLabel(m.date) })),
    skills: content.skills,
    education: content.credentials.education,
    projects: content.projects.map(({ meta, body }) => ({ ...meta, url: `/work/${meta.slug}`, body })),
    articles: content.writing.map(({ meta, body }) => ({ ...meta, url: `/writing/${meta.slug}`, body })),
    knowledge: content.domains.map((domain) => ({
      ...domain,
      url: `/knowledge/${domain.id}`,
      topics: content.topics
        .filter((topic) => topic.meta.domain === domain.id)
        .map(({ meta, body }) => ({ ...meta, url: `/knowledge/${meta.domain}/${meta.slug}`, body })),
    })),
    glossary: content.glossary.map((term) => ({ ...term, url: `/knowledge/glossary#${term.id}` })),
  }
}

export type AiContext = ReturnType<typeof buildAiContext>
