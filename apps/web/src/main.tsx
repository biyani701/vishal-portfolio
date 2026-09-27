import { startTransition, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import './design/index.css'
import { AppStarted } from './layout/AppStarted.tsx'
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

// A prerendered page stays on screen until the app can render the same page in one step. Rendering earlier would
// replace it with the empty shell while the lazy route loads: a blank flash, and the footer jumping up and back down
// (layout shift). The render runs as a transition, in slices that yield to the browser rather than one long task.
void routerReady().then(() => {
  const app = createRoot(root)
  startTransition(() =>
    app.render(
      <StrictMode>
        <RouterProvider router={router} />
        <AppStarted />
      </StrictMode>,
    ),
  )
})
