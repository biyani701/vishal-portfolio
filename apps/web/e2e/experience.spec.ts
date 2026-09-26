import { expect, test, type Page } from '@playwright/test'

// Task 7.1 in a real browser, at every viewport: the specs/content-pages "Deep link to a role" scenario and
// keyboard selection on whichever Programme Line form the layout mode shows.
const panel = (page: Page) => page.locator('[data-role-panel]')

async function expectPanelInView(page: Page) {
  await expect(panel(page)).toBeInViewport()
  const header = (await page.getByRole('banner').boundingBox())!
  await expect.poll(async () => (await panel(page).boundingBox())!.y).toBeGreaterThanOrEqual(header.y + header.height - 1)
}

test('/experience#bfs-uk selects the BFS UK role and brings it into view', async ({ page }) => {
  await page.goto('/experience#bfs-uk')
  await expect(panel(page)).toHaveAttribute('data-role-panel', 'bfs-uk')
  await expect(panel(page).getByRole('heading', { level: 2 })).toHaveText('Delivery Lead')
  await expect(page.locator('a[data-role="bfs-uk"]:visible')).toHaveAttribute('aria-current', 'true')
  await expectPanelInView(page)
})

test('a role chosen with the keyboard on the Programme Line fills the panel', async ({ page }) => {
  await page.goto('/experience')
  await expect(panel(page)).toHaveAttribute('data-role-panel', 'corecard')
  const ifc = page.locator('a[data-role="ifc"]:visible')
  await ifc.focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/experience#ifc$/)
  await expect(panel(page)).toHaveAttribute('data-role-panel', 'ifc')
  await expect(ifc).toHaveAttribute('aria-current', 'true')
  await expectPanelInView(page)
})

test('Earlier and Later step through the roles', async ({ page }) => {
  await page.goto('/experience#ifc')
  await panel(page).getByRole('link', { name: 'Later: BFS UK →' }).click()
  await expect(panel(page)).toHaveAttribute('data-role-panel', 'bfs-uk')
  await panel(page).getByRole('link', { name: '← Earlier: IFC' }).click()
  await expect(panel(page)).toHaveAttribute('data-role-panel', 'ifc')
})
