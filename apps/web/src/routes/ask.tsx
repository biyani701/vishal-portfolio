import { useEffect } from 'react'
import { useSearchParams } from 'react-router'
import { useAskEntry } from '@/features/ask/entry-context.ts'
import { parseAskHref } from '@/features/ask/request.ts'
import { PageShell } from '@/layout/PageShell.tsx'

// /ask (specs/ask-experience "Surfaces by mode"): the page surface on every mode it's visited in; on desktop it
// has the sources rail. The page is a slot: Ask's surface is rendered into it (AskRoot), so the conversation is
// the same one the drawers show. ?q= asks, ?prefill= fills the composer, ?about= adds the page it came from.

export function Component() {
  const { setSlot, queue } = useAskEntry()
  const [params, setParams] = useSearchParams()

  useEffect(() => {
    if (!params.size) return
    queue(parseAskHref(`/ask?${params}`))
    setParams({}, { replace: true, preventScrollReset: true })
  }, [params, queue, setParams])

  useEffect(() => () => setSlot(null), [setSlot])

  return (
    <PageShell>
      <div ref={setSlot} />
    </PageShell>
  )
}
