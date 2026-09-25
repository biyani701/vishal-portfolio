import { describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { Button } from './button.tsx'
import { Toaster, createToastManager } from './toast.tsx'
import { expectTarget, settled } from '@/test/contract.ts'

function Fixture({ manager }: { manager: ReturnType<typeof createToastManager> }) {
  return (
    <Toaster toastManager={manager}>
      <Button onClick={() => manager.add({ title: 'Copied', description: 'Code copied to the clipboard.' })}>
        Copy code
      </Button>
    </Toaster>
  )
}

const closeButton = () => document.querySelector<HTMLElement>('[data-slot="toast-close"]')!

async function showToast() {
  await render(<Fixture manager={createToastManager()} />)
  await page.getByRole('button', { name: 'Copy code' }).click()
  await expect.element(page.getByText('Code copied to the clipboard.')).toBeVisible()
  await settled()
}

describe('Toast contract', () => {
  it('shows the toast as a named, described dialog inside a labelled region', async () => {
    await showToast()
    await expect.element(page.getByRole('region', { name: /notification/i })).toBeInTheDocument()
    await expect
      .element(page.getByRole('dialog', { name: 'Copied' }))
      .toHaveAccessibleDescription('Code copied to the clipboard.')
  })

  it('is reachable from the keyboard with F6, which exposes the close button', async () => {
    await showToast()
    // Collapsed stacks hide the close button from assistive tech until the region is entered.
    expect(closeButton().getAttribute('aria-hidden')).toBe('true')
    await userEvent.keyboard('{F6}')
    expect(page.getByRole('region', { name: /notification/i }).element().contains(document.activeElement)).toBe(true)
    await expect.element(page.getByRole('button', { name: 'Close toast' })).toBeInTheDocument()
  })

  it('dismisses from the keyboard via its close button', async () => {
    await showToast()
    await userEvent.keyboard('{F6}')
    page.getByRole('button', { name: 'Close toast' }).element().focus()
    await userEvent.keyboard('{Enter}')
    await expect.element(page.getByText('Code copied to the clipboard.')).not.toBeInTheDocument()
  })

  it('dismisses with a pointer', async () => {
    await showToast()
    await userEvent.hover(page.getByText('Copied'))
    await page.getByRole('button', { name: 'Close toast' }).click()
    await expect.element(page.getByText('Code copied to the clipboard.')).not.toBeInTheDocument()
  })

  it('gives the close button a 44px target', async () => {
    await showToast()
    expectTarget(closeButton())
  })
})
