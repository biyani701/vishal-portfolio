import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { stubMatchMedia } from './media.ts'

// jsdom has no matchMedia or scrolling; default to a desktop viewport in a light OS. Tests can stub their own.
beforeEach(() => {
  stubMatchMedia({ width: 1440, height: 900 })
  vi.stubGlobal('scrollTo', () => {})
})

// Vitest globals are off, so Testing Library can't register its own cleanup.
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
