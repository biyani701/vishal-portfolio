import { useEffect } from 'react'
import { Link, Outlet, ScrollRestoration } from 'react-router'
import { useLegacyAnchorRedirect } from './redirects.ts'
import { syncTheme } from './theme.ts'
import { ThemeControl } from './ThemeControl.tsx'
import { useLayoutMode } from './useLayoutMode.ts'

/**
 * Site frame (specs/responsive-layout "Shell sizing"): a sticky header of --spacing-header (64/56/44px by
 * mode, border included) below the top safe area, the page's PageShell, and a static footer. The header stays in flow, so
 * content always starts beneath it; html's scroll-padding-top (tokens.css) keeps anchor targets clear of it.
 */
export function AppShell() {
  // Exposed for the Playwright matrix, which checks the JS mode against the CSS one in a real browser.
  const mode = useLayoutMode()
  useLegacyAnchorRedirect()
  useEffect(syncTheme, [])

  return (
    <div data-layout-mode={mode} className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:inline-flex focus:min-h-target focus:items-center focus:rounded-md focus:bg-surface focus:px-4 focus:text-ink focus:shadow-overlay"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-10 shell-header border-b border-border bg-bg">
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-4 px-page">
          <Link to="/" className="inline-flex min-h-target items-center font-sans text-body font-semibold text-ink">
            Vishal Biyani
          </Link>
          {/* P5 adds the navigation here. */}
          <ThemeControl />
        </div>
      </header>

      <Outlet />

      <footer className="border-t border-border pb-safe">
        <p className="mx-auto w-full max-w-7xl px-page py-6 text-label text-muted">© {new Date().getFullYear()} Vishal Biyani</p>
      </footer>
      {/*
        A plain #anchor link (skip link, Markdown ToC) makes a history entry with no router key, so it shares
        the first entry's "default" key; key those by URL, or Back/forward restoration scrolls the jump to the top.
      */}
      <ScrollRestoration getKey={({ key, pathname, hash }) => (key === 'default' ? pathname + hash : key)} />
    </div>
  )
}
