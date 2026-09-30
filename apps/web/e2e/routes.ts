import { readdirSync } from 'node:fs'

// Every route the matrix visits (task 12.1): each page, every case study in content/projects, and the 404 page.
export interface MatrixRoute {
  path: string
  name: string
}

export const routes: MatrixRoute[] = [
  { path: '/', name: 'home' },
  { path: '/work', name: 'work' },
  ...caseStudies(),
  { path: '/experience', name: 'experience' },
  { path: '/about', name: 'about' },
  { path: '/ask', name: 'ask' },
  { path: '/contact', name: 'contact' },
  { path: '/colophon', name: 'colophon' },
  { path: '/legal/privacy', name: 'privacy' },
  { path: '/legal/terms', name: 'terms' },
  { path: '/this/page/does-not-exist-anywhere-on-the-site', name: 'not found' },
]

/** One route per content/projects/*.md, so a new case study joins the matrix without editing this file. */
function caseStudies(): MatrixRoute[] {
  return readdirSync(new URL('../content/projects/', import.meta.url))
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''))
    .sort()
    .map((slug) => ({ path: `/work/${slug}`, name: `case study ${slug}` }))
}
