import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Heading } from '@content/schema.ts'
import { Icon } from '@/components/Icon.tsx'
import { useLayoutMode } from '@/layout/useLayoutMode.ts'
import { cn } from '@/lib/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/ui/collapsible.tsx'

// "On this page" for case studies (design package §7: a side column, or a disclosure on phones). Links are plain
// #anchors; AppShell's ScrollRestoration keys them by URL so Back returns to the right place.

const kicker = 'font-mono text-mono-s text-muted uppercase'

function Links({ headings, onNavigate }: { headings: readonly Heading[]; onNavigate?: () => void }) {
  return (
    <ol className="flex flex-col">
      {headings.map((heading) => (
        <li key={heading.id}>
          <a
            href={`#${heading.id}`}
            onClick={onNavigate}
            className={cn(
              'flex min-h-target items-center border-l border-border py-1 pl-3 text-label text-ink-2 hover:border-border-strong hover:text-accent',
              heading.depth === 3 && 'pl-6',
            )}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ol>
  )
}

export function TableOfContents({ headings, className }: { headings: readonly Heading[]; className?: string }) {
  const mode = useLayoutMode()
  const [open, setOpen] = useState(false)

  if (mode === 'mobile') {
    return (
      <nav aria-label="On this page" className={className}>
        <Collapsible open={open} onOpenChange={setOpen} className="rounded-md border border-border bg-surface">
          <CollapsibleTrigger className="group flex min-h-target w-full cursor-pointer items-center justify-between gap-3 px-4 text-label font-semibold text-ink">
            On this page
            <Icon icon={ChevronDown} className="transition-transform duration-reveal group-data-panel-open:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-3">
            {/* Close once a section is chosen, so the reader lands on it rather than on the open list. */}
            <Links headings={headings} onNavigate={() => setOpen(false)} />
          </CollapsibleContent>
        </Collapsible>
      </nav>
    )
  }

  return (
    <nav aria-labelledby="toc-heading" className={cn('flex flex-col gap-2', className)}>
      <h2 id="toc-heading" className={kicker}>
        On this page
      </h2>
      <Links headings={headings} />
    </nav>
  )
}
