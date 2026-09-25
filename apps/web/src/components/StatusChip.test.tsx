import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { StatusChip, type StatusChipProps } from './StatusChip.tsx'

const cases: [StatusChipProps, string][] = [
  [{ status: 'delivered', period: '2019–2023' }, 'Delivered · 2019–2023'],
  [{ status: 'in-flight' }, 'In flight'],
  [{ status: 'done' }, 'Done'],
  [{ status: 'answer-complete', sources: 3 }, 'Answer complete · 3 sources'],
  [{ status: 'answer-complete', sources: 1 }, 'Answer complete · 1 source'],
  [{ status: 'selected' }, 'Selected'],
]

describe('StatusChip', () => {
  it.each(cases)('always carries text: %o → %s', (props, text) => {
    const { container } = render(<StatusChip {...props} />)
    expect(container.textContent).toBe(text)
  })

  it('reserves amber for "In flight"', () => {
    const all: StatusChipProps[] = [...cases.map(([props]) => props), { status: 'failed', onRetry: () => {} }]
    for (const props of all) {
      const { container, unmount } = render(<StatusChip {...props} />)
      const amber = /flight-/.test(container.innerHTML)
      expect(amber, props.status).toBe(props.status === 'in-flight')
      unmount()
    }
  })

  it('marks "In flight" with a decorative dot as well as text', () => {
    const { container } = render(<StatusChip status="in-flight" />)
    const dot = container.querySelector('[aria-hidden="true"]')
    expect(dot?.className).toContain('bg-flight-dot')
  })

  it('pairs "Failed" with a retry action', async () => {
    const onRetry = vi.fn()
    render(<StatusChip status="failed" onRetry={onRetry} />)
    expect(screen.getByText('Failed')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
