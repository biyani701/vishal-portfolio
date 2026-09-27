import axe from 'axe-core'
import { afterAll, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { expectTarget, settled } from '@/test/contract.ts'
import { ContactForm } from './ContactForm.tsx'

// Task 10.4 in a real browser with the Programme CSS: no axe violations in either theme, at rest, with every
// field in error and with the failure alert; every control is a 44px target.

async function violations() {
  await settled()
  const { violations } = await axe.run(document, {
    resultTypes: ['violations'],
    rules: { 'html-has-lang': { enabled: false }, 'document-title': { enabled: false } },
  })
  return violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)
}

const initialTheme = document.documentElement.dataset.theme
afterAll(() => {
  document.documentElement.dataset.theme = initialTheme
})

describe.each(['light', 'dark'] as const)('Contact form in the %s theme', (theme) => {
  it('has no axe violations at rest, with errors, and with the failure alert', async () => {
    document.documentElement.dataset.theme = theme
    await render(
      <main>
        {/* The page's heading (routes/contact.tsx); the form sits under it. */}
        <h1>Contact</h1>
        <ContactForm send={async () => ({ ok: false, kind: 'unavailable' })} />
      </main>,
    )
    expect(await violations()).toEqual([])

    await page.getByRole('button', { name: 'Send message' }).click()
    await expect.element(page.getByText('Choose what this is about')).toBeVisible()
    expect(await violations()).toEqual([])

    await page.getByRole('radio', { name: 'A role' }).click()
    await page.getByLabelText('Your name', { exact: true }).fill('Ada')
    await page.getByLabelText('Your email', { exact: true }).fill('ada@example.com')
    await page.getByLabelText('Message', { exact: true }).fill('Hello')
    await page.getByRole('button', { name: 'Send message' }).click()
    await expect.element(page.getByRole('alert')).toBeVisible()
    expect(await violations()).toEqual([])

    for (const control of document.querySelectorAll('main button, main [role="radio"]')) expectTarget(control.closest('label') ?? control)
  })
})
