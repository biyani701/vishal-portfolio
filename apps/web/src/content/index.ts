import { credentials } from '@content/credentials.ts'
import { milestonesOf } from '@content/derive.ts'
import { profile } from '@content/profile.ts'
import { organisations, roles } from '@content/roles.ts'
import type { MarkdownModule, ProjectMeta } from '@content/schema.ts'
import { skills } from '@content/skills.ts'

// The site's view of content/ (validated at build time by scripts/content). Listings import only each
// Markdown file's `meta`, so case-study bodies stay out of the pages that list them; loadProject fetches a
// body on demand.

export { credentials, organisations, profile, roles, skills }
export const milestones = milestonesOf(credentials)

const byKey = <T>(modules: Record<string, T>) => Object.values(modules)

export const projects: ProjectMeta[] = byKey(
  import.meta.glob<ProjectMeta>('/content/projects/*.md', { eager: true, import: 'meta' }),
).sort((a, b) => (a.featured ?? 99) - (b.featured ?? 99) || b.year - a.year || a.slug.localeCompare(b.slug))

/** Home's selected work, in order. */
export const featuredProjects = projects.filter((project) => project.featured)
/** Home's highlighted projects: the separately hosted ones, in their `highlighted` order. */
export const highlightedProjects = projects
  .filter((project) => project.highlighted)
  .sort((a, b) => (a.highlighted ?? 0) - (b.highlighted ?? 0))

const projectBodies = import.meta.glob<MarkdownModule<ProjectMeta>>('/content/projects/*.md')

/** Undefined when there's no such record (the caller renders the 404). */
export const loadProject = (slug: string) => projectBodies[`/content/projects/${slug}.md`]?.()
