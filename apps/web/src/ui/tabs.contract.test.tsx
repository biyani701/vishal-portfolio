import { describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs.tsx'
import { expectTarget } from '@/test/contract.ts'

const TABS = ['Overview', 'Architecture', 'Outcome']

function Fixture() {
  return (
    <Tabs defaultValue="Overview">
      <TabsList>
        {TABS.map((tab) => (
          <TabsTrigger key={tab} value={tab}>
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      {TABS.map((tab) => (
        <TabsContent key={tab} value={tab}>
          {tab} panel
        </TabsContent>
      ))}
    </Tabs>
  )
}

const tab = (name: string) => page.getByRole('tab', { name })

describe('Tabs contract', () => {
  it('links each tab to its panel', async () => {
    await render(<Fixture />)
    await expect.element(tab('Overview')).toHaveAttribute('aria-selected', 'true')
    await expect.element(page.getByRole('tabpanel', { name: 'Overview' })).toHaveTextContent('Overview panel')
  })

  it('puts only the active tab in the Tab order', async () => {
    await render(<Fixture />)
    await userEvent.keyboard('{Tab}')
    await expect.element(tab('Overview')).toHaveFocus()
    await userEvent.keyboard('{Tab}')
    // The next stop is the panel, not the other tabs.
    expect(document.activeElement?.getAttribute('role')).toBe('tabpanel')
  })

  it('moves between tabs with the arrow keys, Home and End', async () => {
    await render(<Fixture />)
    tab('Overview').element().focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect.element(tab('Architecture')).toHaveFocus()
    await userEvent.keyboard('{End}')
    await expect.element(tab('Outcome')).toHaveFocus()
    await userEvent.keyboard('{Home}')
    await expect.element(tab('Overview')).toHaveFocus()
    await userEvent.keyboard('{ArrowLeft}')
    await expect.element(tab('Outcome')).toHaveFocus() // wraps
  })

  it('selects the tab that receives focus', async () => {
    await render(<Fixture />)
    tab('Overview').element().focus()
    await userEvent.keyboard('{ArrowRight}{Enter}')
    await expect.element(tab('Architecture')).toHaveAttribute('aria-selected', 'true')
    await expect.element(page.getByRole('tabpanel', { name: 'Architecture' })).toBeVisible()
  })

  it('gives every tab a 44px target', async () => {
    await render(<Fixture />)
    for (const name of TABS) expectTarget(tab(name).element())
  })
})
