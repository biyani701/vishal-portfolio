import { expect, test, type Page } from '@playwright/test'

// Task 6.2 (design package §6): the Programme Line on Home picks its form by layout mode, never scrolls
// the page sideways, and keeps mobile span rows at least 56px tall. Runs in every matrix viewport; the
// acceptance viewports are 320×568, 375×667, 390×844 and 844×390.

type Mode = 'desktop' | 'tablet' | 'mobile' | 'compact-landscape'
const mode = () => test.info().project.metadata.mode as Mode

const section = (page: Page) => page.getByRole('region', { name: 'Programme line' })
// Every form is in the DOM (the others are display:none), so they're found by data-form, not by role.
const form = (page: Page, name: 'lanes' | 'compact' | 'rows') => section(page).locator(`[data-form="${name}"]`)
const shownForm = { desktop: 'lanes', tablet: 'lanes', mobile: 'rows', 'compact-landscape': 'compact' } as const

async function expectNoOverflow(page: Page) {
  const width = page.viewportSize()!.width
  const scrollWidth = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth))
  expect(scrollWidth, `scrollWidth ${scrollWidth}px exceeds the ${width}px viewport`).toBeLessThanOrEqual(width)
  const box = (await section(page).boundingBox())!
  expect(box.x + box.width).toBeLessThanOrEqual(width)
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await expect(section(page)).toBeVisible()
})

test('shows the form for this layout mode', async ({ page }) => {
  for (const name of ['lanes', 'compact', 'rows'] as const) {
    if (name === shownForm[mode()]) await expect(form(page, name), name).toBeVisible()
    else await expect(form(page, name), name).toBeHidden()
  }
})

test('does not overflow the viewport, as a chart or as a table', async ({ page }) => {
  await expectNoOverflow(page)
  await section(page).getByRole('button', { name: 'View as table' }).click()
  await expect(section(page).getByRole('table')).toBeVisible()
  await expectNoOverflow(page)
})

test('mobile span rows are each one target at least 56px tall', async ({ page }) => {
  test.skip(mode() !== 'mobile', 'span rows are the mobile form')
  const rows = form(page, 'rows').getByRole('link')
  await expect(rows).toHaveCount(6)
  for (const row of await rows.all()) {
    const box = (await row.boundingBox())!
    expect(box.height, `${await row.textContent()} row height`).toBeGreaterThanOrEqual(56)
    expect(box.width).toBeLessThanOrEqual(page.viewportSize()!.width)
  }
  // AWS 2020 and Manager of the Quarter 2021 merge on phone-width tracks (§6.4).
  await expect(form(page, 'rows').locator('[data-cluster="2"]')).toHaveText('◆2')
})

test('compact landscape lanes fit IFC inside its segment from 844px', async ({ page }) => {
  test.skip(mode() !== 'compact-landscape' || page.viewportSize()!.width < 844, 'validated at 844×390 and wider')
  const segments = form(page, 'compact').locator('[data-role]')
  await expect(segments).toHaveCount(5)
  for (const role of ['jpmc', 'ifc', 'bfs-uk', 'corecard']) {
    await expect(segments.and(page.locator(`[data-role="${role}"]`))).not.toBeEmpty()
  }
})

test('labels beside a segment never overlap another segment', async ({ page }) => {
  test.skip(mode() === 'mobile', 'span rows put the title above the track')
  const lanes = form(page, shownForm[mode()])
  const boxes = async (selector: string) =>
    Promise.all((await lanes.locator(selector).all()).map(async (el) => (await el.boundingBox())!))
  const segments = await boxes('[data-role]')
  for (const label of await boxes('[data-label="outside"]')) {
    for (const segment of segments) {
      const overlaps =
        label.x < segment.x + segment.width && segment.x < label.x + label.width &&
        label.y < segment.y + segment.height && segment.y < label.y + label.height
      expect(overlaps, `outside label at x=${label.x} overlaps a segment at x=${segment.x}`).toBe(false)
    }
  }
})
