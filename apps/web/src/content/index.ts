import { credentials } from '@content/credentials.ts'
import { milestonesOf } from '@content/derive.ts'
import { glossary } from '@content/glossary.ts'
import { domains } from '@content/knowledge/domains.ts'
import { profile } from '@content/profile.ts'
import { organisations, roles } from '@content/roles.ts'
import type { ArticleMeta, MarkdownModule, ProjectMeta, TopicMeta } from '@content/schema.ts'
import { skills } from '@content/skills.ts'

// The site's view of content/ (validated at build time by scripts/content). Listings import only each
// Markdown file's `meta`, so article and case-study bodies stay out of the pages that list them; the
// load* functions fetch a body on demand.

export { credentials, domains, glossary, organisations, profile, roles, skills }
export const milestones = milestonesOf(credentials)

const byKey = <T>(modules: Record<string, T>) => Object.values(modules)

export const projects: ProjectMeta[] = byKey(
  import.meta.glob<ProjectMeta>('/content/projects/*.md', { eager: true, import: 'meta' }),
).sort((a, b) => (a.featured ?? 99) - (b.featured ?? 99) || b.year - a.year || a.slug.localeCompare(b.slug))

/** Home's selected work, in order. */
export const featuredProjects = projects.filter((project) => project.featured)

export const articles: ArticleMeta[] = byKey(
  import.meta.glob<ArticleMeta>('/content/writing/*.md', { eager: true, import: 'meta' }),
).sort((a, b) => b.date.localeCompare(a.date))

export const topics: TopicMeta[] = byKey(
  import.meta.glob<TopicMeta>('/content/knowledge/*/*.md', { eager: true, import: 'meta' }),
).sort(
  (a, b) => domains.findIndex((d) => d.id === a.domain) - domains.findIndex((d) => d.id === b.domain) || a.order - b.order,
)

const projectBodies = import.meta.glob<MarkdownModule<ProjectMeta>>('/content/projects/*.md')
const articleBodies = import.meta.glob<MarkdownModule<ArticleMeta>>('/content/writing/*.md')
const topicBodies = import.meta.glob<MarkdownModule<TopicMeta>>('/content/knowledge/*/*.md')

/** Undefined when there's no such record (the caller renders the 404). */
export const loadProject = (slug: string) => projectBodies[`/content/projects/${slug}.md`]?.()
export const loadArticle = (slug: string) => articleBodies[`/content/writing/${slug}.md`]?.()
export const loadTopic = (domain: string, slug: string) => topicBodies[`/content/knowledge/${domain}/${slug}.md`]?.()

/** The canonical slug for an old /blogs/:id identifier, if it was an article. */
export const articleForAlias = (alias: string) => articles.find((article) => article.aliases.includes(alias))
