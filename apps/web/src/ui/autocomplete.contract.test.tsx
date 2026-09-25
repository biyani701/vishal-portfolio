import { describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from './autocomplete.tsx'
import { clickOutside, expectTarget, isCoarsePointer, settled } from '@/test/contract.ts'

const PAGES = ['Experience', 'Work', 'Writing', 'Knowledge', 'Contact']

function Fixture() {
  return (
    <Autocomplete items={PAGES}>
      <AutocompleteInput aria-label="Search the site" placeholder="Search" />
      <AutocompleteContent>
        <AutocompleteEmpty>No matches</AutocompleteEmpty>
        <AutocompleteList>
          {(item: string) => (
            <AutocompleteItem key={item} value={item}>
              {item}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  )
}

const input = () => page.getByRole('combobox', { name: 'Search the site' })
const options = () => page.getByRole('option')
const highlighted = () => document.querySelector('[data-slot="autocomplete-item"][data-highlighted]')?.textContent

async function type(text: string) {
  await render(<Fixture />)
  await input().click()
  await userEvent.keyboard(text)
  await expect.element(input()).toHaveAttribute('aria-expanded', 'true')
}

describe('Autocomplete contract', () => {
  it('filters suggestions as the visitor types', async () => {
    await type('wr')
    expect(options().elements().map((o) => o.textContent)).toEqual(['Writing'])
  })

  it('shows the empty state when nothing matches', async () => {
    await type('zzz')
    await expect.element(page.getByText('No matches')).toBeVisible()
  })

  it('highlights with the arrow keys while focus stays in the input', async () => {
    await type('w')
    await userEvent.keyboard('{ArrowDown}')
    expect(highlighted()).toBe('Work')
    await userEvent.keyboard('{ArrowDown}')
    expect(highlighted()).toBe('Writing')
    await expect.element(input()).toHaveFocus()
    await expect.element(input()).toHaveAttribute('aria-activedescendant')
  })

  it('selects the highlighted suggestion with Enter', async () => {
    await type('w')
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}')
    await expect.element(input()).toHaveValue('Writing')
    await expect.element(page.getByRole('listbox')).not.toBeInTheDocument()
  })

  it('closes on Escape, keeping focus in the input', async () => {
    await type('w')
    await userEvent.keyboard('{Escape}')
    await expect.element(page.getByRole('listbox')).not.toBeInTheDocument()
    await expect.element(input()).toHaveFocus()
  })

  it('closes on an outside click', async () => {
    await type('w')
    await clickOutside('bottom-right')
    await expect.element(input()).toHaveAttribute('aria-expanded', 'false')
  })

  it('gives the input a 44px target, and options 44px on touch', async () => {
    await type('w')
    await settled()
    expectTarget(input().element())
    if (isCoarsePointer()) for (const option of options().elements()) expectTarget(option)
  })
})
