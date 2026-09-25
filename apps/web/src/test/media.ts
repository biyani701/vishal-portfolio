// jsdom has no media queries. This stand-in evaluates the subset of Media Queries 4 used by src/design
// (comma lists, `and`, orientation, width/height ranges in px, prefers-color-scheme, prefers-reduced-motion) against a fake viewport,
// so tests exercise the real query strings. Anything outside that subset throws rather than guessing.
import { vi } from 'vitest'

export interface FakeScreen {
  width: number
  height: number
  colorScheme?: 'light' | 'dark'
  reducedMotion?: boolean
}

const RANGE = /^(?:(\d+)px\s*(<=|<)\s*)?(width|height)\s*(?:(<=|<|>=|>)\s*(\d+)px)?$/

function compare(a: number, op: string, b: number) {
  if (op === '<') return a < b
  if (op === '<=') return a <= b
  if (op === '>') return a > b
  return a >= b
}

function feature(text: string, screen: FakeScreen): boolean {
  const [name, value] = text.split(':').map((part) => part.trim())
  if (name === 'orientation') return (screen.width > screen.height ? 'landscape' : 'portrait') === value
  if (name === 'prefers-color-scheme') return (screen.colorScheme ?? 'light') === value
  if (name === 'prefers-reduced-motion') return (screen.reducedMotion ? 'reduce' : 'no-preference') === value
  const range = RANGE.exec(text)
  if (!range || value !== undefined) throw new Error(`Unsupported media feature: (${text})`)
  const [, min, minOp, axis, maxOp, max] = range
  const size = screen[axis as 'width' | 'height']
  return (!min || compare(Number(min), minOp!, size)) && (!max || compare(size, maxOp!, Number(max)))
}

export function evaluateQuery(query: string, screen: FakeScreen): boolean {
  return query.split(',').some((list) =>
    list.split(/\s+and\s+/).every((part) => {
      const match = /^\s*\((.+)\)\s*$/.exec(part)
      if (!match) throw new Error(`Unsupported media query: ${query}`)
      return feature(match[1]!, screen)
    }),
  )
}

/**
 * Stubs window.matchMedia with a viewport the test controls. `resize` and `setColorScheme` update it and
 * fire `change` on every list whose result flipped, as a browser does.
 */
export function stubMatchMedia(initial: FakeScreen) {
  const screen = { ...initial }
  const lists = new Set<{ query: string; last: boolean; listeners: Set<() => void> }>()

  vi.stubGlobal('matchMedia', (query: string) => {
    const list = { query, last: evaluateQuery(query, screen), listeners: new Set<() => void>() }
    lists.add(list)
    return {
      media: query,
      get matches() {
        return evaluateQuery(query, screen)
      },
      addEventListener: (_: 'change', listener: () => void) => list.listeners.add(listener),
      removeEventListener: (_: 'change', listener: () => void) => list.listeners.delete(listener),
    }
  })

  function update(change: Partial<FakeScreen>) {
    Object.assign(screen, change)
    for (const list of lists) {
      const now = evaluateQuery(list.query, screen)
      if (now !== list.last) {
        list.last = now
        list.listeners.forEach((listener) => listener())
      }
    }
  }

  return {
    resize: (width: number, height: number) => update({ width, height }),
    setColorScheme: (colorScheme: 'light' | 'dark') => update({ colorScheme }),
  }
}
