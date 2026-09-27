import type { Step } from './model.ts'

// Which site components a turn's tool results call for (AskResult.tsx).

export interface Shown {
  projects: string[]
  roles: string[]
  programme: boolean
}

const slugsOf = (value: unknown): string[] => {
  if (!value || typeof value !== 'object') return []
  const result = value as { projects?: { slug?: unknown }[]; project?: { slug?: unknown } }
  const list = result.projects ?? (result.project ? [result.project] : [])
  return list.map((p) => p.slug).filter((slug): slug is string => typeof slug === 'string')
}

export function resultsOf(steps: readonly Step[]): Shown {
  const shown: Shown = { projects: [], roles: [], programme: false }
  for (const step of steps) {
    if (step.status !== 'done') continue
    if (step.tool === 'list_projects' || step.tool === 'get_project') shown.projects.push(...slugsOf(step.result))
    if (step.tool === 'get_experience') {
      const ids = ((step.result as { roles?: { id?: unknown }[] } | undefined)?.roles ?? []).map((r) => r.id).filter((id): id is string => typeof id === 'string')
      if (ids.length === 1) shown.roles.push(ids[0]!)
      else if (ids.length > 1) shown.programme = true
    }
  }
  return { projects: [...new Set(shown.projects)], roles: [...new Set(shown.roles)], programme: shown.programme }
}

