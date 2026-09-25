import { readdirSync, readFileSync } from 'node:fs'
import { basename, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseYaml } from 'yaml'
import type { z } from 'zod'
import { credentials } from '../../content/credentials.ts'
import { glossary } from '../../content/glossary.ts'
import { domains } from '../../content/knowledge/domains.ts'
import { profile } from '../../content/profile.ts'
import { organisations, roles } from '../../content/roles.ts'
import {
  credentialsSchema,
  domainSchema,
  glossaryTermSchema,
  markdownCollections,
  organisationSchema,
  profileSchema,
  roleSchema,
  skillSchema,
  type ArticleMeta,
  type Credentials,
  type Domain,
  type GlossaryTerm,
  type Organisation,
  type Profile,
  type ProjectMeta,
  type Role,
  type Skill,
  type TopicMeta,
} from '../../content/schema.ts'
import { skills } from '../../content/skills.ts'
import { renderMarkdown, type RenderedMarkdown } from './markdown.ts'

// Loads and validates everything under content/ (specs/content-pages "Content layer"). Every failure is a
// ContentError whose message names the file and the field, e.g. "content/projects/x.md: year: Required".

export const CONTENT_DIR = fileURLToPath(new URL('../../content', import.meta.url))

export class ContentError extends Error {
  override name = 'ContentError'
}

const posix = (path: string) => path.split(sep).join('/')

/** "content/roles.ts: [1].start: use YYYY-MM" for each zod issue. */
function issues(file: string, error: z.ZodError) {
  return error.issues
    .map((issue) => {
      const path = issue.path.map((key) => (typeof key === 'number' ? `[${key}]` : `.${String(key)}`)).join('')
      return `${file}: ${path.replace(/^\./, '') || '(root)'}: ${issue.message}`
    })
    .join('\n')
}

function validate<S extends z.ZodType>(file: string, schema: S, value: unknown): z.infer<S> {
  const result = schema.safeParse(value)
  if (!result.success) throw new ContentError(issues(file, result.error))
  return result.data
}

type Collection = keyof typeof markdownCollections
type MetaOf<C extends Collection> = z.infer<(typeof markdownCollections)[C]>

export interface LoadedMarkdown<Meta> extends RenderedMarkdown {
  meta: Meta
  file: string
  /** The Markdown body, for ai-context.json. Not sent to the page. */
  body: string
}

/** The collection a content file belongs to, from its folder: content/projects/x.md → "projects". */
export function collectionOf(file: string): Collection | undefined {
  const [root, folder] = posix(file).split('/')
  return root === 'content' && folder && folder in markdownCollections ? (folder as Collection) : undefined
}

function splitFrontmatter(file: string, source: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source)
  if (!match) throw new ContentError(`${file}: frontmatter: missing (the file must start with a --- block)`)
  try {
    return { data: parseYaml(match[1]!) as unknown, body: match[2]! }
  } catch (error) {
    throw new ContentError(`${file}: frontmatter: ${(error as Error).message}`)
  }
}

/**
 * Validates and renders one Markdown file. `file` is its path from the app root (content/projects/x.md); the
 * slug must match the file name, and a knowledge topic's domain must match its folder.
 */
export async function loadMarkdown<C extends Collection>(file: string, source: string): Promise<LoadedMarkdown<MetaOf<C>>> {
  file = posix(file)
  const collection = collectionOf(file)
  if (!collection) throw new ContentError(`${file}: not in a Markdown collection (${Object.keys(markdownCollections).join(', ')})`)

  const { data, body } = splitFrontmatter(file, source)
  const meta = validate(file, markdownCollections[collection], data) as MetaOf<C>
  const name = basename(file, '.md')
  if (meta.slug !== name) throw new ContentError(`${file}: slug: "${meta.slug}" must match the file name "${name}"`)
  if (collection === 'knowledge') {
    const folder = file.split('/')[2]
    const { domain } = meta as TopicMeta
    if (domain !== folder) throw new ContentError(`${file}: domain: "${domain}" must match the folder "${folder}"`)
  }
  return { meta, file, body, ...(await renderMarkdown(body)) }
}

function markdownFiles(collection: Collection) {
  const dir = join(CONTENT_DIR, collection)
  return (readdirSync(dir, { recursive: true }) as string[])
    .filter((name) => name.endsWith('.md'))
    .map((name) => join(dir, name))
    .sort()
}

