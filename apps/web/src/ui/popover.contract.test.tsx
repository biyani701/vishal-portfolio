import { describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { Button } from './button.tsx'
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from './popover.tsx'
import { clickOutside, expectTarget } from '@/test/contract.ts'

function Fixture() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>Define term</PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>3-D Secure</PopoverTitle>
          <PopoverDescription>Card-holder authentication for online payments.</PopoverDescription>
        </PopoverHeader>
        <a href="#glossary">Open in glossary</a>
      </PopoverContent>
    </Popover>
  )
}

async function open() {
  await render(<Fixture />)
  const trigger = page.getByRole('button', { name: 'Define term' })
  await trigger.click()
  const popover = page.getByRole('dialog', { name: '3-D Secure' })
  await expect.element(popover).toBeVisible()
  return { trigger, popover }
}

describe('Popover contract', () => {
  it('reports its state on the trigger and is named by its title', async () => {
    const { trigger } = await open()
    await expect.element(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('moves focus into the popup', async () => {
    const { popover } = await open()
    await vi.waitFor(() => expect(popover.element().contains(document.activeElement)).toBe(true))
  })

  it('closes on Escape and restores focus to the trigger', async () => {
    const { trigger, popover } = await open()
    await userEvent.keyboard('{Escape}')
    await expect.element(popover).not.toBeInTheDocument()
    await expect.element(trigger).toHaveFocus()
    await expect.element(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes on an outside click', async () => {
    const { popover } = await open()
    await clickOutside()
    await expect.element(popover).not.toBeInTheDocument()
  })

  it('gives the trigger a 44px target', async () => {
    await render(<Fixture />)
    expectTarget(page.getByRole('button', { name: 'Define term' }).element())
  })
})
