// Every route the matrix visits. Each phase appends the routes it adds (P3: the shell's placeholder routes
// and the 404 page; P6+ replace the placeholders with the real sections).
export interface MatrixRoute {
  path: string
  name: string
}

export const routes: MatrixRoute[] = [
  { path: '/', name: 'home' },
  { path: '/work', name: 'work' },
  { path: '/work/fast-jiraql', name: 'case study' },
  { path: '/work/confluence-pages-details', name: 'case study with code' },
  { path: '/experience', name: 'experience' },
  { path: '/about', name: 'about' },
  { path: '/ask', name: 'ask' },
  { path: '/contact', name: 'contact' },
  { path: '/colophon', name: 'colophon' },
  { path: '/legal/privacy', name: 'privacy' },
  { path: '/this/page/does-not-exist-anywhere-on-the-site', name: 'not found' },
]
