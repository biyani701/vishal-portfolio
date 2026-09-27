import { Link } from 'react-router'
import { StatusChip } from '@/components/StatusChip.tsx'
import { usePalette } from '@/features/search/context.ts'
import { Button } from '@/ui/button.tsx'
import { Answer } from './Answer.tsx'
import { AskActivity } from './AskActivity.tsx'
import { AskConfirm } from './AskConfirm.tsx'
import { AskResult } from './AskResult.tsx'
import { AskSourcesDisclosure } from './AskSources.tsx'
import { errorCopy } from './copy.ts'
import { numberSources, plainAnswer, type Turn } from './model.ts'
import type { ContactPayload } from './store.ts'

// One question and its answer (specs/ask-experience "Answer structure"): the question as a heading, the steps,
// results as site components, the answer as serif prose, then its end row. No avatar, persona or bubbles.

export interface TurnActions {
  retry: () => void
  sendDraft: (payload: ContactPayload) => void
  dismissDraft: () => void
  highlight?: (n: number | undefined) => void
}

const copy = (text: string) => navigator.clipboard?.writeText(text).catch(() => undefined)

export function AskTurn({ turn, index, inlineSources, actions }: { turn: Turn; index: number; inlineSources: boolean; actions: TurnActions }) {
  const { openPalette } = usePalette()
  const sources = numberSources(turn)
  const sourceId = (n: number) => `ask-${index}-source-${n}`
  const streaming = turn.status === 'streaming'
  const failedSteps = turn.steps.filter((step) => step.status === 'failed')
  const primary = sources.find((s) => s.cited) ?? sources[0]

  return (
    <article aria-labelledby={`ask-${index}-question`} className="flex flex-col gap-5" data-turn-status={turn.status}>
      <header className="flex flex-col gap-1.5">
        {turn.context && <p className="font-mono text-mono-s text-muted uppercase">About {turn.context.title}</p>}
        <h2 id={`ask-${index}-question`} className="font-sans text-question font-semibold text-ink">
          {turn.question}
        </h2>
      </header>

      <AskActivity steps={turn.steps} onRetry={actions.retry} />
      {streaming && !turn.text && !turn.steps.length && <p className="text-body text-muted">Thinking about where to look…</p>}

      <AskResult steps={turn.steps} />

      {/* aria-busy while streaming, so assistive tech waits for the finished answer rather than each word. */}
      <div aria-busy={streaming} aria-label="Answer" role="group">
        {turn.text && <Answer text={turn.text} sources={sources} handlers={{ sourceId, onHighlight: actions.highlight }} />}
      </div>

      {turn.draft && <AskConfirm draft={turn.draft} failedSteps={failedSteps} onSend={actions.sendDraft} onDismiss={actions.dismissDraft} />}

      {turn.status === 'complete' && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <StatusChip status="answer-complete" sources={sources.length} />
          {turn.text && (
            <Button variant="link" className="h-11 px-0" onClick={() => copy(plainAnswer(turn))}>
              Copy answer
            </Button>
          )}
          {primary && (
            <Link to={primary.url} className="inline-flex min-h-target items-center font-semibold text-accent underline-offset-4 hover:underline">
              Open {primary.title}
            </Link>
          )}
        </div>
      )}

      {turn.status === 'incomplete' && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2" role="group" aria-label="Incomplete answer">
          <span className="inline-flex items-center rounded-full border border-error-border bg-error-bg px-2.5 py-0.5 font-mono text-mono-s text-error uppercase">
            Incomplete
          </span>
          <span className="text-body text-muted">{turn.stopped ? 'You stopped this answer.' : errorCopy(turn.error)}</span>
          <Button variant="outline" onClick={actions.retry}>
            Try again
          </Button>
          <Button variant="ghost" onClick={() => copy(plainAnswer(turn))}>
            Copy what’s here
          </Button>
        </div>
      )}

      {turn.status === 'failed' && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-body text-ink-2">{errorCopy(turn.error)} Nothing was answered.</p>
          <Button variant="outline" onClick={actions.retry}>
            Try again
          </Button>
        </div>
      )}

      {turn.status === 'unavailable' && (
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
          <p className="text-body text-ink-2">{errorCopy(turn.error, turn.retryAfterSeconds)}</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => openPalette(turn.question)}>
              Search the site
            </Button>
            <Link to="/contact" className="inline-flex h-11 items-center rounded-md px-4 font-semibold text-accent underline-offset-4 hover:underline">
              Send a message
            </Link>
          </div>
        </div>
      )}

      {inlineSources && turn.status !== 'streaming' && turn.status !== 'unavailable' && turn.status !== 'failed' && <AskSourcesDisclosure sources={sources} sourceId={sourceId} />}
    </article>
  )
}
