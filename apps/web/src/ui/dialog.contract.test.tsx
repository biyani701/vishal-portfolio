import { describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { Button } from './button.tsx'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog.tsx'
import { clickOutside, expectTarget, settled, tabThrough } from '@/test/contract.ts'

function Fixture() {
  return (
    <>
      <button type="button">Before</button>
      <Dialog>
        <DialogTrigger render={<Button />}>Open dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send message</DialogTitle>
            <DialogDescription>We reply within two working days.</DialogDescription>
          </DialogHeader>
          <input aria-label="Name" />
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

async function open() {
  await render(<Fixture />)
  await page.getByRole('button', { name: 'Open dialog' }).click()
  const dialog = page.getByRole('dialog', { name: 'Send message' })
  await expect.element(dialog).toBeVisible()
  return dialog
}

describe('Dialog contract', () => {
  it('is named by its title and described by its description', async () => {
    const dialog = await open()
    await expect.element(dialog).toHaveAccessibleDescription('We reply within two working days.')
  })

  it('moves focus inside and traps Tab and Shift+Tab', async () => {
    const dialog = await open()
    const element = dialog.element()
    await vi.waitFor(() => expect(element.contains(document.activeElement)).toBe(true))

    for (const shift of [false, true]) {
      const visited = await tabThrough(6, shift)
      expect(visited.every((el) => element.contains(el))).toBe(true)
    }
  })

  it('closes on Escape and restores focus to the trigger', async () => {
    const dialog = await open()
    await userEvent.keyboard('{Escape}')
    await expect.element(dialog).not.toBeInTheDocument()
    await expect.element(page.getByRole('button', { name: 'Open dialog' })).toHaveFocus()
  })

  it('closes on an outside click', async () => {
    const dialog = await open()
    await clickOutside()
    await expect.element(dialog).not.toBeInTheDocument()
  })

  it('gives every control a 44px target', async () => {
    const dialog = await open()
    await settled()
    for (const button of dialog.getByRole('button').elements()) expectTarget(button)
  })

  it('gives the trigger a 44px target', async () => {
    await render(<Fixture />)
    expectTarget(page.getByRole('button', { name: 'Open dialog' }).element())
  })
})
