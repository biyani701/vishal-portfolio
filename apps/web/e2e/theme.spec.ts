import { expect, test, type Page } from '@playwright/test'

// Theme must be resolved before first paint (specs/design-system "Themes"). Every JS bundle is blocked,
// so only the inline script in index.html and the render-blocking stylesheet can produce the result.
const LIGHT_BG = 'rgb(244, 246, 248)'
const DARK_BG = 'rgb(13, 16, 21)'

async function openWithoutApp(page: Page) {
  await page.route(/\.(js|tsx?)(\?.*)?$/, (route) =>
    route.request().url().endsWith('/runtime-config.js') ? route.continue() : route.abort(),
  )
  await page.goto('/')
}

async function expectTheme(page: Page, theme: 'light' | 'dark') {
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
  await expect(page.locator('html')).toHaveCSS('background-color', theme === 'dark' ? DARK_BG : LIGHT_BG)
  await expect(page.locator('html')).toHaveCSS('color-scheme', theme)
}

test.describe('OS in dark mode', () => {
  test.use({ colorScheme: 'dark' })

  test('applies the dark theme before any app code runs', async ({ page }) => {
    await openWithoutApp(page)
    await expect(page.locator('#root')).toBeEmpty()
    await expectTheme(page, 'dark')
  })

  test('a saved light preference wins over the OS', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('themeMode', 'light'))
    await openWithoutApp(page)
    await expectTheme(page, 'light')
  })

  test('"system" follows the OS', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('themeMode', 'system'))
    await openWithoutApp(page)
    await expectTheme(page, 'dark')
  })
})

test.describe('OS in light mode', () => {
  test.use({ colorScheme: 'light' })

  test('applies the light theme', async ({ page }) => {
    await openWithoutApp(page)
    await expectTheme(page, 'light')
  })

  test('the consent-gated cookie takes precedence over local storage', async ({ page, context, baseURL }) => {
    await context.addCookies([{ name: 'themeMode', value: 'dark', url: baseURL! }])
    await page.addInitScript(() => localStorage.setItem('themeMode', 'light'))
    await openWithoutApp(page)
    await expectTheme(page, 'dark')
  })
})
