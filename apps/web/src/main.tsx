import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import './design/index.css'
import { router } from './router.tsx'

// The build's prerendered title and meta (scripts/prerender.mjs) give way to the ones each page renders, or a
// later navigation would keep the first page's <title>.
document.head.querySelectorAll('[data-prerendered]').forEach((element) => element.remove())

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root element')
root.removeAttribute('data-prerendered-root')

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
