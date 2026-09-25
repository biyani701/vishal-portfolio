import { createBrowserRouter, type RouteObject } from 'react-router'
import { AppShell } from './layout/AppShell.tsx'
import { redirectRoutes } from './layout/redirects.ts'
import type { PlaceholderHandle } from './routes/placeholder.tsx'

// Rendered in place of a lazy route while its module loads on first visit.
const blank = () => null
const placeholder = () => import('./routes/placeholder.tsx')

// Sections not built yet; each phase swaps its entries for the real route module.
const placeholders: [path: string, handle: PlaceholderHandle][] = [
  ['/work', { title: 'Work', phase: 'P8' }],
  ['/work/:slug', { title: 'Case study', phase: 'P8' }],
  ['/experience', { title: 'Experience', phase: 'P7' }],
  ['/about', { title: 'About', phase: 'P7' }],
  ['/writing', { title: 'Writing', phase: 'P9' }],
  ['/writing/:slug', { title: 'Article', phase: 'P9' }],
  ['/knowledge', { title: 'Knowledge', phase: 'P9' }],
  ['/knowledge/glossary', { title: 'Glossary', phase: 'P9' }],
  ['/knowledge/:domain', { title: 'Knowledge domain', phase: 'P9' }],
  ['/knowledge/:domain/:topic', { title: 'Knowledge topic', phase: 'P9' }],
  ['/ask', { title: 'Ask', phase: 'P11' }],
  ['/contact', { title: 'Contact', phase: 'P10' }],
  ['/signin', { title: 'Sign in', phase: 'P5' }],
  ['/account', { title: 'Account', phase: 'P5' }],
  ['/colophon', { title: 'Colophon', phase: 'P5' }],
  ['/legal/privacy', { title: 'Privacy policy', phase: 'P5' }],
  ['/legal/terms', { title: 'Terms of use', phase: 'P5' }],
]

// Data-mode routes; each section is a lazily loaded route module (design.md A2), rendered inside the AppShell.
export const routes: RouteObject[] = [
  {
    Component: AppShell,
    children: [
      { index: true, lazy: () => import('./routes/home.tsx'), HydrateFallback: blank },
      ...placeholders.map(([path, handle]) => ({ path, handle, lazy: placeholder, HydrateFallback: blank })),
      ...redirectRoutes,
      // Unknown paths, including /_dev in production builds (specs/site-navigation "Developer routes").
      { path: '*', lazy: () => import('./routes/not-found.tsx'), HydrateFallback: blank },
    ],
  },
  // D-5: one dev-only /_dev area. import.meta.env.DEV is false in production builds, so these routes and
  // their modules are dropped from the bundle.
  ...(import.meta.env.DEV ? [{ path: '/_dev/ui', lazy: () => import('./routes/dev/ui.tsx') }] : []),
]

export const router = createBrowserRouter(routes)
