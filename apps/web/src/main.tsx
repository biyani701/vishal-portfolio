import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import './design/index.css'
import { router } from './router.tsx'

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root element')

/** Resolves once the router has loaded the first page's route module and data. */
const routerReady = () =>
  router.state.initialized
    ? Promise.resolve()
    : new Promise<void>((resolve) => {
        const stop = router.subscribe((state) => {
          if (!state.initialized) return
          stop()
          resolve()
        })
      })

// A prerendered page (scripts/prerender.mjs) stays on screen until the app can render the same page in one step.
// Rendering earlier would replace it with the empty shell while the lazy route loads: a blank flash, and the footer
// jumping up and back down (layout shift).
void routerReady().then(() => {
  // The prerendered title and meta give way to the ones each page renders, or a later navigation would keep the
  // first page's <title>.
  document.head.querySelectorAll('[data-prerendered]').forEach((element) => element.remove())
  root.removeAttribute('data-prerendered-root')
  createRoot(root).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
})
