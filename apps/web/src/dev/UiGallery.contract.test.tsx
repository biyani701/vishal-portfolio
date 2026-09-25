import axe from 'axe-core'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { UiGallery } from './UiGallery.tsx'
import { settled } from '@/test/contract.ts'

// Task 2.6: axe finds no violations in the gallery, in both themes, at rest and with each overlay open
// (closed overlays can't be checked, so each one is opened in turn).
//
// Rules that are exempt, and only where stated:
// - html-has-lang, document-title: the test harness owns the document shell; index.html sets both for the app.
// - region (overlay scans only): popups portal to <body>, outside the page landmarks, by design; their own
//   roles (dialog, menu, listbox) identify them. At rest every piece of content must be in a landmark.
// - aria-hidden-focus, page-has-heading-one (listbox scans only): while a Combobox/Autocomplete list is open,
//   Base UI hides the rest of the page from assistive tech so the reader stays in the list, as native selects
//   do. Focus can't reach the hidden content: Tab closes the list first (autocomplete.contract.test.tsx).
type Exemption = 'overlay' | 'listbox'

async function violations(exempt: Exemption[] = []) {
  await settled()
  const off = (ids: string[]) => Object.fromEntries(ids.map((id) => [id, { enabled: false }]))
  const { violations } = await axe.run(document, {
    resultTypes: ['violations'],
    rules: {
      ...off(['html-has-lang', 'document-title']),
      ...(exempt.includes('overlay') ? off(['region']) : {}),
      ...(exempt.includes('listbox') ? off(['aria-hidden-focus', 'page-has-heading-one']) : {}),
    },
  })
  return violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)
}

const openButton = (name: string) => async () => {
  await page.getByRole('button', { name, exact: true }).click()
}
const typeInto = (name: string, text: string) => async () => {
  await page.getByRole('combobox', { name }).click()
  await userEvent.keyboard(text)
}

const OVERLAYS: [string, () => Promise<void>, Exemption[]][] = [
  ['Dialog', openButton('Dialog'), ['overlay']],
  ['Alert dialog', openButton('Alert dialog'), ['overlay']],
  ['Drawer', openButton('Drawer'), ['overlay']],
  ['Popover', openButton('Popover'), ['overlay']],
  ['Menu', openButton('Menu'), ['overlay']],
  ['Select', async () => page.getByRole('combobox', { name: 'Primary stack' }).click(), ['overlay', 'listbox']],
  ['Combobox', typeInto('Stack', 'p'), ['overlay', 'listbox']],
  ['Autocomplete', typeInto('Search the site', 'w'), ['overlay', 'listbox']],
]

const initialTheme = document.documentElement.dataset.theme
afterAll(() => {
  document.documentElement.dataset.theme = initialTheme
})

describe.each(['light', 'dark'] as const)('UiGallery in the %s theme', (theme) => {
  beforeEach(async () => {
    document.documentElement.dataset.theme = theme
    await render(<UiGallery />)
    await expect.element(page.getByRole('heading', { level: 1, name: 'Component gallery' })).toBeVisible()
  })

  it('has no axe violations at rest', async () => {
    expect(await violations()).toEqual([])
  })

  // axe doesn't test non-text contrast, so check WCAG 1.4.11 for form-control outlines directly.
  it('gives every form-control outline 3:1 against the page', async () => {
    const rgb = (color: string) => color.match(/[\d.]+/g)!.slice(0, 3).map(Number)
    const luminance = (color: string) => {
      const [r, g, b] = rgb(color).map((v) => (v / 255 <= 0.04045 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4))
      return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
    }
    const contrast = (a: string, b: string) => {
      const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
      return (hi! + 0.05) / (lo! + 0.05)
    }
    const page = getComputedStyle(document.documentElement).backgroundColor
    const controls = document.querySelectorAll(
      '[data-slot="input"], [data-slot="textarea"], [data-slot="input-group"], [data-slot="select-trigger"], [data-slot="checkbox"], [data-slot="radio-group-item"]',
    )
    expect(controls.length).toBeGreaterThanOrEqual(8)
    const outlined = [...controls].filter(
      (el) => !el.closest('[data-slot="input-group"]') || el.getAttribute('data-slot') === 'input-group',
    )
    const weak = outlined
      .map((el) => ({ slot: el.getAttribute('data-slot'), ratio: contrast(getComputedStyle(el).borderTopColor, page) }))
      .filter(({ ratio }) => ratio < 3)
    expect(weak).toEqual([])

    // And the outline is the border-control token itself, not an accidental fallback such as currentColor.
    const probe = document.createElement('span')
    probe.style.color = 'var(--color-border-control)'
    document.body.append(probe)
    const token = getComputedStyle(probe).color
    probe.remove()
    const offToken = outlined
      .filter((el) => el.getAttribute('aria-invalid') !== 'true' && !el.hasAttribute('data-checked'))
      .map((el) => ({ slot: el.getAttribute('data-slot'), color: getComputedStyle(el).borderTopColor }))
      .filter(({ color }) => color !== token)
    expect(offToken).toEqual([])
  })

  it.each(OVERLAYS)('has no axe violations with the %s open', async (_, open, exempt) => {
    await open()
    expect(await violations(exempt)).toEqual([])
  })
})
