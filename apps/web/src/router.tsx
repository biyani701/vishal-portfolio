import { createBrowserRouter } from 'react-router'

// Data-mode router; each section is a lazily loaded route module (design.md A2).
export const router = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('./routes/home.tsx'),
  },
])
