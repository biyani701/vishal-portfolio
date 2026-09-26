import { expect, test } from '@playwright/test'

// Task 8.1 in a real browser, at every viewport: the specs/content-pages "Filter link" scenario, and choosing
// filters with the keyboard and pointer.
const cards = (page: import('@playwright/test').Page) =>
  page.getByRole('region', { name: 'Projects' }).getByRole('heading', { level: 3 })

test('?stack=python lists only Python projects, with the Python filter selected', async ({ page }) => {
  await page.goto('/work?stack=python')
  await expect(page.getByRole('combobox', { name: 'Stack' })).toHaveValue('Python')
  await expect(cards(page)).not.toHaveCount(0)
  const count = await cards(page).count()
  await expect(page.getByRole('status')).toHaveText(new RegExp(`^${count} of \\d+ projects$`))
})

test('choosing a stack from the combobox filters the list and the URL', async ({ page }) => {
  await page.goto('/work')
  const stack = page.getByRole('combobox', { name: 'Stack' })
  await stack.click()
  await stack.fill('fasta')
  await page.getByRole('option', { name: /^FastAPI/ }).click()
  await expect(page).toHaveURL('/work?stack=fastapi')
  await expect(cards(page)).toHaveText(['Fast-JiraQL'])
})

test('a domain chip filters the list and replaces the history entry', async ({ page }) => {
  await page.goto('/')
  await page.goto('/work')
  await page.getByRole('button', { name: /^Dashboards/ }).click()
  await expect(page).toHaveURL('/work?domain=dashboards')
  await expect(page.getByRole('button', { name: /^Dashboards/ })).toHaveAttribute('aria-pressed', 'true')
  await page.goBack()
  await expect(page).toHaveURL('/')
})
