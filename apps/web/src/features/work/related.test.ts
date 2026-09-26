import { describe, expect, it } from 'vitest'
import type { ProjectMeta, Role } from '@content/schema.ts'
import { relatedProjects, rolesForProject } from './related.ts'

const project = (slug: string, domains: string[], stack: string[], year = 2023) =>
  ({ slug, title: slug, year, domains, stack }) as ProjectMeta

describe('relatedProjects', () => {
  const base = project('base', ['apis', 'web'], ['Python', 'React'])

  it('ranks shared domains above shared stack, and leaves out the project itself and unrelated ones', () => {
    const all = [
      base,
      project('stack-only', ['dashboards'], ['Python', 'React']),
      project('one-domain', ['apis'], []),
      project('two-domains', ['apis', 'web'], []),
      project('unrelated', ['payments'], ['Go']),
    ]
    expect(relatedProjects(base, all).map((p) => p.slug)).toEqual(['two-domains', 'one-domain', 'stack-only'])
  })

  it('breaks ties by year, newest first, and caps the list', () => {
    const all = [base, project('old', ['apis'], [], 2020), project('new', ['apis'], [], 2025), project('mid', ['apis'], [], 2022)]
    expect(relatedProjects(base, all, 2).map((p) => p.slug)).toEqual(['new', 'mid'])
  })
})

describe('rolesForProject', () => {
  it('returns the roles that list the project', () => {
    const roles = [{ id: 'a', projects: ['base'] }, { id: 'b', projects: [] }] as unknown as Role[]
    expect(rolesForProject('base', roles).map((role) => role.id)).toEqual(['a'])
  })
})
