// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { cn, shadowTokens, spacingTokens, textSizes } from './utils.ts'

const tokens = readFileSync(new URL('../design/tokens.css', import.meta.url), 'utf8')
const names = (prefix: string) =>
  [...tokens.matchAll(new RegExp(`--${prefix}-([a-z0-9-]+?):`, 'g'))].map((m) => m[1]).filter((n) => !n!.includes('--'))

describe('cn', () => {
  it('knows every custom scale in tokens.css', () => {
    expect(new Set(textSizes)).toEqual(new Set(names('text')))
    expect(new Set(spacingTokens)).toEqual(new Set(names('spacing')))
    expect(new Set(shadowTokens)).toEqual(new Set(names('shadow')))
  })

  it.each([
    ['text-label text-ink', 'text-label text-ink'],
    ['text-body text-muted', 'text-body text-muted'],
    ['text-ink text-muted', 'text-muted'],
    ['text-label text-h3', 'text-h3'],
    ['shadow-overlay shadow-none', 'shadow-none'],
    ['p-4 p-gutter', 'p-gutter'],
    ['rounded-md rounded-lg', 'rounded-lg'],
    ['bg-surface bg-accent-soft', 'bg-accent-soft'],
  ])('merges %s to %s', (input, expected) => {
    expect(cn(input)).toBe(expected)
  })
})
