import { lazy, Suspense, useCallback, useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate, type LinkProps } from 'react-router'
import { useLayoutMode } from '@/layout/useLayoutMode.ts'
import { AskEntryContext, drawerModes, useAskClick, useAskEntry, type AskEntry } from './entry-context.ts'
import { hasRequest, parseAskHref, type AskRequest } from './request.ts'

// Ask's entry layer (tasks 11.3, 11.6): small enough for every page. It decides the surface (design package §7):
// the /ask page on tablet and desktop, a drawer over the current page on mobile (bottom) and compact landscape
// (right). The conversation, CopilotKit's protocol client and every Ask component load only when Ask first opens
// (design.md A2), in AskRoot.

const AskRoot = lazy(() => import('./AskRoot.tsx'))

export function AskProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const mode = useLayoutMode()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [request, setRequest] = useState<AskRequest | undefined>()
  const [slot, setSlot] = useState<HTMLElement | null>(null)
  // Ask stays unloaded until someone opens it; then it stays mounted so the conversation survives navigation.
  const [active, setActive] = useState(false)

  const queue = useCallback((next: AskRequest) => {
    setActive(true)
    if (hasRequest(next)) setRequest(next)
  }, [])

  const open = useCallback(
    (href: string) => {
      if (drawerModes.has(mode)) {
        queue(parseAskHref(href))
        setDrawerOpen(true)
      } else {
        setActive(true)
        navigate(href)
      }
    },
    [mode, navigate, queue],
  )

  const takeRequest = useCallback(() => {
    const taken = request
    if (taken) setRequest(undefined)
    return taken
  }, [request])

  const registerSlot = useCallback((element: HTMLElement | null) => {
    setSlot(element)
    if (element) setActive(true)
  }, [])

  const value = useMemo<AskEntry>(
    () => ({ open, drawerOpen, setDrawerOpen, request, takeRequest, slot, setSlot: registerSlot, queue, active }),
    [open, drawerOpen, request, takeRequest, slot, registerSlot, queue, active],
  )

  return <AskEntryContext value={value}>{children}</AskEntryContext>
}

/** Where Ask mounts once opened: inside the shell, so it can use the palette and the router. */
export function AskMount() {
  const { active } = useAskEntry()
  return active ? (
    <Suspense fallback={null}>
      <AskRoot />
    </Suspense>
  ) : null
}

/** A link into Ask (see useAskClick). */
export function AskLink({ to, onClick, ...props }: Omit<LinkProps, 'to'> & { to: string }) {
  const askClick = useAskClick()(to)
  return (
    <Link
      to={to}
      onClick={(event) => {
        onClick?.(event)
        askClick(event)
      }}
      {...props}
    />
  )
}
