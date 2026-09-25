// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// Task 2.7: CLAUDE.md and AGENTS.md carry the same UI rule block, so every coding agent gets the UF-3 rules.
const START = '<!-- BEGIN UI RULES (apps/web) -->'
const END = '<!-- END UI RULES (apps/web) -->'

function uiRules(file: string) {
  const text = readFileSync(new URL(`../../../${file}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n')
  const start = text.indexOf(START)
  const end = text.indexOf(END)
  expect(start, `${file} has the UI rules block`).toBeGreaterThanOrEqual(0)
  expect(end, `${file} closes the UI rules block`).toBeGreaterThan(start)
  return text.slice(start, end + END.length)
}

describe('agent instructions', () => {
  it('CLAUDE.md and AGENTS.md contain the same UI rules block', () => {
    expect(uiRules('AGENTS.md')).toBe(uiRules('CLAUDE.md'))
  })

  it.each([
    '@base-ui/react',
    'render` prop, never `asChild`',
    'shadcn@latest add',
    'tokens only',
    '@radix-ui/*',
  ])('covers %s', (rule) => {
    expect(uiRules('CLAUDE.md')).toContain(rule)
  })
})
