import { ChevronRight } from 'lucide-react'
import { Icon } from '@/components/Icon.tsx'
import { StatusChip } from '@/components/StatusChip.tsx'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/ui/collapsible.tsx'
import { stepSentence } from './copy.ts'
import type { Step } from './model.ts'

// One line per agent step (DD-3; specs/ask-experience "Activity presentation"): a StatusChip and a
// plain-language sentence; "Details" shows the tool, its arguments and how long it took, in mono. Raw model
// reasoning is never shown (the server drops it). Steps stack in the order they ran. A failed step's chip
// carries Retry, which asks the question again.

const pretty = (args: string) => {
  try {
    return JSON.stringify(JSON.parse(args), null, 2)
  } catch {
    return args || '{}'
  }
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <dt className="w-10 shrink-0 text-muted">{label}</dt>
      <dd className="min-w-0 flex-1">{children}</dd>
    </div>
  )
}

function StepLine({ step, onRetry }: { step: Step; onRetry: () => void }) {
  const ms = step.endedAt ? step.endedAt - step.startedAt : undefined
  return (
    <li className="flex flex-col gap-1.5" data-step-status={step.status}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        {step.status === 'failed' ? <StatusChip status="failed" onRetry={onRetry} /> : <StatusChip status={step.status} />}
        <span className="text-body text-ink-2">{stepSentence(step)}</span>
      </div>
      <Collapsible>
        <CollapsibleTrigger className="group hit-target relative inline-flex items-center gap-1 text-label text-muted hover:text-ink">
          <Icon icon={ChevronRight} className="size-3.5 transition-transform duration-reveal group-data-panel-open:rotate-90" />
          Details
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1.5 rounded-sm border border-border bg-sunken px-3 py-2 font-mono text-mono-s text-ink-2">
          <dl className="flex flex-col gap-1">
            <Detail label="tool">{step.tool}</Detail>
            <Detail label="args">
              <pre className="whitespace-pre-wrap break-words">{pretty(step.args)}</pre>
            </Detail>
            <Detail label="time">{ms === undefined ? 'running' : `${ms} ms`}</Detail>
          </dl>
        </CollapsibleContent>
      </Collapsible>
    </li>
  )
}

export function AskActivity({ steps, onRetry }: { steps: readonly Step[]; onRetry: () => void }) {
  if (!steps.length) return null
  return (
    <ol aria-label="Steps" className="flex flex-col gap-3">
      {steps.map((step) => (
        <StepLine key={step.id} step={step} onRetry={onRetry} />
      ))}
    </ol>
  )
}
