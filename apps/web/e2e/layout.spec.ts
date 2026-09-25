import { expect, test } from '@playwright/test'
import { routes } from './routes.ts'

for (const route of routes) {
  test.describe(`${route.name} (${route.path})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(route.path)
      await expect(page.getByRole('main')).toBeVisible()
    })

    test('does not scroll horizontally', async ({ page }) => {
      const viewportWidth = page.viewportSize()!.width
      // Compare with the configured viewport, not innerWidth: on mobile emulation an overflowing page widens the layout viewport.
      const scrollWidth = await page.evaluate(() =>
        Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      )
      expect(scrollWidth, `scrollWidth ${scrollWidth}px exceeds the ${viewportWidth}px viewport`).toBeLessThanOrEqual(
        viewportWidth,
      )
    })

    test('keeps content below the header', async ({ page }) => {
      // The AppShell header (P3.2) is the page's banner landmark; before it exists the header height is 0.
      const banner = page.getByRole('banner')
      const header = (await banner.count()) ? await banner.first().boundingBox() : null
      const headerBottom = header ? header.y + header.height : 0

      for (const locator of [page.getByRole('main'), page.getByRole('heading', { level: 1 })]) {
        const box = (await locator.first().boundingBox())!
        expect(box.y, 'content starts beneath the header').toBeGreaterThanOrEqual(headerBottom)
      }
    })
  })
}
