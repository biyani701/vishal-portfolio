import { mkdirSync } from 'node:fs'
import type { Page } from '@playwright/test'
import { expect, test } from './fixtures.ts'
import { routes } from './routes.ts'
import { undersizedTargets } from './targets.ts'

// The matrix (task 12.1; specs/responsive-layout): every route × every viewport project × both themes, checked for
// horizontal overflow, content under the header and, on touch layouts, targets under 44×44. With
// MATRIX_SCREENSHOTS=1 each cell also saves a full-page screenshot to matrix-screenshots/<viewport>/<theme>/
// (CI uploads the folder as an artifact).

const screenshots = process.env.MATRIX_SCREENSHOTS === '1'
const isTouchLayout = () => test.info().project.metadata.mode !== 'desktop'
const fileName = (path: string) => (path === '/' ? 'home' : path.slice(1).replace(/\//g, '__'))

async function expectTouchTargets(page: Page) {
  const undersized = await undersizedTargets(page)
  expect(undersized.map((t) => `${t.element} is ${t.width}×${t.height}`), 'targets under 44×44').toEqual([])
}

for (const theme of ['light', 'dark'] as const) {
  test.describe(`${theme} theme`, () => {
    test.use({ colorScheme: theme })

    for (const route of routes) {
      test.describe(`${route.name} (${route.path})`, () => {
        test.beforeEach(async ({ page }) => {
          await page.addInitScript((mode) => localStorage.setItem('themeMode', mode), theme)
          await page.goto(route.path)
          await expect(page.getByRole('main')).toBeVisible()
          await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
        })

        test('does not scroll horizontally', async ({ page }) => {
          const viewportWidth = page.viewportSize()!.width
          // Compare with the configured viewport, not innerWidth: on mobile emulation an overflowing page widens the layout viewport.
          const scrollWidth = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth))
          expect(scrollWidth, `scrollWidth ${scrollWidth}px exceeds the ${viewportWidth}px viewport`).toBeLessThanOrEqual(viewportWidth)
        })

        test('keeps content below the header', async ({ page }) => {
          const header = await page.getByRole('banner').first().boundingBox()
          const headerBottom = header ? header.y + header.height : 0
          for (const locator of [page.getByRole('main'), page.getByRole('heading', { level: 1 })]) {
            const box = (await locator.first().boundingBox())!
            expect(box.y, 'content starts beneath the header').toBeGreaterThanOrEqual(headerBottom)
          }
        })

        test('has touch targets of at least 44×44', async ({ page }) => {
          test.skip(!isTouchLayout(), 'desktop layouts use a pointer')
          await expectTouchTargets(page)
        })

        test('fits project-card thumbnails inside their cards', async ({ page }) => {
          // Cards clip their thumbnail, so an overflowing one never shows up as page overflow.
          const thumbs = page.locator('[data-architecture-thumb]')
          test.skip((await thumbs.count()) === 0, 'no project cards on this route')
          const overflowing = await thumbs.evaluateAll((els) =>
            els
              .filter((el) => el.checkVisibility() && (el.scrollWidth > el.clientWidth + 1 || [...el.children].some((box) => box.scrollWidth > box.clientWidth + 1)))
              .map((el) => el.textContent),
          )
          expect(overflowing, 'thumbnails wider than their card').toEqual([])
        })

        test('screenshot', async ({ page }) => {
          test.skip(!screenshots, 'set MATRIX_SCREENSHOTS=1')
          const dir = `matrix-screenshots/${test.info().project.name}/${theme}`
          mkdirSync(dir, { recursive: true })
          await page.evaluate(() => document.fonts.ready)
          // Sections fade in as they scroll into view (Reveal); scroll through once so the capture shows them all.
          await page.evaluate(async () => {
            for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight / 2) {
              scrollTo(0, y)
              await new Promise((resolve) => setTimeout(resolve, 50))
            }
            scrollTo(0, 0)
          })
          await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => undefined))))
          await page.waitForTimeout(400)
          await page.screenshot({ path: `${dir}/${fileName(route.path)}.png`, fullPage: true, animations: 'disabled' })
        })
      })
    }

    // Overlays open over any page; their controls are touch targets too.
    test.describe('overlays', () => {
      test.skip(() => !isTouchLayout(), 'desktop layouts use a pointer')
      test.beforeEach(async ({ page }) => {
        await page.addInitScript((mode) => localStorage.setItem('themeMode', mode), theme)
        await page.goto('/work')
      })

      test('the menu has touch targets of at least 44×44', async ({ page }) => {
        const open = page.getByRole('button', { name: 'Open menu' })
        test.skip(!(await open.isVisible()), 'this layout shows the navigation in the header')
        await open.click()
        await expect(page.getByRole('navigation', { name: 'Menu' })).toBeVisible()
        await expectTouchTargets(page)
      })

      test('search has touch targets of at least 44×44', async ({ page }) => {
        await page.locator('body').click({ position: { x: 1, y: 200 } })
        await page.keyboard.press('ControlOrMeta+k')
        await page.getByRole('combobox', { name: 'Search or ask' }).fill('jira')
        await expect(page.getByRole('listbox').getByRole('option').first()).toBeVisible()
        await expectTouchTargets(page)
      })

      test('Ask has touch targets of at least 44×44', async ({ page }) => {
        await page.getByRole('banner').getByRole('link', { name: 'Ask', exact: true }).click()
        await expect(page.getByRole('dialog', { name: 'Ask' }).or(page.getByRole('heading', { level: 1, name: 'Ask' }))).toBeVisible()
        await expectTouchTargets(page)
      })
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
