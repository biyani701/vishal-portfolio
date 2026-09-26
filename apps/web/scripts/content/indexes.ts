import { milestonesOf, periodLabel, roleDates, roleStatus } from '../../content/derive.ts'
import type { SearchEntry, SearchIndex } from '../../content/schema.ts'
import type { Content } from './load.ts'

// Build artefacts (design.md "System architecture"): /search-index.json feeds the ⌘K palette, and
// /ai-context.json is the only corpus Ask's tools read. Both are built from the published records only, in a
// fixed order and without timestamps, so the same content always produces byte-identical files.

const PAGES: [path: string, title: string, summary: string][] = [
  ['/', 'Home', 'Who Vishal is, the Programme Line and selected work'],
  ['/work', 'Work', 'All projects, filterable by domain and stack'],
  ['/experience', 'Experience', 'Roles, engagements, skills over time and credentials'],
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
  }
}

export type AiContext = ReturnType<typeof buildAiContext>
