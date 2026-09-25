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

// specs/responsive-layout "Layout modes" and "Shell sizing".
const HEADER_HEIGHT = { desktop: 64, tablet: 64, mobile: 56, 'compact-landscape': 44 } as const

test.describe('shell', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('JS layout mode agrees with the CSS header height for this viewport', async ({ page }) => {
    const mode = test.info().project.metadata.mode as keyof typeof HEADER_HEIGHT
    await expect(page.locator('[data-layout-mode]')).toHaveAttribute('data-layout-mode', mode)
    const header = (await page.getByRole('banner').boundingBox())!
    expect(Math.round(header.height)).toBe(HEADER_HEIGHT[mode])
  })

  test('the header stays put while scrolling and the footer is static', async ({ page }) => {
    // Make the page taller than any viewport.
    await page.getByRole('main').evaluate((main) => main.append(Object.assign(document.createElement('div'), { style: 'height: 3000px' })))
    await page.mouse.wheel(0, 1500)
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0)
    expect((await page.getByRole('banner').boundingBox())!.y).toBe(0)

    const footer = page.getByRole('contentinfo')
    await expect(footer).toHaveCSS('position', 'static')
  })

  test('an in-page anchor scrolls its heading fully below the header', async ({ page }) => {
    await page.getByRole('main').evaluate((main) => {
      main.append(Object.assign(document.createElement('div'), { style: 'height: 2000px' }))
      main.append(Object.assign(document.createElement('h2'), { id: 'anchor-target', textContent: 'Section heading' }))
      main.append(Object.assign(document.createElement('div'), { style: 'height: 2000px' }))
    })
    await page.evaluate(() => (location.hash = '#anchor-target'))
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0)

    const header = (await page.getByRole('banner').boundingBox())!
    const heading = (await page.getByRole('heading', { name: 'Section heading' }).boundingBox())!
    expect(heading.y).toBeGreaterThanOrEqual(header.y + header.height - 1)
    expect(heading.y + heading.height).toBeLessThanOrEqual(page.viewportSize()!.height)
  })
})
