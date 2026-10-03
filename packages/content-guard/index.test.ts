import { createHash } from 'node:crypto'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { checkConfidential, checkConfidentialSources, HASHED_TERMS, phrases } from './index.ts'

// The shared guard (specs/portfolio-narrative "Confidentiality and accuracy guard"; openspec add-biyani-hub, D3).
// The real terms are hashed so this public repo doesn't name them; these tests use stand-in words instead.
const sha256 = (text: string) => createHash('sha256').update(text).digest('hex')
const standIns = new Map([
  [sha256('zebracorp'), 'uncleared name' as const],
  [sha256('kiwi project'), 'internal codename' as const],
])

describe('content guard', () => {
  it('stores only well-formed SHA-256 hashes', () => {
    expect(HASHED_TERMS.size).toBeGreaterThan(0)
    for (const hash of HASHED_TERMS.keys()) expect(hash).toMatch(/^[0-9a-f]{64}$/)
  })

  it('splits text into lower-case words and two- and three-word phrases', () => {
    expect([...phrases('The Kiwi-Project, done.')]).toEqual(
      expect.arrayContaining(['the', 'kiwi', 'project', 'done', 'the kiwi', 'kiwi project', 'the kiwi project']),
    )
  })

  it.each([
    ['uncleared name', 'Built for ZebraCorp in 2020.'],
    ['internal codename', 'Owned the Kiwi project.'],
  ])('rejects a hashed %s, naming the file and the kind of term', (kind, text) => {
    expect(() => checkConfidential('content/x.md', text, standIns)).toThrow(`content/x.md: denylisted ${kind}`)
  })

  it.each([
    ['FNAM (misspelling of FNMA)', 'FNAM monthly files'],
    ['currency amount', 'worth $40M'],
    ['currency amount', 'USD 7m'],
  ])('rejects %s', (term, text) => {
    expect(() => checkConfidential('content/x.md', text)).toThrow(`content/x.md: denylisted term "${term}"`)
  })

  it('allows ordinary text, the privacy page’s cookies, FNMA and template strings', () => {
    for (const text of ['One cookie, “themeMode”', 'cookies and local storage', 'a kiwi', 'FNMA (Fannie Mae)', '`${years} years`']) {
      expect(() => checkConfidential('content/legal.ts', text)).not.toThrow()
      expect(() => checkConfidential('content/legal.ts', text, standIns)).not.toThrow()
    }
  })

  it('names the file under content/ when a source carries a denylisted term', () => {
    const dir = mkdtempSync(join(tmpdir(), 'guard-'))
    mkdirSync(join(dir, 'projects'))
    writeFileSync(join(dir, 'projects', 'leak.md'), 'Paid $40M.\n')
    expect(() => checkConfidentialSources(dir)).toThrow('content/projects/leak.md: denylisted term "currency amount"')
  })
})
