// Prerender (task 13.2; design.md "SEO of a client-rendered SPA"). After `vite build`, serve dist/, open every
// static route in headless Chromium, and save what the app rendered: the page's content inside #root and its
// title, description, canonical and social tags in <head>. Crawlers and link previews then see real content
// without running JavaScript; in the browser the app starts as usual and replaces the snapshot (main.tsx removes
// the prerendered head tags so the app's own ones win).
//
// Output:
// - dist/<route>.html for each route (e.g. dist/work/fast-jiraql.html), dist/index.html for Home
// - dist/app.html and dist/404.html: the untouched app shell, the SPA fallback for everything else
// - dist/sitemap.xml and dist/robots.txt
//
// Snapshots are taken at a desktop viewport in the light theme; CSS adapts them to other modes before the app runs.
// The one part whose DOM differs by mode, the header navigation, stays hidden until the app renders the right one
// (tokens.css, [data-prerendered-root]); the header's fixed height means nothing moves.

import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { preview } from 'vite'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = join(root, 'dist')
const SITE_URL = 'https://vishal.biyani.xyz'

const projectSlugs = readdirSync(join(root, 'content/projects'))
  .filter((file) => file.endsWith('.md'))
  .map((file) => file.slice(0, -3))
  .sort()

/** Every page with its own URL; query-string views (/work?stack=…) and redirects are left to the app. */
export const PRERENDER_ROUTES = [
  '/',
  '/work',
  ...projectSlugs.map((slug) => `/work/${slug}`),
  '/experience',
  '/about',
  '/ask',
  '/contact',
  '/colophon',
  '/legal/privacy',
  '/legal/terms',
]

/** The head tags a page renders through PageMeta. */
const HEAD_SELECTOR = 'title, meta[name="description"], meta[name="robots"], meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"]'

const escapeXml = (value) => value.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c])

/**
 * The template for prerendered pages. Their HTML is complete without JavaScript, so nothing should compete with the
 * first paint on a slow connection:
 * - the stylesheet is inlined, so styles arrive with the HTML rather than as a render-blocking request;
 * - the app starts once the page has painted: the entry module and its preloads are added after the first frame,
 *   instead of being fetched alongside the stylesheet and fonts.
 * The app shell (app.html, 404.html) keeps Vite's tags: without prerendered content it has nothing to paint first.
 */
export function pageTemplate(shell, readAsset) {
  const stylesheet = /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/.exec(shell)
  const entry = /<script type="module" crossorigin src="(\/assets\/[^"]+\.js)"><\/script>/.exec(shell)
  if (!stylesheet || !entry) throw new Error('dist/index.html: no stylesheet or entry module to rewrite')
  const preloads = [...shell.matchAll(/\s*<link rel="modulepreload" crossorigin href="([^"]+)">/g)]
  const modules = [...preloads.map((match) => match[1]), entry[1]]
  const loader = `<script>
      // Prerendered page: start the app after the first paint (scripts/prerender.mjs).
      addEventListener('DOMContentLoaded', () =>
        requestAnimationFrame(() =>
          setTimeout(() => {
            ${JSON.stringify(modules)}.forEach((src, i, all) => {
              const tag = document.createElement(i === all.length - 1 ? 'script' : 'link')
              if (i === all.length - 1) tag.type = 'module'
              else tag.rel = 'modulepreload'
              tag.crossOrigin = ''
              tag[i === all.length - 1 ? 'src' : 'href'] = src
              document.head.append(tag)
            })
          }),
        ),
      )
    </script>`
  const css = readAsset(stylesheet[1])
  if (/<\/style/i.test(css)) throw new Error(`${stylesheet[1]}: can't inline CSS that contains "</style"`)
  let page = shell.replace(stylesheet[0], () => `<style>${css}</style>`)
  for (const match of preloads) page = page.replace(match[0], '')
  return page.replace(entry[0], () => loader)
}

async function main() {
  const shell = readFileSync(join(dist, 'index.html'), 'utf8')
  if (!shell.includes('<div id="root"></div>')) throw new Error('dist/index.html is not the app shell (already prerendered?)')
  writeFileSync(join(dist, 'app.html'), shell)
  writeFileSync(join(dist, '404.html'), shell)
  const template = pageTemplate(shell, (path) => readFileSync(join(dist, path), 'utf8'))

  const server = await preview({ root, preview: { port: 0, strictPort: false, open: false }, logLevel: 'warn' })
  const base = server.resolvedUrls.local[0].replace(/\/$/, '')
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light', reducedMotion: 'reduce' })
  // No request leaves the build for the API (Ask, contact) or anything else off this server.
  await context.route((url) => !url.href.startsWith(base), (route) => route.abort())

  try {
    for (const path of PRERENDER_ROUTES) {
      const page = await context.newPage()
      await page.goto(`${base}${path}`, { waitUntil: 'networkidle' })
      await page.getByRole('heading', { level: 1 }).first().waitFor({ state: 'visible', timeout: 15_000 })
      await page.evaluate(() => document.fonts.ready)
      const { head, body, title } = await page.evaluate((selector) => {
        const tags = [...document.head.querySelectorAll(selector)].map((element) => {
          element.setAttribute('data-prerendered', '')
          return element.outerHTML
        })
        return { head: tags.join('\n    '), body: document.getElementById('root').innerHTML, title: document.title }
      }, HEAD_SELECTOR)
      if (!title || !body.includes('<h1')) throw new Error(`${path}: nothing rendered (title "${title}")`)

      const html = template.replace('</head>', `    ${head}\n  </head>`).replace('<div id="root"></div>', `<div id="root" data-prerendered-root>${body}</div>`)
      // /work → work.html, /work/fast-jiraql → work/fast-jiraql.html: served for the extensionless URL by GitHub
      // Pages and vite preview, without the /work → /work/ redirect a directory index would cause.
      const file = path === '/' ? join(dist, 'index.html') : join(dist, `${path.slice(1)}.html`)
      mkdirSync(dirname(file), { recursive: true })
      writeFileSync(file, html)
      console.log(`prerendered ${path} (${title})`)
      await page.close()
    }
  } finally {
    await browser.close()
    await new Promise((resolve) => server.httpServer.close(resolve))
  }

  const urls = PRERENDER_ROUTES.map((path) => `  <url><loc>${escapeXml(`${SITE_URL}${path}`)}</loc></url>`).join('\n')
  writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
  writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
  console.log(`prerendered ${PRERENDER_ROUTES.length} routes; wrote sitemap.xml and robots.txt`)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
