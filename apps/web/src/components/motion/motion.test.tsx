import { act, render, renderHook, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Reveal } from './Reveal.tsx'
import { useReducedMotion } from './useReducedMotion.ts'

// jsdom has neither matchMedia nor IntersectionObserver; these stand-ins let each test choose.
let reduced = false
const mediaListeners = new Set<() => void>()
let observed: { callback: IntersectionObserverCallback; disconnect: ReturnType<typeof vi.fn> }[] = []

beforeEach(() => {
  reduced = false
  mediaListeners.clear()
  observed = []
  vi.stubGlobal('matchMedia', (query: string) => ({
    get matches() {
      return query.includes('prefers-reduced-motion') && reduced
    },
    media: query,
    addEventListener: (_: string, listener: () => void) => mediaListeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => mediaListeners.delete(listener),
  }))
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      disconnect = vi.fn()
      constructor(callback: IntersectionObserverCallback) {
        observed.push({ callback, disconnect: this.disconnect })
      }
      observe() {}
    },
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

/** Places Reveal's element `top` px from the top of the viewport. */
function placeAt(top: number) {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ top } as DOMRect)
}

const phase = () => screen.getByText('Proof ledger').dataset.reveal

describe('useReducedMotion', () => {
  it('follows prefers-reduced-motion, including live changes', () => {
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
    act(() => {
      reduced = true
      mediaListeners.forEach((listener) => listener())
    })
    expect(result.current).toBe(true)
  })
})

describe('Reveal', () => {
  it('never hides content that is already in view', () => {
    placeAt(100)
    render(<Reveal>Proof ledger</Reveal>)
    expect(phase()).toBe('static')
    expect(observed).toHaveLength(0)
  })

  it('rises and fades in once when content below the fold scrolls into view', () => {
    placeAt(5000)
    render(<Reveal>Proof ledger</Reveal>)
    const element = screen.getByText('Proof ledger')
    expect(phase()).toBe('pending')
    expect(element.className).toContain('translate-y-2')
    expect(element.className).toContain('opacity-0')

    act(() => observed[0]!.callback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver))
    expect(phase()).toBe('shown')
    expect(element.className).not.toContain('opacity-0')
    expect(observed[0]!.disconnect).toHaveBeenCalled() // once
  })

  it('skips the effect entirely under reduced motion', () => {
    reduced = true
    placeAt(5000)
    render(<Reveal>Proof ledger</Reveal>)
    expect(phase()).toBe('static')
    expect(screen.getByText('Proof ledger').className).not.toContain('opacity-0')
    expect(observed).toHaveLength(0)
  })

  it('leaves content visible when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    placeAt(5000)
    render(<Reveal>Proof ledger</Reveal>)
    expect(phase()).toBe('static')
  })
})
