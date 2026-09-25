import { describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { Button } from './button.tsx'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu.tsx'
import { clickOutside, expectTarget, isCoarsePointer, settled } from '@/test/contract.ts'

const ITEMS = ['Account', 'Theme', 'Sign out']

function Fixture({ onSelect = () => {} }: { onSelect?: (item: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>Account menu</DropdownMenuTrigger>
      <DropdownMenuContent>
        {ITEMS.map((item) => (
          <DropdownMenuItem key={item} onClick={() => onSelect(item)}>
            {item}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const focusedText = () => document.activeElement?.textContent?.trim()
const expectFocused = (text: string) => vi.waitFor(() => expect(focusedText()).toBe(text))

async function openWithKeyboard() {
  await render(<Fixture />)
  const trigger = page.getByRole('button', { name: 'Account menu' })
  trigger.element().focus()
  await userEvent.keyboard('{Enter}')
  const menu = page.getByRole('menu')
  await expect.element(menu).toBeVisible()
  return { trigger, menu }
}

describe('Menu contract', () => {
  it('opens from the keyboard with focus on the first item', async () => {
    const { trigger } = await openWithKeyboard()
    await expect.element(trigger).toHaveAttribute('aria-expanded', 'true')
    await expectFocused('Account')
  })

  it('moves through items with the arrow keys, Home and End', async () => {
    await openWithKeyboard()
    await expectFocused('Account')
    await userEvent.keyboard('{ArrowDown}')
    await expectFocused('Theme')
    await userEvent.keyboard('{End}')
    await expectFocused('Sign out')
    await userEvent.keyboard('{Home}')
    await expectFocused('Account')
    await userEvent.keyboard('{ArrowUp}')
    await expectFocused('Sign out') // wraps
  })

  it('activates an item with Enter and closes', async () => {
    const onSelect = vi.fn()
    await render(<Fixture onSelect={onSelect} />)
    page.getByRole('button', { name: 'Account menu' }).element().focus()
    await userEvent.keyboard('{Enter}')
    await expectFocused('Account')
    await userEvent.keyboard('{ArrowDown}{Enter}')
    expect(onSelect).toHaveBeenCalledWith('Theme')
    await expect.element(page.getByRole('menu')).not.toBeInTheDocument()
  })

  it('closes on Escape and restores focus to the trigger', async () => {
    const { trigger, menu } = await openWithKeyboard()
    await userEvent.keyboard('{Escape}')
    await expect.element(menu).not.toBeInTheDocument()
    await expect.element(trigger).toHaveFocus()
  })

  it('closes on an outside click', async () => {
    const { menu } = await openWithKeyboard()
    await clickOutside()
    await expect.element(menu).not.toBeInTheDocument()
  })

  it('gives the trigger a 44px target, and items 44px on touch', async () => {
    const { trigger, menu } = await openWithKeyboard()
    await settled()
    expectTarget(trigger.element())
    if (isCoarsePointer()) {
      for (const item of menu.getByRole('menuitem').elements()) expectTarget(item)
    }
  })
})
