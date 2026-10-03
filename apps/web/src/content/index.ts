import { about } from '@content/about.ts'
import { credentials } from '@content/credentials.ts'
import { legal } from '@content/legal.ts'
import { byListingOrder, careerYears as yearsOf, milestonesOf } from '@content/derive.ts'
import { profile } from '@content/profile.ts'
import { projectDomains } from '@content/project-domains.ts'
import { organisations, roles } from '@content/roles.ts'
import type { MarkdownModule, ProjectMeta } from '@content/schema.ts'
import { skills } from '@content/skills.ts'

// The site's view of content/ (validated at build time by scripts/content). Listings import only each
// Markdown file's `meta`, so case-study bodies stay out of the pages that list them; loadProject fetches a
// body on demand.

export { about, credentials, legal, organisations, profile, projectDomains, roles, skills }
export const milestones = milestonesOf(credentials)
/** Years in financial-services technology, from the first role (specs/portfolio-narrative "Positioning"). */
export const careerYears = yearsOf(roles)

const byKey = <T>(modules: Record<string, T>) => Object.values(modules)

export const projects: ProjectMeta[] = byKey(
  import.meta.glob<ProjectMeta>('/content/projects/*.md', { eager: true, import: 'meta' }),
).sort(byListingOrder)

/** Home's "Programmes I've led" and "Delivery tools" (specs/portfolio-narrative "Home story order"), in order. */
export const featuredProgrammes = projects.filter((project) => project.kind === 'programme' && project.featured)
export const featuredTools = projects.filter((project) => project.kind === 'tool' && project.featured)

const projectBodies = import.meta.glob<MarkdownModule<ProjectMeta>>('/content/projects/*.md')

/** Undefined when there's no such record (the caller renders the 404). */
export const loadProject = (slug: string) => projectBodies[`/content/projects/${slug}.md`]?.()
