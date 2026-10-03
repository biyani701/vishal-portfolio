import { cn } from '../cn.ts'

// Status language shared with the portfolio (design package §5): amber means In progress (in flight) only.
export function Status({ live, className }: { live: boolean; className?: string }) {
  return (
    <span
      data-status={live ? 'live' : 'in-progress'}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-mono-s uppercase',
        live ? 'border-border text-ink-2' : 'border-flight-border bg-flight-bg text-flight-fg',
        className,
      )}
    >
      <span aria-hidden="true" className={cn('size-1.5 rounded-full', live ? 'bg-success' : 'bg-flight-dot')} />
      {live ? 'Live' : 'In progress'}
    </span>
  )
}
