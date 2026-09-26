import { expect, test } from '@playwright/test'

// Task 7.2 at every viewport: no portrait on About (DD-4), and draft copy is marked. layout.spec.ts checks
// that /about doesn't scroll sideways.
test('About shows no portrait and marks its placeholder copy', async ({ page }) => {
  await page.goto('/about')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('About')
  await expect(page.getByRole('main').locator('img')).toHaveCount(0)
  await expect(page.getByRole('complementary', { name: 'Placeholder copy' })).toBeVisible()
  await expect(page.getByText('Draft copy')).toHaveCount(2)
})
