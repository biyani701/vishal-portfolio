import { createContext, use, type MouseEvent } from 'react'
import { useNavigate } from 'react-router'
import { useLayoutMode } from '@/layout/useLayoutMode.ts'
import type { AskRequest } from './request.ts'

// Ask's entry context (entry.tsx provides it): how pages open Ask, and where its surface goes.

/** The modes where Ask is a drawer over the page rather than the /ask page (design package §7). */
export const drawerModes = new Set(['mobile', 'compact-landscape'])

export interface AskEntry {
  /** Opens Ask for an /ask URL: navigates to the page, or opens the drawer over this page. */
  open: (href: string) => void
  /** The drawer (mobile and compact landscape). */
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
  /** The request waiting for AskRoot to act on. */
  request?: AskRequest
  takeRequest: () => AskRequest | undefined
  /** Where the /ask page wants the surface rendered. */
  slot: HTMLElement | null
  setSlot: (slot: HTMLElement | null) => void
  /** Queues a request from the /ask page's URL. */
  queue: (request: AskRequest) => void
  /** Ask has been opened this visit, so AskRoot is (or is being) loaded. */
  active: boolean
}

export const AskEntryContext = createContext<AskEntry | null>(null)

export function useAskEntry(): AskEntry {
  const entry = use(AskEntryContext)
  if (!entry) throw new Error('useAskEntry must be used inside <AskProvider>')
  return entry
}

/** Opens Ask for an /ask URL. Outside the shell (a page rendered on its own) it simply navigates there. */
export function useOpenAsk(): (href: string) => void {
  const entry = use(AskEntryContext)
  const navigate = useNavigate()
  return entry?.open ?? ((href) => void navigate(href))
}

/**
 * The click handler for a link into Ask: on mobile and compact landscape it opens the drawer over the page
 * instead of navigating; elsewhere (new-tab clicks, and outside the shell) the link is followed.
 */
export function useAskClick() {
  const entry = use(AskEntryContext)
  const mode = useLayoutMode()
  return (to: string, before?: () => void) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
    if (!entry || !drawerModes.has(mode)) return
    event.preventDefault()
    before?.()
    entry.open(to)
  }
}
