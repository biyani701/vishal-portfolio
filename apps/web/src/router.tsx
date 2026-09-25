import { createBrowserRouter, type RouteObject } from 'react-router'

// Data-mode routes; each section is a lazily loaded route module (design.md A2).
export const routes: RouteObject[] = [
  {
    path: '/',
    lazy: () => import('./routes/home.tsx'),
    // Rendered while the lazy module loads on first visit; the AppShell (P3) takes this over.
    HydrateFallback: () => null,
  },
]

export const router = createBrowserRouter(routes)
