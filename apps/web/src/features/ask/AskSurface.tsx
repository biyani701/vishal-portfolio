import { ArrowDown, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/Icon.tsx'
import { cn } from '@/lib/utils'
import { Button } from '@/ui/button.tsx'
import { AskComposer } from './AskComposer.tsx'
import { AskSourcesRail } from './AskSources.tsx'
import { AskSuggestions } from './AskSuggestions.tsx'
import { STARTERS } from './copy.ts'
import { AskTurn } from './AskTurn.tsx'
import { useAskState, useAskStore } from './context.ts'
import { numberSources } from './model.ts'

// Ask's surface (specs/ask-experience "Surfaces by mode"; design package §7–8). The same conversation renders as:
// - page: the /ask page, with the sources rail beside it on desktop (rail) and sources under each answer otherwise;
// - drawer: the bottom drawer (mobile) or the right drawer (compact landscape), composer pinned above the safe area.

/** "Jump to latest ↓": shown when the newest content is out of view. */
function useLatestInView(root: HTMLElement | null, sentinel: HTMLElement | null) {
  const [inView, setInView] = useState(true)
  useEffect(() => {
    if (!sentinel || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), { root })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [root, sentinel])
  return inView
}

export function AskSurface({ variant, rail = false, onClose }: { variant: 'page' | 'drawer'; rail?: boolean; onClose?: () => void }) {
  const store = useAskStore()
  const { turns, suggestions, pending } = useAskState()
  const [scroller, setScroller] = useState<HTMLElement | null>(null)
  const [sentinel, setSentinel] = useState<HTMLElement | null>(null)
  const [highlight, setHighlight] = useState<number | undefined>()
  const latestInView = useLatestInView(variant === 'drawer' ? scroller : null, sentinel)

  const last = turns.at(-1)
  const streaming = last?.status === 'streaming'
  const railTurn = [...turns].reverse().find((turn) => turn.status !== 'streaming') ?? last
  const railIndex = rail && railTurn ? turns.indexOf(railTurn) : -1

  // Follow the answer while the reader is at the end; leave them be if they've scrolled up.
  const following = useRef(latestInView)
  useEffect(() => {
    following.current = latestInView
  }, [latestInView])
  // Only content that arrives after the surface opens moves the page; opening it never scrolls.
  const growth = `${turns.length}:${last?.text.length ?? 0}:${last?.steps.length ?? 0}:${last?.status}`
  const seen = useRef(growth)
  useEffect(() => {
    if (seen.current === growth) return
    seen.current = growth
    if (following.current) sentinel?.scrollIntoView?.({ block: 'end' })
  }, [growth, sentinel])

  // A question from "Ask about this" sits in the composer with its page as context, for the visitor to send.
  const ask = (question: string) => void store.ask(question, pending?.context)

  const conversation = (
    <>
      {turns.length === 0 && (
        <div className="flex flex-col gap-6">
          <p className="font-serif text-lede text-ink-2">Ask about roles, projects, skills or credentials. Answers come only from this site and name their sources.</p>
          <AskSuggestions label="Try asking" questions={STARTERS} onAsk={ask} />
        </div>
      )}
      <div className="flex flex-col gap-12">
        {turns.map((turn, index) => (
          <AskTurn
            key={turn.id}
            turn={turn}
            index={index}
            // The rail shows the latest answer's sources; earlier answers keep theirs underneath.
            inlineSources={!rail || index !== railIndex}
            actions={{
              retry: () => void (index === turns.length - 1 ? store.retry(turn.id) : store.ask(turn.question, turn.context)),
              sendDraft: (payload) => void store.sendDraft(turn.id, payload),
              dismissDraft: () => store.dismissDraft(turn.id),
              highlight: rail ? setHighlight : undefined,
            }}
          />
        ))}
      </div>
      {!streaming && last?.status === 'complete' && <AskSuggestions label="Ask next" questions={suggestions} onAsk={ask} />}
      <div ref={setSentinel} aria-hidden="true" className="h-px" />
    </>
  )

  const dock = (
    <div className="flex flex-col gap-2">
      {!latestInView && turns.length > 0 && (
        <Button variant="outline" size="sm" className="self-center" onClick={() => sentinel?.scrollIntoView?.({ block: 'end', behavior: 'smooth' })}>
          Jump to latest
          <Icon icon={ArrowDown} className="size-3.5" />
        </Button>
      )}
      <AskComposer
        key={pending?.at ?? 'composer'}
        streaming={streaming}
        onAsk={ask}
        onStop={() => store.stop()}
        initial={pending?.question}
        autoFocus={variant === 'drawer' || Boolean(pending)}
      />
    </div>
  )

  const newConversation = turns.length > 0 && !streaming && (
    <Button variant="ghost" size="sm" onClick={() => store.clear()}>
      New conversation
    </Button>
  )

  if (variant === 'drawer') {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-1">
          <p className="font-sans text-body font-semibold text-accent">Ask</p>
          <div className="flex items-center gap-1">
            {newConversation}
            <Button variant="ghost" size="icon" aria-label="Close Ask" onClick={onClose}>
              <Icon icon={X} />
            </Button>
          </div>
        </div>
        <div ref={setScroller} className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto overscroll-contain px-4 py-5">
          {conversation}
        </div>
        <div className="shrink-0 border-t border-border bg-surface px-4 pb-safe">
          <div className="py-3">{dock}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('grid gap-10', rail && 'desktop:grid-cols-12')}>
      <div className={cn('flex min-w-0 flex-col gap-8', rail && 'desktop:col-span-8')}>
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-sans text-h1 font-semibold">Ask</h1>
          {newConversation}
        </header>
        {conversation}
        <div className="sticky bottom-0 z-10 bg-bg pb-safe">
          <div className="border-t border-border py-3">{dock}</div>
        </div>
      </div>
      {rail && railTurn && (
        <AskSourcesRail
          sources={numberSources(railTurn)}
          sourceId={(n) => `ask-${railIndex}-source-${n}`}
          highlight={highlight}
          className="sticky-below-header self-start desktop:col-span-4"
        />
      )}
    </div>
  )
}
