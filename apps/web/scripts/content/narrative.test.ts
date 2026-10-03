// @vitest-environment node
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { about } from '../../content/about.ts'
import { careerYears, yearsSince } from '../../content/derive.ts'
import { profile } from '../../content/profile.ts'
import { roles } from '../../content/roles.ts'
import { checkConfidential, checkConfidentialSources } from '@vishal/content-guard'
import { buildAiContext, buildSearchIndex } from './indexes.ts'
import { checkSources, loadContent, loadMarkdown } from './load.ts'

// specs/portfolio-narrative: positioning, programme case studies, project kinds and the confidentiality guard.

const fixture = (name: string) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8')
const withYear = fixture('no-year.md').replace('type:', 'year: 2020\ntype:')

describe('derived years (Positioning)', () => {
  it('counts whole years from the first role', () => {
    expect(yearsSince('2000-05', new Date(2026, 9, 3))).toBe(26)
    expect(yearsSince('2000-05', new Date(2026, 3, 30))).toBe(25)
    expect(careerYears(roles, new Date(2026, 9, 3))).toBe(26)
  })

  it('puts the derived years in the lede and the proof ledger, and no hard-coded 25', () => {
    const years = String(careerYears(roles))
    expect(profile.lede.startsWith(`${years} years in financial-services technology`)).toBe(true)
    expect(profile.proof[0]).toMatchObject({ value: years })
    expect(JSON.stringify(profile)).not.toMatch(/Twenty-five|25\+|25 years/)
  })

  it('keeps the formal title on Experience and the functional caption in the hero', () => {
    expect(roles.find((role) => role.id === 'corecard')?.title).toBe('Principal Project Analyst')
    expect(profile.currentRole).toBe('Programme delivery lead · CoreCard')
    expect(profile.statement).toEqual(['I lead delivery', 'I understand payments', 'I build tools'])
  })
})

describe('project kinds', () => {
  it('a programme without a headline fails naming the file and field', async () => {
    const source = withYear.replace('type:', 'kind: "programme"\ntype:')
    await expect(loadMarkdown('content/projects/no-year.md', source)).rejects.toThrow('content/projects/no-year.md: headline: a programme needs a headline')
  })

  it('a tool without a stack fails naming the file and field', async () => {
    const source = withYear.replace(/stack: \["TypeScript"\]\r?\n/, '')
    await expect(loadMarkdown('content/projects/no-year.md', source)).rejects.toThrow('content/projects/no-year.md: stack: a tool needs at least one item')
  })

  it('a programme needs neither stack nor architecture', async () => {
    const source = withYear
      .replace('type:', 'kind: "programme"\nheadline: {"value": "4×", "label": "throughput"}\ntype:')
      .replace(/stack: \["TypeScript"\]\r?\n/, '')
      .replace(/architecture: \["A", "B"\]\r?\n/, '')
    await expect(loadMarkdown('content/projects/no-year.md', source)).resolves.toMatchObject({ meta: { kind: 'programme', stack: [] } })
  })
})

describe('confidentiality and accuracy guard', () => {
  it.each([
    ['Goldman Sachs', 'Goldman Sachs'],
    ['Apple', 'the Apple Card Family programme'],
    ['Cookie (codename)', 'the Cookie and Jazz projects'],
    ['Jazz (codename)', 'Jazz'],
    ['FNAM (misspelling of FNMA)', 'FNAM monthly files'],
    ['currency amount', 'worth $40M'],
    ['currency amount', 'USD 7m'],
  ])('rejects %s', (term, text) => {
    expect(() => checkConfidential('content/projects/x.md', text)).toThrow(`content/projects/x.md: denylisted term "${term}"`)
  })

  it('allows the privacy page’s cookies, FNMA and template strings', () => {
    for (const text of ['One cookie, “themeMode”', 'FNMA (Fannie Mae)', '`${years} years`']) {
      expect(() => checkConfidential('content/legal.ts', text)).not.toThrow()
    }
  })

  it('names the file when a content source carries a denylisted term', () => {
    const dir = mkdtempSync(join(tmpdir(), 'content-'))
    mkdirSync(join(dir, 'projects'))
    writeFileSync(join(dir, 'projects', 'leak.md'), '---\nslug: "leak"\n---\nBuilt for Goldman Sachs.\n')
    expect(() => checkConfidentialSources(dir)).toThrow('content/projects/leak.md: denylisted term "Goldman Sachs"')
    expect(() => checkSources(dir)).toThrow(/^content\/projects\/leak\.md: denylisted term/)
  })

  it('passes the real content and the generated indexes', async () => {
    expect(() => checkSources()).not.toThrow()
    const content = await loadContent()
    expect(() => checkConfidential('ai-context.json', JSON.stringify(buildAiContext(content)))).not.toThrow()
    expect(() => checkConfidential('search-index.json', JSON.stringify(buildSearchIndex(content)))).not.toThrow()
  })
})

describe('programme case studies', () => {
  const body = async (slug: string) => (await loadContent()).projects.find((p) => p.meta.slug === slug)!.body

  it('keeps the FNMA result and the system-wide 4× as separate measurements', async () => {
    const jpm = await body('jpmorgan-reference-data')
    expect(jpm).toContain('FNMA (Fannie Mae)')
    expect(jpm).not.toMatch(/freddie/i)
    const lines = jpm.split('\n')
    const fnma = lines.find((line) => line.includes('20–24 days'))!
    const throughput = lines.find((line) => line.includes('4×'))!
    expect(fnma).not.toContain('4×')
    expect(throughput).toMatch(/whole reference-data system/)
  })

  it('keeps the two 150 figures apart: ~150 peak in the case study, 150+ coached on Experience only', async () => {
    const corecard = await body('corecard-predictable-delivery')
    expect(corecard).toMatch(/approximately 150 people across Development, QA and PMO/)
    expect(corecard).not.toContain('150+')
    expect(roles.find((role) => role.id === 'corecard')!.outcomes.filter((o) => o.includes('150+'))).toHaveLength(1)
    expect(JSON.stringify(profile.proof)).not.toContain('150')
    expect(JSON.stringify(about)).not.toContain('150')
  })
})
