// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { layoutModes } from './modes.ts'

// Read from disk: Vitest stubs CSS imports, including ?raw.
const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8')

/** Custom properties declared directly inside the first block that follows `selector`. */
function declarations(selector: string): Record<string, string> {
  const start = css.indexOf(selector)
  if (start < 0) throw new Error(`${selector} not found in tokens.css`)
  const open = css.indexOf('{', start)
  let depth = 0
  let end = open
  for (; end < css.length; end++) {
    if (css[end] === '{') depth++
    else if (css[end] === '}' && --depth === 0) break
  }
  // Drop nested blocks (e.g. @variant) so only top-level declarations remain.
  const body = css.slice(open + 1, end).replace(/\{[^{}]*\}/g, '')
  return Object.fromEntries(
    [...body.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(--[\w-]+\*?):\s*([^;]+);/g)].map((m) => [m[1]!, m[2]!.trim()]),
  )
}

const colours = (block: Record<string, string>) =>
  Object.fromEntries(Object.entries(block).filter(([name]) => name.startsWith('--color-') && name !== '--color-*'))

const theme = declarations('@theme {')
const light = colours(theme)
const dark = colours(declarations(":root[data-theme='dark']"))

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
}

function contrast(fg: string, bg: string) {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a)
  return (hi! + 0.05) / (lo! + 0.05)
}

// §4.1: body text ≥ 4.5:1 and large/UI ≥ 3:1 against the surface it sits on, in both themes.
const textPairs: [string, string][] = [
  ['ink', 'bg'],
  ['ink', 'surface'],
  ['ink', 'sunken'],
  ['ink-2', 'surface'],
  ['ink-2', 'bg'],
  ['muted', 'bg'],
  ['muted', 'surface'],
  ['muted', 'sunken'],
  ['accent', 'bg'],
  ['accent', 'surface'],
  ['accent', 'accent-soft'],
  ['on-accent', 'accent-fill'],
  ['flight-fg', 'flight-bg'],
  ['error', 'error-bg'],
  ['error', 'surface'],
  ['ink', 'error-border'], // destructive button hover
  ['success', 'surface'],
  ['code-fg', 'code-bg'],
  ['code-keyword', 'code-bg'],
  ['code-string', 'code-bg'],
  ['code-comment', 'code-bg'],
]
const uiPairs: [string, string][] = [
  // Form-control outlines must be identifiable against every surface they sit on (WCAG 1.4.11).
  ['border-control', 'bg'],
  ['border-control', 'surface'],
  ['border-control', 'sunken'],
  ['border-strong', 'surface'],
  ['accent', 'surface'],
  ['flight-dot', 'surface'],
  ['flight-dot', 'flight-bg'],
]

describe('Programme tokens', () => {
  it('match the snapshot', () => {
    expect({ light, dark }).toMatchSnapshot()
  })

  it('define every colour in both themes', () => {
    expect(Object.keys(dark).sort()).toEqual(Object.keys(light).sort())
  })

  it('replace the Tailwind defaults', () => {
    for (const reset of ['--breakpoint-*', '--color-*', '--font-*', '--text-*', '--radius-*', '--shadow-*']) {
      expect(theme[reset], reset).toBe('initial')
    }
  })

  describe.each([
    ['light', light],
    ['dark', dark],
  ])('%s theme contrast', (_, palette) => {
    const hex = (token: string) => palette[`--color-${token}`]!

    it.each(textPairs)('%s on %s is at least 4.5:1', (fg, bg) => {
      expect(contrast(hex(fg), hex(bg))).toBeGreaterThanOrEqual(4.5)
    })

    it.each(uiPairs)('%s on %s is at least 3:1', (fg, bg) => {
      expect(contrast(hex(fg), hex(bg))).toBeGreaterThanOrEqual(3)
    })
  })

  it.each(Object.entries(layoutModes))('defines the %s variant with the query in modes.ts', (mode, query) => {
    const variant = new RegExp(`@custom-variant ${mode} \\{\\s*@media ([^{]+)\\{`).exec(css)
    expect(variant?.[1]?.trim()).toBe(query)
  })
})
