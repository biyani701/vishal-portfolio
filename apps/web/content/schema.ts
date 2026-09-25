import { z } from 'zod'

// The content model (design/exploration/02-information-architecture.md "Content model"). Every portfolio fact
// has one record here; pages, search-index.json and ai-context.json are all built from these records.
// TypeScript collections are type-checked by `tsc -b` and validated by scripts/content at build time; Markdown
// frontmatter is validated when the file is imported. Either way the build fails naming the file and field.

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'use lower-case-kebab')
const text = z.string().trim().min(1)
const url = z.url({ protocol: /^https$/ })
/** A month, `YYYY-MM`. */
export const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'use YYYY-MM')
/** A year, a quarter or a month: `2013`, `2009-Q4` or `2020-09`. Only as precise as the source. */
export const period = z.string().regex(/^\d{4}(?:-Q[1-4]|-(?:0[1-9]|1[0-2]))?$/, 'use YYYY, YYYY-Qn or YYYY-MM')
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'use YYYY-MM-DD')

export const profileSchema = z.object({
  name: text,
  /** Kicker above the hero statement. */
  positioning: text,
  location: text,
  /** Hero statement lines, e.g. "I lead delivery". */
  statement: z.array(text).min(1),
  lede: text,
  /** Short lede for small screens. */
  ledeShort: text,
  currentRole: text,
  summary: text,
  proof: z
    .array(z.object({ value: text, label: text, short: text }))
    .min(1)
    .max(4),
  links: z.object({ linkedin: url, github: url }),
  portrait: z.object({ src: z.string().startsWith('/'), alt: text }),
})

export const organisationSchema = z.object({ id: slug, name: text, short: text })

export const roleSchema = z.object({
  /** Also the /experience anchor, e.g. /experience#bfs-uk. */
  id: slug,
  org: slug,
  /** The client served, for consulting engagements. */
  client: text.optional(),
  /** Short name on the Programme Line, e.g. "BFS UK". */
  label: text,
  title: text,
  /** Extra context after the title, e.g. "8 banks". */
  note: text.optional(),
  start: yearMonth,
  /** Omitted while the role is current. */
  end: yearMonth.optional(),
  /** Pre-Cognizant work, drawn in the `past` colour on the Programme Line (design package §6.5). */
  early: z.boolean().optional(),
  /** Only where the source states it; Cognizant engagements have none. */
  location: text.optional(),
  outcomes: z.array(text),
  skills: z.array(text),
  projects: z.array(slug),
})

export const skillSchema = z.object({
  name: text,
  group: text,
  since: yearMonth,
  until: yearMonth.optional(),
  use: z.enum(['professional', 'personal', 'learning']),
})

export const credentialsSchema = z.object({
  education: z.array(z.object({ id: slug, degree: text, institution: text, start: z.number().int(), end: z.number().int() })),
  certifications: z.array(z.object({ id: slug, title: text, short: text, issuer: text, date: period })),
  recognition: z.array(z.object({ id: slug, title: text, date: period })),
})

export const projectMetaSchema = z.object({
  slug,
  title: text,
  year: z.number().int().min(2000).max(2100),
  type: z.enum(['personal', 'open-source', 'work']),
  /** One line for cards and search. */
  summary: text,
  domains: z.array(slug).min(1),
  stack: z.array(text).min(1),
  /** Measured results only; never invented. Empty is fine. */
  outcomes: z.array(text),
  links: z
    .object({ github: url, docs: url, demo: url, pypi: url, bitbucket: url })
    .partial()
    .strict(),
  /** Boxes left to right for the typographic architecture thumbnail, used when there's no screenshot. */
  architecture: z.array(text).min(2).max(4),
  screenshot: z.string().startsWith('/').optional(),
  /** Position among Home's selected work (1–3); omitted otherwise. */
  featured: z.number().int().min(1).max(3).optional(),
})

export const articleMetaSchema = z.object({
  slug,
  title: text,
  date: isoDate,
  topics: z.array(text).min(1),
  summary: text,
  /** Old /blogs/:id identifiers that redirect here. */
  aliases: z.array(z.string()).default([]),
})

export const domainSchema = z.object({ id: slug, name: text, short: text, summary: text })

export const topicMetaSchema = z.object({
  slug,
  domain: slug,
  title: text,
  summary: text,
  order: z.number().int(),
  /** Interactive step sequence (the 3-D Secure flow). */
  steps: z.array(z.object({ title: text, detail: text })).optional(),
})

export const glossaryTermSchema = z.object({
  id: slug,
  term: text,
  fullForm: text,
  category: z.enum(['General', 'Finance', 'Payments', 'Technology', 'Business']),
  /** Markdown. */
  details: text,
})

export type Profile = z.infer<typeof profileSchema>
export type Organisation = z.infer<typeof organisationSchema>
export type Role = z.infer<typeof roleSchema>
export type Skill = z.infer<typeof skillSchema>
export type Credentials = z.infer<typeof credentialsSchema>
export type ProjectMeta = z.infer<typeof projectMetaSchema>
export type ArticleMeta = z.infer<typeof articleMetaSchema>
export type Domain = z.infer<typeof domainSchema>
export type TopicMeta = z.infer<typeof topicMetaSchema>
export type GlossaryTerm = z.infer<typeof glossaryTermSchema>

/** A heading in a rendered Markdown body, for tables of contents. */
export interface Heading {
  id: string
  text: string
  depth: 2 | 3
}

/** What a content Markdown file exports once scripts/content has validated and rendered it. */
export interface MarkdownModule<Meta> {
  meta: Meta
  html: string
  headings: Heading[]
  /** Plain text of the body, for reading time. */
  words: number
}

/** Which schema validates the frontmatter of each Markdown collection, by folder under content/. */
export const markdownCollections = {
  projects: projectMetaSchema,
  writing: articleMetaSchema,
  knowledge: topicMetaSchema,
} as const

/** /search-index.json, built by scripts/content/indexes.ts for the ⌘K palette. */
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
