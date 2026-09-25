import { expect, test } from '@playwright/test'

// D-5: /_dev is dev-only. The Playwright suite runs against the production build, where it must not exist.
test('the /_dev/ui gallery is not part of the production build', async ({ page }) => {
  await page.goto('/_dev/ui')
  await expect(page.getByRole('heading', { name: 'Component gallery' })).toHaveCount(0)
})
