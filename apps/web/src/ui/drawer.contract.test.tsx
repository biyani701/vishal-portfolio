import { describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { Button } from './button.tsx'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer.tsx'
import { clickOutside, expectTarget, settled, tabThrough } from '@/test/contract.ts'

function Fixture() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button />}>Open menu</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
          <DrawerDescription>Jump to a section.</DrawerDescription>
        </DrawerHeader>
        <nav className="flex flex-col gap-2 p-4">
          <a href="#work">Work</a>
          <a href="#writing">Writing</a>
        </nav>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

async function open() {
  await render(<Fixture />)
  await page.getByRole('button', { name: 'Open menu' }).click()
  const drawer = page.getByRole('dialog', { name: 'Navigation' })
  await expect.element(drawer).toBeVisible()
  return drawer
}

describe('Drawer contract', () => {
  it('is a named, described modal dialog', async () => {
    const drawer = await open()
    await expect.element(drawer).toHaveAccessibleDescription('Jump to a section.')
  })

  it('moves focus inside and traps Tab and Shift+Tab', async () => {
    const drawer = await open()
    const element = drawer.element()
    await vi.waitFor(() => expect(element.contains(document.activeElement)).toBe(true))
    for (const shift of [false, true]) {
      const escaped = (await tabThrough(5, shift)).filter((el) => !element.contains(el))
      expect(escaped.map((el) => el.outerHTML.slice(0, 120)), `focus left the drawer (shift=${shift})`).toEqual([])
    }
  })

  it('closes on Escape and restores focus to the trigger', async () => {
    const drawer = await open()
    await userEvent.keyboard('{Escape}')
    await expect.element(drawer).not.toBeInTheDocument()
    await expect.element(page.getByRole('button', { name: 'Open menu' })).toHaveFocus()
  })

  it('closes on an outside click', async () => {
    const drawer = await open()
    await settled()
    await clickOutside()
    await expect.element(drawer).not.toBeInTheDocument()
  })

  it('gives the trigger and close button 44px targets', async () => {
    await render(<Fixture />)
    expectTarget(page.getByRole('button', { name: 'Open menu' }).element())
    await page.getByRole('button', { name: 'Open menu' }).click()
    await settled()
    expectTarget(page.getByRole('button', { name: 'Close' }).element())
  })
})
