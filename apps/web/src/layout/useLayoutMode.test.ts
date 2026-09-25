import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { layoutModes, type LayoutMode } from '@/design/modes.ts'
import { evaluateQuery, stubMatchMedia } from '@/test/media.ts'
import { getLayoutMode, useLayoutMode } from './useLayoutMode.ts'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('getLayoutMode', () => {
  // Task 3.1 and specs/responsive-layout "Layout modes".
  it.each<[number, number, LayoutMode]>([
    [932, 430, 'compact-landscape'],
    [568, 320, 'compact-landscape'],
    [1024, 768, 'desktop'],
    [390, 844, 'mobile'],
    [768, 1024, 'tablet'],
  ])('%i×%i is %s', (width, height, mode) => {
    stubMatchMedia({ width, height })
    expect(getLayoutMode()).toBe(mode)
  })

  it('matches exactly one mode for every viewport, including each boundary ±1px', () => {
    const boundaries = [500, 600, 900].flatMap((edge) => [edge - 1, edge, edge + 1])
    const sizes = [...new Set([...Array.from({ length: 67 }, (_, i) => 280 + i * 20), ...boundaries])]
    for (const width of sizes) {
      for (const height of sizes) {
        const matched = Object.values(layoutModes).filter((query) => evaluateQuery(query, { width, height }))
        expect(matched, `${width}×${height}`).toHaveLength(1)
      }
    }
  })
})

describe('useLayoutMode', () => {
  it('updates when the viewport crosses a mode boundary', () => {
    const screen = stubMatchMedia({ width: 390, height: 844 })
    const { result } = renderHook(() => useLayoutMode())
    expect(result.current).toBe('mobile')

    act(() => screen.resize(844, 390)) // rotate the phone
    expect(result.current).toBe('compact-landscape')

    act(() => screen.resize(1024, 768))
    expect(result.current).toBe('desktop')
  })
})
