import { expect, test } from './fixtures.ts'

// At every viewport: no portrait on About (DD-4), and the copy is final, with "How I lead" (specs/portfolio-narrative
// "About page"). layout.spec.ts checks that /about doesn't scroll sideways.
test('About shows no portrait and no draft marking', async ({ page }) => {
  await page.goto('/about')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('About')
  await expect(page.getByRole('main').locator('img')).toHaveCount(0)
  await expect(page.getByText(/Draft copy|Placeholder copy/)).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 2, name: 'How I lead' })).toBeVisible()
})
