import { useEffect } from 'react'
import { generatePath, replace, useLocation, useNavigate, type RouteObject } from 'react-router'

// Route migration map (design/exploration/02-information-architecture.md; specs/site-navigation "Redirects
// for legacy URLs"). Old paths whose route is unchanged, and the auth callback paths, need no entry.
// `to` reuses the param names of `from`, so each param carries across (a blog id is the article slug).
export const legacyRedirects = [
  { from: '/profile', to: '/account' },
  { from: '/works', to: '/work' },
  { from: '/blogs', to: '/writing' },
  { from: '/blogs/:blogId', to: '/writing/:blogId' },
  { from: '/knowledge/domain/:categoryId', to: '/knowledge/:categoryId' },
  { from: '/knowledge/domain/:categoryId/:topicId', to: '/knowledge/:categoryId/:topicId' },
  { from: '/knowledge/ThreeDSFlowStepper', to: '/knowledge/credit-cards-payments/3ds-flow' },
  { from: '/credits', to: '/colophon' },
  { from: '/privacy', to: '/legal/privacy' },
  { from: '/terms', to: '/legal/terms' },
  // D-4: one sign-in page.
  { from: '/signin-legacy', to: '/signin' },
  { from: '/login', to: '/signin' },
  { from: '/signin-toolpad', to: '/signin' },
] as const

/** Home-page anchors of the old single-page layout, now sections of their own pages. */
export const legacyHomeAnchors: Record<string, string> = {
  '#experience': '/experience',
  '#timeline': '/experience',
  '#skills': '/experience#skills',
  '#certifications': '/experience#certifications',
  '#summary': '/about#summary',
  '#education': '/about#education',
  '#recognition': '/about#recognition',
}

// A loader redirect runs before anything renders. `replace` swaps the history entry, so Back never returns
// to the old URL (which would redirect forward again). The query string is kept.
export const redirectRoutes: RouteObject[] = legacyRedirects.map(({ from, to }) => ({
  path: from,
  loader: ({ params, request }) => replace(generatePath(to, params) + new URL(request.url).search),
}))

/** Loaders never see the hash, so old home anchors are redirected once the location is known. */
export function useLegacyAnchorRedirect() {
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()
  const target = pathname === '/' ? legacyHomeAnchors[hash] : undefined

  useEffect(() => {
    if (target) navigate(target, { replace: true })
  }, [target, navigate])
}
