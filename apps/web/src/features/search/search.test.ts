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
  entry('page', 'Writing'),
  entry('project', 'Fast-JiraQL', ['python', 'fastapi', 'graphql']),
  entry('project', 'JIRA Delivery Dashboard', ['python', 'dash']),
  entry('article', 'The rise of AI agents', ['ai']),
  entry('term', 'CAVV', ['cardholder', 'authentication'], 'Cardholder Authentication Verification Value'),
  entry('term', 'OTP', ['one', 'time', 'password'], 'One Time Password'),
]

const titles = (query: string) => searchEntries(entries, query).map((group) => [group.value, group.items.map((i) => i.title)])

describe('searchEntries', () => {
  it('lists the pages before anything is typed, with no Ask option', () => {
    expect(titles('')).toEqual([['page', ['Work', 'Writing']]])
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

  it('finds glossary terms by full form', () => {
    expect(titles('auth')[0]).toEqual(['term', ['CAVV']])
  })

  it('offers only Ask when nothing matches', () => {
    const groups = searchEntries(entries, 'fixed price')
    expect(groups).toHaveLength(1)
    expect(groups[0]!.items[0]).toMatchObject({ title: 'Ask: fixed price', url: '/ask?q=fixed+price' })
  })
})
