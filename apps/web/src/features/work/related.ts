import type { ProjectMeta, Role } from '@content/schema.ts'

// The case-study aside's related items (specs/content-pages "Work"): other projects ranked by shared domains,
// then shared stack, and the roles the project was built in.

/** Up to `limit` other projects with something in common, closest first; newer first on a tie. */
export function relatedProjects(project: ProjectMeta, all: readonly ProjectMeta[], limit = 3): ProjectMeta[] {
  const shared = <T>(a: readonly T[], b: readonly T[]) => a.filter((item) => b.includes(item)).length
  return all
    .filter((other) => other.slug !== project.slug)
    .map((other) => ({ other, score: shared(other.domains, project.domains) * 100 + shared(other.stack, project.stack) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.other.year - a.other.year || a.other.slug.localeCompare(b.other.slug))
    .slice(0, limit)
    .map(({ other }) => other)
}

export const rolesForProject = (slug: string, roles: readonly Role[]) => roles.filter((role) => role.projects.includes(slug))
