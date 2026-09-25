import { render, screen } from '@testing-library/react'
import { Search } from 'lucide-react'
import { describe, expect, it } from 'vitest'
import { Icon } from './Icon.tsx'

describe('Icon', () => {
  it('uses a 1.75px stroke at the §4.4 sizes', () => {
    for (const [size, px] of [['sm', 16], ['md', 20], ['lg', 24]] as const) {
      const { container, unmount } = render(<Icon icon={Search} size={size} />)
      const svg = container.querySelector('svg')!
      expect(svg.getAttribute('width')).toBe(String(px))
      expect(svg.getAttribute('height')).toBe(String(px))
      // absoluteStrokeWidth keeps 1.75px regardless of size: 1.75 * 24 / px.
      expect(Number(svg.getAttribute('stroke-width'))).toBeCloseTo((1.75 * 24) / px)
      unmount()
    }
  })

  it('is decorative by default', () => {
    const { container } = render(<Icon icon={Search} />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('is announced when it carries meaning on its own', () => {
    render(<Icon icon={Search} label="Search" />)
    expect(screen.getByRole('img', { name: 'Search' })).toBeInTheDocument()
  })
})
