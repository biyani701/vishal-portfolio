import { createBrowserRouter, type RouteObject } from 'react-router'
import { AppShell } from './layout/AppShell.tsx'
import { redirectRoutes } from './layout/redirects.ts'
import type { LegalHandle } from './routes/legal.tsx'

// Rendered in place of a lazy route while its module loads on first visit.
const blank = () => null
const legalPage = () => import('./routes/legal.tsx')
const legalPages: [path: string, handle: LegalHandle][] = [
  ['/colophon', { document: 'colophon' }],
  ['/legal/privacy', { document: 'privacy' }],
  ['/legal/terms', { document: 'terms' }],
]

// Data-mode routes; each section is a lazily loaded route module (design.md A2), rendered inside the AppShell.
export const routes: RouteObject[] = [
  {
    Component: AppShell,
    children: [
      { index: true, lazy: () => import('./routes/home.tsx'), HydrateFallback: blank },
      { path: '/work', lazy: () => import('./routes/work.tsx'), HydrateFallback: blank },
      { path: '/experience', lazy: () => import('./routes/experience.tsx'), HydrateFallback: blank },
      { path: '/about', lazy: () => import('./routes/about.tsx'), HydrateFallback: blank },
      { path: '/work/:slug', lazy: () => import('./routes/case-study.tsx'), HydrateFallback: blank },
      { path: '/ask', lazy: () => import('./routes/ask.tsx'), HydrateFallback: blank },
      { path: '/contact', lazy: () => import('./routes/contact.tsx'), HydrateFallback: blank },
      ...legalPages.map(([path, handle]) => ({ path, handle, lazy: legalPage, HydrateFallback: blank })),
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
