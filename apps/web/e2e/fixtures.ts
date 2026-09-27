import { test as base, expect, type Page } from '@playwright/test'

// Pages load prerendered (scripts/prerender.mjs): the HTML is visible at once, and the app takes over a moment
// later. Specs act on the running app, so `page.goto` here also waits for it to start: main.tsx removes the
// root's data-prerendered-root marker and renders. (theme.spec.ts blocks the app on purpose and uses Playwright
// directly.)

export async function appReady(page: Page) {
  await page.waitForFunction(() => {
    const root = document.getElementById('root')
    return Boolean(root && !root.hasAttribute('data-prerendered-root') && root.childElementCount > 0)
  })
}

export const test = base.extend({
  // Playwright's fixture callback is conventionally `use`; renamed so the React hooks lint doesn't mistake it for React's.
  page: async ({ page }, provide) => {
    const goto = page.goto.bind(page)
    page.goto = async (url, options) => {
      const response = await goto(url, options)
      await appReady(page)
      return response
    }
    await provide(page)
  },
})

export { expect }
