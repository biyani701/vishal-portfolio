import { readdirSync } from 'node:fs'
import { expect, test } from '@playwright/test'

// Task 8.2 in a real browser, at every viewport: every case study renders without horizontal scroll, and the
// ToC is a closed disclosure on phones and an open side column elsewhere (design package §7).
const slugs = readdirSync(new URL('../content/projects', import.meta.url))
  .filter((name) => name.endsWith('.md'))
  .map((name) => name.replace(/\.md$/, ''))

test('every case study renders without scrolling sideways', async ({ page }) => {
  const width = page.viewportSize()!.width
  for (const slug of slugs) {
    await page.goto(`/work/${slug}`)
    await expect(page.getByRole('heading', { level: 1 }), slug).toBeVisible()
    await expect(page.getByRole('complementary', { name: 'About this project' }), slug).toBeAttached()
    const scrollWidth = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth))
    expect(scrollWidth, `${slug}: scrollWidth ${scrollWidth}px exceeds the ${width}px viewport`).toBeLessThanOrEqual(width)
  }
})

test('the ToC collapses on phones and stays open elsewhere; a ToC link scrolls to its section', async ({ page }) => {
  await page.goto('/work/fast-jiraql')
  const toc = page.getByRole('navigation', { name: 'On this page' })
  const link = toc.getByRole('link', { name: "How it's built" })

  if (test.info().project.metadata.mode === 'mobile') {
    const toggle = toc.getByRole('button', { name: 'On this page' })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(link).toBeHidden()
    await toggle.click()
  } else {
    await expect(toc.getByRole('button')).toHaveCount(0)
  }

  await link.click()
  await expect(page).toHaveURL(/#how-its-built$/)
  const header = (await page.getByRole('banner').boundingBox())!
  await expect.poll(async () => (await page.getByRole('heading', { name: "How it's built" }).boundingBox())!.y).toBeGreaterThanOrEqual(
    header.y + header.height - 1,
  )
})

test('Copy on a code block confirms with a toast', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'clipboard permissions are Chromium-only')
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/work/confluence-pages-details')
  await page.getByRole('button', { name: 'Copy bash code' }).click()
  await expect(page.getByText('Copied to clipboard')).toBeVisible()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('pip install get-confluence-space-pages-details')
})

test('specs/content-pages "Separately hosted project": the knowledge base says it is in progress', async ({ page }) => {
  await page.goto('/work/knowledge-base')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Knowledge Base')
  await expect(page.getByText('In progress and not live yet. It will be at kb.biyani.xyz.')).toBeVisible()
  await expect(page.locator('a[href^="https://kb.biyani.xyz"]')).toHaveCount(0)
})
