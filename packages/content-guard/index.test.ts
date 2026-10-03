import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { checkConfidential, checkConfidentialSources, DENYLIST } from './index.ts'

// The shared guard (specs/portfolio-narrative "Confidentiality and accuracy guard"; openspec add-biyani-hub, D3).
// The same samples as apps/web/scripts/content/narrative.test.ts; how the terms are stored is a separate change.
const samples: [term: string, text: string][] = [
  ['Goldman Sachs', 'Goldman Sachs'],
  ['Apple', 'the Apple Card Family programme'],
  ['Cookie (codename)', 'the Cookie and Jazz projects'],
  ['Jazz (codename)', 'Jazz'],
  ['FNAM (misspelling of FNMA)', 'FNAM monthly files'],
  ['currency amount', 'worth $40M'],
  ['currency amount', 'USD 7m'],
]

describe('content guard', () => {
  it('covers every denylist entry', () => {
    expect(new Set(samples.map(([term]) => term))).toEqual(new Set(DENYLIST.map((entry) => entry.term)))
  })

  it.each(samples)('rejects %s, naming the file and term', (term, text) => {
    expect(() => checkConfidential('content/x.md', text)).toThrow(`content/x.md: denylisted term "${term}"`)
  })

  it('allows ordinary text, cookies and template strings', () => {
    for (const text of ['One cookie, “themeMode”', 'FNMA (Fannie Mae)', '`${years} years`']) {
      expect(() => checkConfidential('content/legal.ts', text)).not.toThrow()
    }
  })

  it('names the file under content/ when a source carries a denylisted term', () => {
    const dir = mkdtempSync(join(tmpdir(), 'guard-'))
    mkdirSync(join(dir, 'projects'))
    writeFileSync(join(dir, 'projects', 'leak.md'), 'Paid $40M.\n')
    expect(() => checkConfidentialSources(dir)).toThrow('content/projects/leak.md: denylisted term "currency amount"')
  })
})