async function loadCollection<C extends Collection>(collection: C) {
  return Promise.all(
    markdownFiles(collection).map((path) =>
      loadMarkdown<C>(posix(join('content', relative(CONTENT_DIR, path))), readFileSync(path, 'utf8')),
    ),
  )
}

export interface Content {
  profile: Profile
  organisations: Organisation[]
  roles: Role[]
  skills: Skill[]
  credentials: Credentials
  projects: LoadedMarkdown<ProjectMeta>[]
  writing: LoadedMarkdown<ArticleMeta>[]
  domains: Domain[]
  topics: LoadedMarkdown<TopicMeta>[]
  glossary: GlossaryTerm[]
}

export interface Collections {
  profile: unknown
  organisations: unknown
  roles: unknown
  skills: unknown
  credentials: unknown
  domains: unknown
  glossary: unknown
}

/** Validates the TypeScript collections, naming the file and field of each problem. */
export function validateCollections(input: Collections) {
  const list = <S extends z.ZodType>(schema: S) => schema.array()
  return {
    profile: validate('content/profile.ts', profileSchema, input.profile),
    organisations: validate('content/roles.ts', list(organisationSchema), input.organisations),
    roles: validate('content/roles.ts', list(roleSchema), input.roles),
    skills: validate('content/skills.ts', list(skillSchema), input.skills),
    credentials: validate('content/credentials.ts', credentialsSchema, input.credentials),
    domains: validate('content/knowledge/domains.ts', list(domainSchema), input.domains),
    glossary: validate('content/glossary.ts', list(glossaryTermSchema), input.glossary),
  }
}

function unique(file: string, field: string, values: string[]) {
  const seen = new Set<string>()
  for (const value of values) {
    if (seen.has(value)) throw new ContentError(`${file}: ${field}: "${value}" is used more than once`)
    seen.add(value)
  }
}

/** Checks that records point at records that exist. */
export function checkReferences(content: Content) {
  const orgs = new Set(content.organisations.map((org) => org.id))
  const projects = new Set(content.projects.map((project) => project.meta.slug))
  const domainIds = new Set(content.domains.map((domain) => domain.id))

  unique('content/roles.ts', 'id', content.roles.map((role) => role.id))
  content.roles.forEach((role, i) => {
    if (!orgs.has(role.org)) throw new ContentError(`content/roles.ts: [${i}].org: no organisation "${role.org}"`)
    for (const slug of role.projects) {
      if (!projects.has(slug)) throw new ContentError(`content/roles.ts: [${i}].projects: no project "${slug}"`)
    }
    if (role.end && role.end < role.start) throw new ContentError(`content/roles.ts: [${i}].end: before start`)
  })
  unique('content/glossary.ts', 'id', content.glossary.map((term) => term.id))
  unique('content/writing', 'aliases', content.writing.flatMap((article) => article.meta.aliases))
  for (const topic of content.topics) {
    if (!domainIds.has(topic.meta.domain)) throw new ContentError(`${topic.file}: domain: no domain "${topic.meta.domain}"`)
  }
  const featured = content.projects.flatMap((project) => (project.meta.featured ? [project.meta.featured] : []))
  unique('content/projects', 'featured', featured.map(String))
}

/** Loads, validates and cross-checks all content, in a stable order. */
export async function loadContent(collections: Collections = { profile, organisations, roles, skills, credentials, domains, glossary }): Promise<Content> {
  const validated = validateCollections(collections)
  const [projects, writing, topics] = await Promise.all([
    loadCollection('projects'),
    loadCollection('writing'),
    loadCollection('knowledge'),
  ])
  const domainOrder = validated.domains.map((domain) => domain.id)
  const content: Content = {
    ...validated,
    projects: projects.sort(
      (a, b) =>
        (a.meta.featured ?? 99) - (b.meta.featured ?? 99) || b.meta.year - a.meta.year || a.meta.slug.localeCompare(b.meta.slug),
    ),
    writing: writing.sort((a, b) => b.meta.date.localeCompare(a.meta.date) || a.meta.slug.localeCompare(b.meta.slug)),
    topics: topics.sort(
      (a, b) => domainOrder.indexOf(a.meta.domain) - domainOrder.indexOf(b.meta.domain) || a.meta.order - b.meta.order,
    ),
  }
  checkReferences(content)
  return content
}
