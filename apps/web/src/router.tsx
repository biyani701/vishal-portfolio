import { createBrowserRouter, type RouteObject } from 'react-router'

// Data-mode routes; each section is a lazily loaded route module (design.md A2).
export const routes: RouteObject[] = [
  {
    path: '/',
    lazy: () => import('./routes/home.tsx'),
    // Rendered while the lazy module loads on first visit; the AppShell (P3) takes this over.
    HydrateFallback: () => null,
  },
  // D-5: one dev-only /_dev area. import.meta.env.DEV is false in production builds, so these routes and
  // their modules are dropped from the bundle.
  ...(import.meta.env.DEV ? [{ path: '/_dev/ui', lazy: () => import('./routes/dev/ui.tsx') }] : []),
]

export const router = createBrowserRouter(routes)
