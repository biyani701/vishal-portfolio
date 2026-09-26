import type { ProjectMeta } from '@content/schema.ts'
import { describe, expect, it } from 'vitest'
import { domainOptions, filterProjects, readFilters, stackOptions, stackSlug, writeFilters } from './filters.ts'

const project = (slug: string, domains: string[], stack: string[]) =>
  ({ slug, domains, stack }) as Pick<ProjectMeta, 'slug' | 'domains' | 'stack'> as ProjectMeta

const projects = [
  project('api', ['apis', 'web'], ['Python', 'FastAPI']),
  project('dash', ['dashboards'], ['Python', 'Dash']),
  project('site', ['web'], ['Next.js', 'TypeScript']),
]
const labels = { apis: 'APIs', dashboards: 'Dashboards', payments: 'Payments', web: 'Web' }

describe('work filters', () => {
  it('slugs stack names for the URL', () => {
    expect(['Python', 'Strawberry GraphQL', 'Next.js', 'JIRA REST API'].map(stackSlug)).toEqual([
      'python',
      'strawberry-graphql',
      'next-js',
      'jira-rest-api',
    ])
  })

  it('offers only the domains in use, in label order, with counts', () => {
    expect(domainOptions(projects, labels)).toEqual([
      { value: 'apis', label: 'APIs', count: 1 },
      { value: 'dashboards', label: 'Dashboards', count: 1 },
      { value: 'web', label: 'Web', count: 2 },
    ])
  })

  it('offers every stack item once, alphabetically, with counts', () => {
    expect(stackOptions(projects).map(({ label, count }) => `${label}:${count}`)).toEqual([
      'Dash:1',
      'FastAPI:1',
      'Next.js:1',
      'Python:2',
      'TypeScript:1',
    ])
  })

  it('reads known values from the query string and ignores the rest', () => {
    const domains = domainOptions(projects, labels)
    const stacks = stackOptions(projects)
    expect(readFilters(new URLSearchParams('domain=web&stack=python'), domains, stacks)).toEqual({ domain: 'web', stack: 'python' })
    expect(readFilters(new URLSearchParams('domain=payments&stack=cobol'), domains, stacks)).toEqual({})
  })

  it('writes filters into the query string, keeping other parameters', () => {
    const params = new URLSearchParams('ref=home&stack=dash')
    expect(writeFilters(params, { domain: 'web', stack: undefined }).toString()).toBe('ref=home&domain=web')
  })

  it('combines a domain and a stack', () => {
    const slugs = (filters: Parameters<typeof filterProjects>[1]) => filterProjects(projects, filters).map((p) => p.slug)
    expect(slugs({})).toEqual(['api', 'dash', 'site'])
    expect(slugs({ stack: 'python' })).toEqual(['api', 'dash'])
    expect(slugs({ domain: 'web', stack: 'python' })).toEqual(['api'])
    expect(slugs({ domain: 'dashboards', stack: 'next-js' })).toEqual([])
  })
})
