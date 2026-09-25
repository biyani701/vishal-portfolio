import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { milestones, organisations, roles } from '@/content/index.ts'
import { describeProgramme, fractionalYear } from './buildProgramme.ts'
import { ProgrammeLine } from './ProgrammeLine.tsx'

// Task 6.2. jsdom applies no layout-mode CSS, so every form is in the DOM here; e2e/programme.spec.ts checks
// which one each viewport shows. Unmeasured tracks use each form's typical width.
const now = fractionalYear(new Date(2026, 8, 25))
const summary = describeProgramme(organisations, roles, milestones)

function renderLine() {
  return render(
    <MemoryRouter>
      <ProgrammeLine now={now} />
    </MemoryRouter>,
  )
}

const figures = (container: HTMLElement) => [...container.querySelectorAll('figure')]

describe('ProgrammeLine', () => {
  it('gives every form the same aria-label summary', () => {
    const { container } = renderLine()
    // Lanes and span rows label their figure; compact landscape is one link to Experience.
    expect(screen.getAllByRole('figure', { name: summary })).toHaveLength(2)
    expect(screen.getByRole('link', { name: `${summary} Open Experience.` })).toHaveAttribute('href', '/experience')
    expect(figures(container)).toHaveLength(3)
  })

  it('links each lane segment to its role, named with its dates and status', () => {
    renderLine()
    const lanes = screen.getAllByRole('figure', { name: summary })[0]!
    const links = within(lanes).getAllByRole('link')
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/experience#tata-infotech',
      '/experience#jpmc',
      '/experience#ifc',
      '/experience#bfs-uk',
      '/experience#corecard',
    ])
    expect(within(lanes).getByRole('link', { name: 'CoreCard · Principal Project Analyst, Nov 2019 – now, In flight' })).toBeVisible()
    expect(within(lanes).getByRole('link', { name: 'BFS UK · Delivery Lead · 8 banks, Dec 2014 – Sep 2019, Delivered' })).toBeVisible()
  })

  it('has no per-segment targets in the compact landscape figure', () => {
    renderLine()
    const compact = screen.getByRole('link', { name: `${summary} Open Experience.` })
    expect(within(compact).queryAllByRole('link')).toHaveLength(0)
    expect(compact.querySelectorAll('[data-role]')).toHaveLength(roles.length)
  })

  it('draws one span row per engagement plus a milestone row, newest first', () => {
    renderLine()
    const rows = screen.getAllByRole('figure', { name: summary })[1]!
    const links = within(rows).getAllByRole('link')
    expect(links.map((link) => link.dataset.role)).toEqual(['corecard', 'bfs-uk', 'ifc', 'jpmc', 'tata-infotech', 'milestones'])
    // The 343px track fits full month ranges; only the current role is In flight.
    expect(links[0]).toHaveTextContent('Nov 2019 – now')
    expect(within(links[0]!).getByText('In flight')).toBeVisible()
    expect(links[1]).toHaveTextContent('Dec 2014 – Sep 2019Delivered')
  })

  it('clusters AWS 2020 and Manager of the Quarter 2021 on the mobile track but not on the lanes', () => {
    renderLine()
    const [lanes, rows] = screen.getAllByRole('figure', { name: summary })
    const sizes = (el: HTMLElement) => [...el.querySelectorAll<HTMLElement>('[data-cluster]')].map((c) => c.dataset.cluster)
    expect(sizes(lanes!)).toEqual(['1', '1', '1', '1'])
    expect(sizes(rows!)).toEqual(['1', '1', '2'])
    expect(rows!.querySelector('[data-cluster="2"]')).toHaveTextContent('◆2')
  })

  it('prints every milestone under the track', () => {
    renderLine()
    const list = screen.getByRole('list', { name: 'Milestones' })
    expect(within(list).getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      '◆ Guiding Star Q4 2009',
      '◆ Project of the Year 2013',
      '◆ AWS Solutions Architect Sep 2020',
      '◆ Manager of the Quarter Q3 2021',
    ])
  })

  it('switches to a period · engagement · status table and back', async () => {
    const user = userEvent.setup()
    const { container } = renderLine()
    await user.click(screen.getByRole('button', { name: 'View as table' }))

    const table = screen.getByRole('table', { name: /Career timeline/ })
    expect(figures(container)).toHaveLength(0)
    expect(within(table).getAllByRole('columnheader').map((th) => th.textContent)).toEqual(['Period', 'Engagement', 'Status'])
    const rows = within(table).getAllByRole('row').slice(1)
    expect(rows).toHaveLength(roles.length)
    expect(rows[0]).toHaveTextContent('Nov 2019 – nowCoreCard · Principal Project AnalystIn flight')
    expect(within(rows[4]!).getByRole('link', { name: 'Tata Infotech · Senior Software Engineer' })).toHaveAttribute(
      'href',
      '/experience#tata-infotech',
    )

    await user.click(screen.getByRole('button', { name: 'View as chart' }))
    expect(screen.queryByRole('table')).toBeNull()
    expect(figures(container)).toHaveLength(3)
  })
})
