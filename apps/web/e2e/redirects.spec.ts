import { expect, test } from '@playwright/test'

// specs/site-navigation "Redirects for legacy URLs" in a real browser, from a cold deep link (the path the
// GitHub Pages 404.html restore takes). Every table entry is covered by src/layout/redirects.test.tsx.
test('an old article link lands on the blog platform case study, and Back skips the old one', async ({ page }) => {
  await page.goto('/')
  await page.goto('/blogs/ai-agents')
  await expect(page).toHaveURL('/work/blog-platform')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Case study')

  await page.goBack()
  await expect(page).toHaveURL('/')
})

test('an old home anchor lands on its new page section', async ({ page }) => {
  await page.goto('/#skills')
  await expect(page).toHaveURL('/experience#skills')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Experience')
})

test('/_dev is the 404 page in production', async ({ page }) => {
  await page.goto('/_dev')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found')
  await expect(page.getByRole('banner')).toBeVisible()
})
