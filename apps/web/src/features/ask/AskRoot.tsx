import { announce } from '@react-aria/live-announcer'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router'
import { config } from '@/config/index.ts'
import { useLayoutMode } from '@/layout/useLayoutMode.ts'
import { Drawer, DrawerContent, DrawerTitle } from '@/ui/drawer.tsx'
import { AskSurface } from './AskSurface.tsx'
import { AskStoreContext } from './context.ts'
import { drawerModes, useAskEntry } from './entry-context.ts'
import { applyRequest, askHref } from './request.ts'
import { AskStore, type ContactPayload } from './store.ts'
import { httpTransport } from './transport.ts'

// Loaded when Ask first opens (entry.tsx). One store for the visit, so the page and both drawers show the same
// conversation, including across a rotation mid-answer (specs/ask-experience "Surfaces by mode").

async function sendContact(payload: ContactPayload) {
  const res = await fetch(`${config.apiBaseUrl}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, source: 'ask' }),
  })
  return res.status === 201
}

const browserStorage = () => {
  try {
    return window.localStorage
  } catch {
    return undefined
  }
}

let shared: AskStore | undefined
function sharedStore() {
  shared ??= new AskStore({ transport: httpTransport(`${config.apiBaseUrl}/ask`), sendContact, announce, storage: browserStorage() })
  return shared
}

export default function AskRoot() {
  const [store] = useState(sharedStore)
  const { request, takeRequest, slot, drawerOpen, setDrawerOpen } = useAskEntry()
  const mode = useLayoutMode()
  const navigate = useNavigate()
  const drawer = drawerModes.has(mode)

  useEffect(() => {
    if (!request) return
    const taken = takeRequest()
    if (taken) applyRequest(store, taken)
  }, [request, takeRequest, store])

  // A drawer open when the viewport becomes tablet or desktop continues on the /ask page.
  useEffect(() => {
    if (drawerOpen && !drawer) {
      setDrawerOpen(false)
      if (!slot) navigate(askHref())
    }
  }, [drawer, drawerOpen, slot, navigate, setDrawerOpen])

  // On the /ask page itself the surface is the page; the drawer isn't needed.
  useEffect(() => {
    if (slot && drawerOpen) setDrawerOpen(false)
  }, [slot, drawerOpen, setDrawerOpen])

  return (
    <AskStoreContext value={store}>
      {slot && createPortal(<AskSurface variant="page" rail={mode === 'desktop'} />, slot)}
      {!slot && drawer && (
        <Drawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          swipeDirection={mode === 'compact-landscape' ? 'right' : 'down'}
          snapPoints={mode === 'mobile' ? [1] : undefined}
        >
          <DrawerContent wide={mode === 'compact-landscape'} aria-label="Ask">
            <DrawerTitle className="sr-only">Ask</DrawerTitle>
            <AskSurface variant="drawer" onClose={() => setDrawerOpen(false)} />
          </DrawerContent>
        </Drawer>
      )}
    </AskStoreContext>
  )
}
