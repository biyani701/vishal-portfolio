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
  { path: '/experience', name: 'experience' },
  { path: '/about', name: 'about' },
  { path: '/writing', name: 'writing' },
  { path: '/writing/ai-agents', name: 'article' },
  { path: '/knowledge', name: 'knowledge' },
  { path: '/knowledge/glossary', name: 'glossary' },
  { path: '/knowledge/credit-cards-payments/3ds-flow', name: 'knowledge topic' },
  { path: '/ask', name: 'ask' },
  { path: '/contact', name: 'contact' },
  { path: '/signin', name: 'sign in' },
  { path: '/colophon', name: 'colophon' },
  { path: '/legal/privacy', name: 'privacy' },
  { path: '/this/page/does-not-exist-anywhere-on-the-site', name: 'not found' },
]
