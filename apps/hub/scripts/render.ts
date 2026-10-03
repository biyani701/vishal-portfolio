import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { checkConfidential, ConfidentialityError } from '@vishal/content-guard'

// The last build step (openspec add-biyani-hub, D1 and D3): render the page into dist/index.html, stamp the build id
// that the production smoke test looks for, run the confidentiality guard over the content and the final HTML, and
// add .nojekyll so GitHub Pages serves the files as they are.

const dist = new URL('../dist/', import.meta.url)
const ssr = new URL('../dist-ssr/entry-server.js', import.meta.url)
const content = new URL('../content/sites.ts', import.meta.url)

const { render } = (await import(ssr.href)) as { render: (year: number) => string }
const build = process.env.GITHUB_SHA ?? `local-${new Date().toISOString()}`

const template = readFileSync(new URL('index.html', dist), 'utf8')
if (!template.includes('<!--hub-->')) throw new Error('dist/index.html: the <!--hub--> placeholder is missing')
const html = template.replace('<!--hub-->', render(new Date().getFullYear())).replace('%HUB_BUILD%', build)

try {
  checkConfidential('content/sites.ts', readFileSync(content, 'utf8'))
  checkConfidential('dist/index.html', html)
} catch (error) {
  if (error instanceof ConfidentialityError) {
    console.error(error.message)
    process.exit(1)
  }
  throw error
}

writeFileSync(new URL('index.html', dist), html)
writeFileSync(new URL('.nojekyll', dist), '')
rmSync(new URL('../dist-ssr/', import.meta.url), { recursive: true, force: true })
console.log(`rendered dist/index.html (build ${build})`)
