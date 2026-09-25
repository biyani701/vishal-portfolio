import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AI_OUTPUT_ATTRIBUTE, Portrait } from './Portrait.tsx'

const portrait = <Portrait src="/portrait.jpg" alt="Vishal Biyani" />

function renderAt(path: string, ui = portrait) {
  return render(<MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>)
}

describe('Portrait (DD-4)', () => {
  const error = vi.spyOn(console, 'error').mockImplementation(() => {})
  afterEach(() => error.mockClear())

  it('renders in the Home hero with the §4.4 styling', () => {
    renderAt('/')
    const img = screen.getByRole('img', { name: 'Vishal Biyani' })
    expect(img).toBeVisible()
    for (const cls of ['aspect-4/5', 'rounded-md', 'outline-accent', 'outline-offset-6', 'dark:brightness-94']) {
      expect(img.className).toContain(cls)
    }
    expect(error).not.toHaveBeenCalled()
  })

  it.each(['/about', '/ask', '/work/fast-jiraql'])('is not shown on %s', (path) => {
    renderAt(path)
    expect(screen.queryByRole('img')).toBeNull()
    expect(error).toHaveBeenCalledWith(expect.stringContaining('Home-hero only'))
  })

  it('is not shown beside AI output, even on Home', () => {
    renderAt('/', <section {...{ [AI_OUTPUT_ATTRIBUTE]: '' }}>{portrait}</section>)
    expect(screen.queryByRole('img')).toBeNull()
    expect(error).toHaveBeenCalledWith(expect.stringContaining('beside AI output'))
  })
})
