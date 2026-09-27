import type { Page } from '@playwright/test'
import { expect, test } from './fixtures.ts'

// Task 10.4 (specs/contact): the success and failure flows in every layout mode, against a mocked POST /contact.

/** Mocks the API's POST /contact only; the page's own /contact navigation goes through. */
async function mockContact(page: Page, respond: (body: Record<string, unknown>) => { status: number; body: unknown; headers?: Record<string, string> }) {
  await page.route('**/contact', async (route) => {
    if (route.request().method() !== 'POST') return route.fallback()
    const { status, body, headers } = respond(route.request().postDataJSON() as Record<string, unknown>)
    await route.fulfill({ status, contentType: 'application/json', headers, body: JSON.stringify(body) })
  })
}

async function fill(page: Page) {
  await page.getByRole('radio', { name: 'A programme or engagement' }).click()
  await page.getByLabel('Your name', { exact: true }).fill('Ada Lovelace')
  await page.getByLabel('Your email', { exact: true }).fill('ada@example.com')
  await page.getByLabel('Message', { exact: true }).fill('Could we talk about a delivery programme?')
}

test('a message the service acknowledges replaces the form with a confirmation', async ({ page }) => {
  let body: Record<string, unknown> | undefined
  await mockContact(page, (sent) => ((body = sent), { status: 201, body: { status: 'received' } }))
  await page.goto('/contact')
  await fill(page)
  await page.getByRole('button', { name: 'Send message' }).click()

  const status = page.getByRole('status')
  await expect(status.getByRole('heading', { name: 'Message sent' })).toBeFocused()
  await expect(status).toContainText('Vishal will reply to ada@example.com')
  expect(body).toMatchObject({ intent: 'engagement', name: 'Ada Lovelace', email: 'ada@example.com', source: 'page', website: '' })
})

test('a failed send keeps every value and Try again resubmits', async ({ page }) => {
  let calls = 0
  await mockContact(page, () => (++calls === 1 ? { status: 503, body: { error: 'unavailable' } } : { status: 201, body: { status: 'received' } }))
  await page.goto('/contact')
  await fill(page)
  await page.getByRole('button', { name: 'Send message' }).click()

  await expect(page.getByRole('alert')).toContainText('Nothing was sent')
  await expect(page.getByLabel('Message', { exact: true })).toHaveValue('Could we talk about a delivery programme?')
  await page.getByRole('button', { name: 'Try again' }).click()
  await expect(page.getByRole('status').getByRole('heading', { name: 'Message sent' })).toBeVisible()
  expect(calls).toBe(2)
})

test('a rate-limited send says when to try again and keeps the message', async ({ page }) => {
  await mockContact(page, () => ({ status: 429, headers: { 'Retry-After': '1800' }, body: { error: 'rate_limited', retryAfterSeconds: 1800 } }))
  await page.goto('/contact')
  await fill(page)
  await page.getByRole('button', { name: 'Send message' }).click()
  await expect(page.getByRole('alert')).toContainText('Try again in about 30 minutes')
  await expect(page.getByLabel('Your name', { exact: true })).toHaveValue('Ada Lovelace')
})

test('a missing email is reported on the field and focused', async ({ page }) => {
  await page.goto('/contact')
  await page.getByRole('radio', { name: 'A role' }).click()
  await page.getByLabel('Your name', { exact: true }).fill('Ada Lovelace')
  await page.getByLabel('Message', { exact: true }).fill('Hello')
  await page.getByRole('button', { name: 'Send message' }).click()
  await expect(page.getByText('Enter an email address so he can reply')).toBeVisible()
  await expect(page.getByLabel('Your email', { exact: true })).toBeFocused()
})
