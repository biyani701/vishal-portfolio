import { createRequire } from 'node:module'
import { expect, test, type Page } from '@playwright/test'
import { hub, labUrl } from '../content/sites.ts'

// specs/domain-hub at phone and desktop widths, in both themes.

const axeSource = createRequire(import.meta.url).resolve('axe-core/axe.min.js')

declare global {
  interface Window {
    axe: typeof import('axe-core')
  }
}

async function axeViolations(page: Page) {
  await page.addScriptTag({ path: axeSource })
  return page.evaluate(async () => {
    const { violations } = await window.axe.run(document, { resultTypes: ['violations'] })
    return violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)
  })
}

for (const theme of ['light', 'dark'] as const) {
  test.describe(`${theme} theme`, () => {
    test.use({ colorScheme: theme })

    test('the portfolio leads, visible in the first screen', async ({ page }) => {
      await page.goto('/')
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
      const portfolio = page.getByRole('link', { name: /Visit the portfolio/ })
      await expect(portfolio).toHaveAttribute('href', hub.identity.portfolio)
      const box = (await portfolio.boundingBox())!
      expect(box.y + box.height).toBeLessThanOrEqual(page.viewportSize()!.height)
    })

    test('has no axe violations', async ({ page }) => {
      await page.goto('/')
      expect(await axeViolations(page)).toEqual([])
    })

    test('does not scroll sideways, and every target is at least 44×44', async ({ page }) => {
      await page.goto('/')
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
      const small = await page.locator('a:visible, button:visible').evaluateAll((els) =>
        els
          .filter((el) => !el.matches('.sr-only'))
          .map((el) => ({ text: (el.textContent ?? '').trim().slice(0, 40), ...el.getBoundingClientRect().toJSON() }))
          .filter((r) => r.width < 44 || r.height < 44),
      )
      expect(small).toEqual([])
    })
  })
}

test('the toggle switches theme and remembers it', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  const toggle = page.getByRole('button', { name: 'Switch to dark theme' })
  await toggle.click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.getByRole('button', { name: 'Switch to light theme' })).toBeVisible()
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  test('every section and link is present, and the toggle stays hidden', async ({ page }) => {
    await page.goto('/')
    for (const name of ['Sites', 'Labs']) await expect(page.getByRole('heading', { name })).toBeVisible()
    await expect(page.getByRole('link', { name: /Visit the portfolio/ })).toBeVisible()
    await expect(page.locator('[data-theme-toggle]')).toBeHidden()
  })
})

test('the build is static: no app script beyond the theme', async ({ request }) => {
  const html = await (await request.get('/')).text()
  expect(html).toContain('<h1 id="identity-heading"')
  expect([...html.matchAll(/<script\b/g)]).toHaveLength(2) // the inline theme script and the toggle module
  expect(html).toMatch(/<meta name="hub-build" content="[^"%]+"/)
})

// specs/domain-hub "Labs entry": every Labs link answers on the live domain. Network-dependent, so it runs where
// the network is allowed (CI and the smoke test) and can be skipped with HUB_SKIP_NETWORK=1.
test('every Labs page responds with 200 on www.biyani.xyz', async ({ request }) => {
  test.skip(!!process.env.HUB_SKIP_NETWORK, 'network checks disabled')
  test.skip(test.info().project.name !== 'desktop-1440x900', 'checked once')
  for (const lab of hub.labs.entries) {
    const res = await request.get(labUrl(lab), { maxRedirects: 5 })
    expect(res.status(), labUrl(lab)).toBe(200)
  }
})
