// @vitest-environment node
import { readFileSync } from 'node:fs'
import { checkConfidential } from '@vishal/content-guard'
import { describe, expect, it } from 'vitest'
import { hub, hubSchema, labSchema, siteSchema } from './sites.ts'

// specs/domain-hub: the content schema, consistency with the portfolio's records, and the shared guard.

/** `site.live` from a portfolio project's frontmatter, e.g. site: {"url": "https://kb.biyani.xyz", "live": false}. */
export function portfolioLive(source: string): boolean {
  const match = /^site:\s*\{[^}]*"live":\s*(true|false)[^}]*\}\s*$/m.exec(source)
  if (!match) throw new Error('no site.live in the frontmatter')
  return match[1] === 'true'
}

const project = (file: string) => readFileSync(new URL(`../../web/content/projects/${file}`, import.meta.url), 'utf8')

describe('hub content', () => {
  it('validates', () => {
    expect(() => hubSchema.parse(hub)).not.toThrow()
  })

  it('rejects a site without a purpose and a Labs entry without a path', () => {
    expect(siteSchema.safeParse({ id: 'blog', name: 'Blog', url: 'https://blog.biyani.xyz', purpose: '', live: false }).success).toBe(false)
    expect(labSchema.safeParse({ name: 'X', path: '', description: 'Y' }).success).toBe(false)
  })

  it('passes the shared confidentiality guard', () => {
    expect(() => checkConfidential('content/sites.ts', readFileSync(new URL('./sites.ts', import.meta.url), 'utf8'))).not.toThrow()
  })
})

describe('consistency with the portfolio (specs/domain-hub "Consistency with the portfolio")', () => {
  it.each([
    ['blog', 'blog-platform.md'],
    ['kb', 'knowledge-base.md'],
  ] as const)('%s has the same live status as %s', (id, file) => {
    const site = hub.sites.find((s) => s.id === id)!
    const live = portfolioLive(project(file))
    expect(site.live, `${id}: hub says ${site.live}, ${file} says ${live}`).toBe(live)
  })

  it('notices a flipped flag', () => {
    const flipped = project('knowledge-base.md').replace('"live": false', '"live": true')
    expect(portfolioLive(flipped)).not.toBe(hub.sites.find((s) => s.id === 'kb')!.live)
  })
})
