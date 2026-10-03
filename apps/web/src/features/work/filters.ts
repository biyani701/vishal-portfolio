import type { ProjectMeta } from '@content/schema.ts'

// /work filters (specs/content-pages "Work"; specs/portfolio-narrative "Project kinds on Work"): one kind, one domain
// and one stack at a time, all in the URL (?kind=programme&domain=apis&stack=python), so a filtered list can be
// linked to. Values that match nothing are ignored.

export interface WorkFilters {
  kind?: string
  domain?: string
  stack?: string
}

export interface FilterOption {
  value: string
  label: string
  count: number
}

/** "Strawberry GraphQL" → "strawberry-graphql", "Next.js" → "next-js". */
export const stackSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const KIND_LABELS: Record<ProjectMeta['kind'], string> = { programme: 'Programmes', tool: 'Tools' }

/** The kinds in use, programmes first, with how many projects are of each. */
export function kindOptions(projects: readonly ProjectMeta[]): FilterOption[] {
  return (Object.entries(KIND_LABELS) as [ProjectMeta['kind'], string][])
    .map(([value, label]) => ({ value, label, count: projects.filter((p) => p.kind === value).length }))
    .filter((option) => option.count > 0)
}

/** The domains in use, in the order of `labels`, with how many projects carry each. */
export function domainOptions(projects: readonly ProjectMeta[], labels: Readonly<Record<string, string>>): FilterOption[] {
  return Object.entries(labels)
    .map(([value, label]) => ({ value, label, count: projects.filter((p) => p.domains.includes(value)).length }))
    .filter((option) => option.count > 0)
}

/** Every stack item in use, alphabetically. */
export function stackOptions(projects: readonly ProjectMeta[]): FilterOption[] {
  const counts = new Map<string, FilterOption>()
  for (const name of projects.flatMap((p) => p.stack)) {
    const value = stackSlug(name)
    const option = counts.get(value) ?? { value, label: name, count: 0 }
    option.count += 1
    counts.set(value, option)
  }
  return [...counts.values()].sort((a, b) => a.label.localeCompare(b.label, 'en', { sensitivity: 'base' }))
}

/** Reads the filters from the query string, dropping any value that isn't one of the options. */
export function readFilters(
  params: URLSearchParams,
  domains: readonly FilterOption[],
  stacks: readonly FilterOption[],
  kinds: readonly FilterOption[] = [],
): WorkFilters {
  const known = (options: readonly FilterOption[], value: string | null) =>
    value && options.some((option) => option.value === value) ? value : undefined
  return { kind: known(kinds, params.get('kind')), domain: known(domains, params.get('domain')), stack: known(stacks, params.get('stack')) }
}

/** The query string for `filters`, keeping any other parameters. */
export function writeFilters(params: URLSearchParams, filters: WorkFilters): URLSearchParams {
  const next = new URLSearchParams(params)
  for (const key of ['kind', 'domain', 'stack'] as const) {
    const value = filters[key]
    if (value) next.set(key, value)
    else next.delete(key)
  }
  return next
}

export function filterProjects(projects: readonly ProjectMeta[], { kind, domain, stack }: WorkFilters): ProjectMeta[] {
  return projects.filter(
    (project) =>
      (!kind || project.kind === kind) &&
      (!domain || project.domains.includes(domain)) &&
      (!stack || project.stack.some((name) => stackSlug(name) === stack)),
  )
}
