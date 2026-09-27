import type { Page } from '@playwright/test'
import { expect, test } from './fixtures.ts'

// Design package §4.2 fonts, self-hosted from /fonts (src/design/fonts.css).
const FACES = [
  { family: 'Bricolage Grotesque', probe: '600 16px "Bricolage Grotesque"' },
  { family: 'Newsreader', probe: '400 18px "Newsreader"' },
  { family: 'Newsreader', probe: 'italic 400 18px "Newsreader"' },
  { family: 'JetBrains Mono', probe: '400 12px "JetBrains Mono"' },
]

/** Status of each face that `probe` resolves to; a failed download rejects, which counts as 'error'. */
const loadFace = (page: Page, probe: string) =>
  page.evaluate(async (font) => {
    try {
      return (await document.fonts.load(font, 'Aa')).map((face) => face.status)
    } catch {
      return ['error']
    }
  }, probe)

test('serves every face from our own origin', async ({ page, baseURL }) => {
  const fontRequests: string[] = []
  page.on('request', (request) => {
    if (request.resourceType() === 'font') fontRequests.push(request.url())
  })

  await page.goto('/')
  for (const { probe } of FACES) {
    expect(await loadFace(page, probe), probe).toEqual(['loaded'])
  }

  expect(fontRequests.length).toBeGreaterThan(0)
  for (const url of fontRequests) expect(url.startsWith(`${baseURL}/fonts/`), url).toBe(true)
})

test('preloads the latin file of each face above the fold, and nothing the CSS would not use', async ({ page }) => {
  await page.goto('/')
  const hrefs = await page.locator('link[rel="preload"][as="font"]').evaluateAll((links) => links.map((link) => link.getAttribute('href')!))
  expect(hrefs).toHaveLength(3)

  const faces = await page.evaluate(() =>
    [...document.styleSheets].flatMap((sheet) =>
      [...sheet.cssRules].filter((rule) => rule instanceof CSSFontFaceRule).map((rule) => rule.cssText),
    ),
  )
  const families = []
  for (const href of hrefs) {
    const response = await page.request.get(href)
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('font/woff2')
    // Each preloaded file is the src of a latin @font-face in the served CSS, or the browser would fetch a second
    // file and the preload would be wasted.
    const face = faces.filter((rule) => rule.includes(`url("${href}")`))
    expect(face, href).toHaveLength(1)
    expect(face[0]).toMatch(/unicode-range: U\+0-FF|unicode-range: U\+0000-00FF/i)
    expect(face[0]).toContain('font-style: normal')
    families.push(/font-family: "?([^";]+?)"?;/.exec(face[0]!)![1])
  }
  expect(families.sort()).toEqual(['Bricolage Grotesque', 'JetBrains Mono', 'Newsreader'])
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('font-family', /^"Bricolage Grotesque"/)
})

test.describe('with font files blocked', () => {
  test.use({ viewport: { width: 320, height: 568 } })

  test('renders text immediately in the fallback stack without overflow', async ({ page }) => {
    await page.route('**/fonts/*.woff2', (route) => route.abort())
    await page.goto('/')

    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
    await expect(heading).toHaveText('I lead delivery. I build tools. I explain payments.')
    expect((await heading.boundingBox())!.height).toBeGreaterThan(0)

    // The web font failed, so the browser is painting with the fallback families from tokens.css.
    for (const { probe } of FACES) expect(await loadFace(page, probe), probe).toEqual(['error'])
    expect(await page.evaluate(() => document.fonts.check('600 16px "Bricolage Grotesque"'))).toBe(false)

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(320)
  })
})
