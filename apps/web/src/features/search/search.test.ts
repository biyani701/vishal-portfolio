import type { SearchEntry } from '@content/schema.ts'
import { describe, expect, it } from 'vitest'
import { searchEntries } from './search.ts'

const entry = (group: SearchEntry['group'], title: string, keywords: string[] = [], summary = ''): SearchEntry => ({
  id: `${group}:${title}`,
  group,
  title,
  summary,
  url: `/${group}/${title}`,
  keywords,
})

const entries = [
  entry('page', 'Work'),
  entry('page', 'Experience'),
  entry('project', 'Fast-JiraQL', ['python', 'fastapi', 'graphql']),
  entry('project', 'JIRA Delivery Dashboard', ['python', 'dash']),
  entry('role', 'IFC · Programme lead', ['ifc', 'delivery'], 'World Bank Group'),
]

const titles = (query: string) => searchEntries(entries, query).map((group) => [group.value, group.items.map((i) => i.title)])

describe('searchEntries', () => {
  it('lists the pages before anything is typed, with no Ask option', () => {
    expect(titles('')).toEqual([['page', ['Work', 'Experience']]])
  })

  it('groups matches by kind, in palette order, and always ends with "Ask: {query}"', () => {
    expect(titles('python')).toEqual([
      ['project', ['Fast-JiraQL', 'JIRA Delivery Dashboard']],
      ['ask', ['Ask: python']],
    ])
  })

  it('ranks title matches above keyword matches', () => {
    expect(titles('jira')[0]).toEqual(['project', ['JIRA Delivery Dashboard', 'Fast-JiraQL']])
  })

  it('requires every word to match', () => {
    expect(titles('python dash')).toEqual([
      ['project', ['JIRA Delivery Dashboard']],
      ['ask', ['Ask: python dash']],
    ])
  })

  it('finds roles by keyword and by summary', () => {
    expect(titles('ifc')[0]).toEqual(['role', ['IFC · Programme lead']])
    expect(titles('world bank')[0]).toEqual(['role', ['IFC · Programme lead']])
  })

  it('offers only Ask when nothing matches', () => {
    const groups = searchEntries(entries, 'fixed price')
    expect(groups).toHaveLength(1)
    expect(groups[0]!.items[0]).toMatchObject({ title: 'Ask: fixed price', url: '/ask?q=fixed+price' })
  })
})
