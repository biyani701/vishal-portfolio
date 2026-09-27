import type { Locator, Page } from '@playwright/test'
import { expect, test } from './fixtures.ts'

// Task 6.3 (specs/content-pages "Home"; design package §7 "Home hero"): the sections in every layout mode.
type Mode = 'desktop' | 'tablet' | 'mobile' | 'compact-landscape'
const mode = () => test.info().project.metadata.mode as Mode

const hero = (page: Page) => page.getByRole('heading', { level: 1 })
const portrait = (page: Page) => page.getByRole('img', { name: /^Vishal Biyani/ })

async function inFirstScreen(page: Page, locator: Locator) {
  const box = (await locator.boundingBox())!
  expect(box.y + box.height, 'fits in the first screen').toBeLessThanOrEqual(page.viewportSize()!.height)
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await expect(hero(page)).toBeVisible()
})

test('shows every Home section', async ({ page }) => {
  const sections = ['Programme line', 'Selected work', 'Ask the portfolio', 'Independent projects', /Let's talk/]
  for (const name of sections) {
    const section = page.getByRole('region', { name })
    await section.scrollIntoViewIfNeeded()
    await expect(section).toBeVisible()
  }
  await expect(page.getByRole('region', { name: 'Selected work' }).getByRole('heading', { level: 3 })).toHaveCount(3)
})

test('the statement, both actions and the start of the Programme Line fit the first screen on desktop', async ({ page }) => {
  test.skip(page.viewportSize()!.width !== 1440, 'the specs/content-pages scenario is 1440×900')
  await inFirstScreen(page, hero(page))
  await inFirstScreen(page, page.getByRole('link', { name: 'See the work' }))
  await inFirstScreen(page, page.getByRole('link', { name: 'Ask about my experience' }))
  const line = (await page.getByRole('region', { name: 'Programme line' }).boundingBox())!
  expect(line.y, 'the Programme Line starts above the fold').toBeLessThan(page.viewportSize()!.height)
})

test('places the portrait for this mode', async ({ page }) => {
  const box = (await portrait(page).boundingBox())!
  const title = (await hero(page).boundingBox())!
  if (mode() === 'mobile') {
    // 104px, beside the role line, above the statement.
    expect(Math.round(box.width)).toBe(104)
    expect(box.y + box.height).toBeLessThanOrEqual(title.y)
  } else if (mode() === 'compact-landscape') {
    // 76px square in the right-hand pane.
    expect(Math.round(box.width)).toBe(76)
    expect(Math.round(box.height)).toBe(76)
    expect(box.x).toBeGreaterThan(title.x + title.width / 2)
  } else {
    // Beside the statement, in its own columns.
    expect(box.x).toBeGreaterThanOrEqual(title.x + title.width - 1)
  }
})

test('compact landscape moves the proof figures into the hero', async ({ page }) => {
  const ledger = page.getByRole('region', { name: 'Proof' })
  if (mode() === 'compact-landscape') {
    await expect(ledger).toBeHidden()
    await expect(page.getByText('25+').first()).toBeVisible()
  } else {
    await expect(ledger).toBeVisible()
  }
})

/**
 * Ask opened with a question (specs/ask-experience "Surfaces by mode"): a drawer over this page on mobile and
 * compact landscape, the /ask page elsewhere. Either way the question is asked and shown as a heading. Requests to
 * the Ask runtime are blocked, so the test never reaches the live service.
 */
async function expectAskAsked(page: Page, question: string, from: string, mode: string) {
  const drawer = mode === 'mobile' || mode === 'compact-landscape'
  const surface = drawer ? page.getByRole('dialog', { name: 'Ask' }) : page.getByRole('main')
  await expect(surface.getByRole('heading', { level: 2, name: question })).toBeVisible()
  if (drawer) await expect(page).toHaveURL(from)
  else await expect(page).toHaveURL('/ask')
}

test('the question input opens Ask with the question', async ({ page }) => {
  await page.route('**/ask/**', (route) => route.abort())
  const input = page.getByRole('textbox', { name: 'Your question' })
  await input.scrollIntoViewIfNeeded()
  await input.fill('Fixed price at scale?')
  await input.press('Enter')
  await expectAskAsked(page, 'Fixed price at scale?', '/', mode())
})
