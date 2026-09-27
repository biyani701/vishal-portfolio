import { useLayoutEffect } from 'react'

/**
 * Rendered once at the root (main.tsx). Runs when the app's first render has replaced a prerendered page
 * (scripts/prerender.mjs), before the browser paints: the prerendered title and meta give way to the ones each page
 * renders (or a later navigation would keep the first page's <title>), and #root loses the marker that hides the
 * header navigation and tells e2e tests the app hasn't started yet.
 */
export function AppStarted() {
  useLayoutEffect(() => {
    document.head.querySelectorAll('[data-prerendered]').forEach((element) => element.remove())
    document.getElementById('root')?.removeAttribute('data-prerendered-root')
  }, [])
  return null
}
