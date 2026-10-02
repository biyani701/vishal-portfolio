import '@testing-library/jest-dom/vitest'
import { destroyAnnouncer } from '@react-aria/live-announcer'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { stubMatchMedia } from './media.ts'

// jsdom has no matchMedia or scrolling; default to a desktop viewport in a light OS. Tests can stub their own.
beforeEach(() => {
  stubMatchMedia({ width: 1440, height: 900 })
  vi.stubGlobal('scrollTo', () => {})
})

// Vitest globals are off, so Testing Library can't register its own cleanup. The live announcer is a module
// singleton: its first message waits 100ms when not in act(), and that timer can outlive the file's jsdom
// ("document is not defined"). Destroying it after each test turns a pending timer into a no-op.
afterEach(() => {
  cleanup()
  destroyAnnouncer()
  vi.unstubAllGlobals()
})
