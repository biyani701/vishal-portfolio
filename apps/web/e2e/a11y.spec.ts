import { createRequire } from 'node:module'
import { expect, test, type Page } from '@playwright/test'
import { routes } from './routes.ts'

// Task 13.1 (specs/design-system, specs/responsive-layout): axe finds no violations on any route, in either theme,
// at any of the matrix viewports. The page is checked once it has rendered its heading.

const axeSource = createRequire(import.meta.url).resolve('axe-core/axe.min.js')

async function violations(page: Page) {
  await page.addScriptTag({ path: axeSource })
  return page.evaluate(async () => {
    const { violations } = await window.axe.run(document, { resultTypes: ['violations'] })
    return violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)
  })
}

declare global {
  interface Window {
    axe: typeof import('axe-core')
  }
}

for (const theme of ['light', 'dark'] as const) {
  test.describe(`${theme} theme`, () => {
    test.use({ colorScheme: theme })

    for (const route of routes) {
      test(`${route.name} (${route.path}) has no axe violations`, async ({ page }) => {
        await page.addInitScript((mode) => localStorage.setItem('themeMode', mode), theme)
        await page.goto(route.path)
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
        // Fonts and colour transitions settle before contrast is measured.
        await page.evaluate(() => document.fonts.ready)
        await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => undefined))))
        expect(await violations(page)).toEqual([])
      })
    }
  })
}
