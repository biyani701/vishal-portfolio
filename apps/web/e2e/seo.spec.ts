import { expect, test } from '@playwright/test'

// Task 13.2: prerendered HTML carries each page's content and metadata before any JavaScript runs; the sitemap and
// robots.txt list the pages; in the browser each page has exactly one title and description, including after an
// in-app navigation. Checked once (desktop): the files are the same for every viewport.

test.beforeEach(() => {
  test.skip(test.info().project.name !== 'desktop-1440x900', 'The built files are the same for every viewport')
})

const PAGES: [path: string, h1: string, title: string][] = [
  ['/', 'I lead delivery', 'Vishal Biyani · Technical Program Manager · Delivery Director'],
  ['/work', 'Work', 'Work · Vishal Biyani'],
  ['/work/fast-jiraql', 'Fast-JiraQL', 'Fast-JiraQL · Vishal Biyani'],
  ['/experience', 'Experience', 'Experience · Vishal Biyani'],
  ['/contact', 'Contact', 'Contact · Vishal Biyani'],
  ['/legal/privacy', 'Privacy policy', 'Privacy policy · Vishal Biyani'],
]

for (const [path, h1, title] of PAGES) {
  test(`${path} is prerendered with its content and metadata`, async ({ request }) => {
    const res = await request.get(path)
    expect(res.status()).toBe(200)
    const html = await res.text()
    expect(html).toMatch(new RegExp(`<h1[^>]*>[^]*?${h1}`))
    expect(html).toContain(`<title data-prerendered="">${title}</title>`)
    expect(html).toContain(`<link rel="canonical" href="https://vishal.biyani.xyz${path === '/' ? '/' : path}" data-prerendered="">`)
    expect(html).toMatch(/<meta name="description" content="[^"]{20,}" data-prerendered="">/)
    expect(html).toContain('<meta property="og:image" content="https://vishal.biyani.xyz/images/portrait.jpg" data-prerendered="">')
  })
}

test('the sitemap lists every page and robots.txt points to it', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text()
  for (const path of ['/', '/work', '/work/fast-jiraql', '/experience', '/about', '/ask', '/contact', '/colophon', '/legal/privacy', '/legal/terms']) {
    expect(sitemap).toContain(`<loc>https://vishal.biyani.xyz${path}</loc>`)
  }
  expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap: https://vishal.biyani.xyz/sitemap.xml')
})

test('the fallback shell is not a prerendered page', async ({ request }) => {
  for (const file of ['/app.html', '/404.html']) {
    const html = await (await request.get(file)).text()
    expect(html).toContain('<div id="root"></div>')
    expect(html).not.toContain('data-prerendered')
  }
})

test('in the browser each page has one title and description, also after navigating', async ({ page }) => {
  await page.goto('/work/fast-jiraql')
  await expect(page).toHaveTitle('Fast-JiraQL · Vishal Biyani')
  await expect(page.locator('head title')).toHaveCount(1)
  await expect(page.locator('head meta[name="description"]')).toHaveCount(1)
  await expect(page.locator('[data-prerendered]')).toHaveCount(0)

  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Experience' }).click()
  await expect(page).toHaveTitle('Experience · Vishal Biyani')
  await expect(page.locator('head title')).toHaveCount(1)
  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', 'https://vishal.biyani.xyz/experience')
})

test('the 404 page asks not to be indexed', async ({ page }) => {
  await page.goto('/no/such/page')
  await expect(page.locator('head meta[name="robots"]')).toHaveAttribute('content', 'noindex')
  await expect(page.locator('head link[rel="canonical"]')).toHaveCount(0)
})
