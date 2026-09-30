import { expect, test } from '../fixtures.ts'
import { routes } from '../routes.ts'

// Production smoke test (task 14.2; DEPLOY.md "Smoke test"): every page, the files crawlers and Ask read, a legacy
// redirect of each kind, and the site reaching the API across origins. Read-only: no message is sent and Ask is
// asked nothing.

const API_URL = process.env.SMOKE_API_URL ?? 'https://api.vishal.biyani.xyz'
const PRODUCTION_ORIGIN = 'https://vishal.biyani.xyz'

for (const { path, name } of routes) {
  test(`${name} (${path}) is served and renders`, async ({ page }) => {
    const response = await page.goto(path)
    // Unknown paths get GitHub Pages' 404.html, the app shell, which renders the not-found page.
    expect(response?.status()).toBe(name === 'not found' ? 404 : 200)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('banner')).toBeVisible()
  })
}

for (const file of ['/sitemap.xml', '/robots.txt', '/ai-context.json', '/search-index.json', '/runtime-config.js']) {
  test(`${file} is served`, async ({ request }) => {
    const response = await request.get(file)
    expect(response.status()).toBe(200)
    expect((await response.body()).length).toBeGreaterThan(0)
  })
}

const redirects = [
  ['/works', '/work'],
  ['/blogs/ai-agents', '/work/blog-platform'],
  ['/knowledge/glossary', '/work/knowledge-base'],
  ['/credits', '/colophon'],
  ['/signin', '/'],
] as const

for (const [from, to] of redirects) {
  test(`legacy ${from} lands on ${to}`, async ({ page }) => {
    await page.goto(from)
    await expect(page).toHaveURL(to)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
}

test('the contact form is ready to send', async ({ page }) => {
  await page.goto('/contact')
  await expect(page.getByLabel('Your email', { exact: true })).toBeEditable()
  await expect(page.getByRole('button', { name: 'Send message' })).toBeEnabled()
})

test('the API is healthy', async ({ request }) => {
  const response = await request.get(`${API_URL}/health`)
  expect(response.status()).toBe(200)
  expect(await response.json()).toMatchObject({ status: 'ok' })
})

test('the site can call the API from its own origin (CORS)', async ({ page, baseURL }) => {
  // The API only allows the production origin, so a preview or local run has nothing to check here.
  test.skip(new URL(baseURL!).origin !== PRODUCTION_ORIGIN, 'CORS is only open to the production origin')
  await page.goto('/')
  const status = await page.evaluate(async (api) => (await fetch(`${api}/health`)).status, API_URL)
  expect(status).toBe(200)
})
