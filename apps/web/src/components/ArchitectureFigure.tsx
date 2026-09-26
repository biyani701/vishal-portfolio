import { Fragment } from 'react'
import { cn } from '@/lib/utils'

// The case-study architecture figure (design package §9 "ArchitectureThumb/Figure"): the same boxes as the card
// thumbnail, drawn larger from tokens, left to right, or top to bottom on phones. Screen readers get the chain
// as one sentence.

export function ArchitectureFigure({ title, boxes, className }: { title: string; boxes: readonly string[]; className?: string }) {
  return (
    <figure className={cn('flex flex-col gap-3 rounded-lg border border-border bg-sunken p-5', className)}>
      <figcaption className="font-mono text-mono-s text-muted uppercase">Architecture</figcaption>
      <div
        role="img"
        aria-label={`${title} architecture: ${boxes.join(', then ')}`}
        className="flex flex-col items-stretch tablet:flex-row tablet:items-center desktop:flex-row desktop:items-center compact-landscape:flex-row compact-landscape:items-center"
      >
        {boxes.map((box, i) => (
          <Fragment key={box}>
            {i > 0 && (
              <span className="mx-auto h-5 w-px shrink-0 bg-accent tablet:h-px tablet:w-5 desktop:h-px desktop:w-6 compact-landscape:h-px compact-landscape:w-5" />
            )}
            <span className="min-w-0 flex-1 rounded-sm border border-border-strong bg-surface px-3 py-2.5 text-center font-mono text-label wrap-anywhere text-ink">
              {box}
            </span>
          </Fragment>
        ))}
      </div>
    </figure>
  )
}
