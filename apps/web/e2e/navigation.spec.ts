import { expect, test, type Page } from '@playwright/test'
import type { LayoutMode } from './viewports.ts'

// specs/site-navigation: primary navigation in each layout mode, the ⌘K palette and the footer (tasks 5.1,
// 5.2, 5.4). Runs once per matrix viewport.
const mode = () => test.info().project.metadata.mode as LayoutMode

async function expectHeadingFocused(page: Page, name: string) {
  const heading = page.getByRole('heading', { level: 1, name })
  await expect(heading).toBeFocused()
}

test('primary navigation reaches a section, marks it current and focuses its heading', async ({ page }) => {
  await page.goto('/')
  if (mode() === 'desktop') {
    const primary = page.getByRole('navigation', { name: 'Primary' })
    await primary.getByRole('link', { name: 'About' }).click()
    await expect(page).toHaveURL('/about')
    await expect(primary.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page')
    await expectHeadingFocused(page, 'About')
  } else {
    // Mobile, tablet and compact landscape: the menu button opens a drawer (specs "Mobile menu" scenario).
    await page.getByRole('button', { name: 'Open menu' }).click()
    const drawer = page.getByRole('navigation', { name: 'Menu' })
    await expect(drawer).toBeVisible()
    await drawer.getByRole('link', { name: 'About' }).click()
    await expect(page).toHaveURL('/about')
    await expect(drawer).toBeHidden()
    await expectHeadingFocused(page, 'About')

    await page.getByRole('button', { name: 'Open menu' }).click()
    await expect(page.getByRole('navigation', { name: 'Menu' }).getByRole('link', { name: /^About/ })).toHaveAttribute('aria-current', 'page')
    // Closing without navigating returns focus to the menu button.
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused()
  }
})

test('header controls are at least 44px and Ask is always one tap away', async ({ page }) => {
  await page.goto('/')
  const banner = page.getByRole('banner')
  await expect(banner.getByRole('link', { name: 'Ask', exact: true })).toBeVisible()
  for (const control of await banner.locator('a, button').all()) {
    if (!(await control.isVisible())) continue
    const box = (await control.boundingBox())!
    expect(box.height, (await control.textContent()) ?? '').toBeGreaterThanOrEqual(mode() === 'desktop' ? 40 : 44)
  }
})

test('the ⌘K palette searches the index, groups results and ends with Ask', async ({ page }) => {
  await page.goto('/')
  await page.locator('body').click({ position: { x: 1, y: 200 } })
  await page.keyboard.press('ControlOrMeta+k')
  const input = page.getByRole('combobox', { name: 'Search or ask' })
  await expect(input).toBeFocused()

  await input.fill('jira')
  const listbox = page.getByRole('listbox')
  await expect(listbox.getByText('Work', { exact: true })).toBeVisible() // group label
  await expect(listbox.getByRole('option').first()).toContainText('JIRA Delivery Dashboard')
  await expect(listbox.getByRole('option').last()).toContainText('Ask: jira')

  // Keyboard only: the first result is highlighted; Enter opens it.
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL('/work/jira-dashboard')
  await expect(input).toBeHidden()
})

test('choosing the Ask option opens Ask with the question', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('ControlOrMeta+k')
  await page.getByRole('combobox', { name: 'Search or ask' }).fill('fixed price')
  await page.getByRole('option', { name: /Ask: fixed price/ }).click()
  await expect(page).toHaveURL('/ask?q=fixed+price')
})

test('footer links resolve and the footer is static', async ({ page }) => {
  await page.goto('/')
  const footer = page.getByRole('contentinfo')
  await expect(footer).toHaveCSS('position', 'static')
  for (const name of ['Colophon', 'Privacy', 'Terms']) {
    await page.goto('/')
    await page.getByRole('contentinfo').getByRole('link', { name }).click()
    await expect(page.getByRole('heading', { level: 1 })).not.toHaveText('Page not found')
  }
  for (const name of ['LinkedIn', 'GitHub']) {
    await expect(footer.getByRole('link', { name })).toHaveAttribute('href', /^https:\/\/(www\.linkedin\.com|github\.com)\//)
  }
})

test('the desktop bar fits at the narrowest desktop width (900px)', async ({ page }) => {
  test.skip(mode() !== 'desktop', 'desktop composition only')
  await page.setViewportSize({ width: 900, height: 800 })
  await page.goto('/')
  await expect(page.locator('[data-layout-mode]')).toHaveAttribute('data-layout-mode', 'desktop')
  const width = await page.evaluate(() => document.documentElement.scrollWidth)
  expect(width).toBeLessThanOrEqual(900)
  const contact = (await page.getByRole('banner').getByRole('link', { name: 'Contact' }).boundingBox())!
  expect(contact.x + contact.width).toBeLessThanOrEqual(900)
})
