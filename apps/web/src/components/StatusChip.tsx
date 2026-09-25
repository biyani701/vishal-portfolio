import { cn } from '@/lib/utils'

// Design package §5: content and AI share one status vocabulary. Every chip carries text, so colour is
// never the only signal, and amber is reserved for "In flight".
export type StatusChipProps =
  | { status: 'delivered'; period: string }
  | { status: 'in-flight' }
  | { status: 'done' }
  | { status: 'failed'; onRetry: () => void }
  | { status: 'answer-complete'; sources: number }
  | { status: 'selected' }

const tone: Record<StatusChipProps['status'], string> = {
  delivered: 'border-border bg-surface text-ink',
  'in-flight': 'border-flight-border bg-flight-bg text-flight-fg',
  done: 'border-border bg-surface text-success',
  failed: 'border-error-border bg-error-bg text-error',
  'answer-complete': 'border-border bg-surface text-muted',
  selected: 'border-accent bg-accent-soft text-accent',
}

function label(props: StatusChipProps) {
  switch (props.status) {
    case 'delivered':
      return `Delivered · ${props.period}`
    case 'in-flight':
      return 'In flight'
    case 'done':
      return 'Done'
    case 'failed':
      return 'Failed'
    case 'answer-complete':
      return `Answer complete · ${props.sources} ${props.sources === 1 ? 'source' : 'sources'}`
    case 'selected':
      return 'Selected'
  }
}

export function StatusChip({ className, ...props }: StatusChipProps & { className?: string }) {
  return (
    <span
      data-status={props.status}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-mono-s whitespace-nowrap uppercase',
        tone[props.status],
        className,
      )}
    >
      {props.status === 'in-flight' && <span aria-hidden="true" className="size-1.5 rounded-full bg-flight-dot" />}
      {label(props)}
      {props.status === 'failed' && (
        <>
          <span aria-hidden="true">·</span>
          {/* A failure is always paired with a recovery action (§5). */}
          <button
            type="button"
            onClick={props.onRetry}
            className="hit-target relative cursor-pointer uppercase underline underline-offset-2 hover:text-ink"
          >
            Retry
          </button>
        </>
      )}
    </span>
  )
}
