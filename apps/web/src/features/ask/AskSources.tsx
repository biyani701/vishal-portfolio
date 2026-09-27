import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { Icon } from '@/components/Icon.tsx'
import { cn } from '@/lib/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/ui/collapsible.tsx'
import { groupSources, type NumberedSource } from './model.ts'

// Sources (specs/ask-experience "Grounding and sources"; design package §8): numbered and grouped by section.
// - rail: the desktop sources column, which stays in view; a hovered citation highlights its source.
// - disclosure: "N sources" under the answer (mobile, compact landscape and tablet), showing the first four,
//   then "Show N more".
// When nothing could be cited, it says so.

const FIRST = 4

const kicker = 'font-mono text-mono-s text-muted uppercase'

function SourceList({ sources, sourceId, highlight }: { sources: readonly NumberedSource[]; sourceId: (n: number) => string; highlight?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {groupSources(sources).map((group) => (
        <section key={group.section} className="flex flex-col gap-1.5">
          <h3 className={kicker}>{group.section}</h3>
          <ol className="flex flex-col gap-1">
            {group.sources.map((source) => (
              <li
                key={source.url}
                id={sourceId(source.n)}
                data-highlighted={highlight === source.n ? '' : undefined}
                className="flex gap-2 rounded-sm px-1.5 transition-colors duration-colour data-highlighted:bg-accent-soft"
              >
                <span className="min-w-5 shrink-0 font-mono text-mono-s leading-7 text-muted">{source.n}</span>
                <Link to={source.url} className="inline-flex min-h-target items-center text-body text-ink underline-offset-4 hover:text-accent hover:underline">
                  {source.title}
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}

const noSources = <p className="text-body text-muted">No sources. Nothing on the site could be cited for this answer.</p>

export function AskSourcesRail({ sources, sourceId, highlight, className }: { sources: readonly NumberedSource[]; sourceId: (n: number) => string; highlight?: number; className?: string }) {
  return (
    <aside aria-labelledby="ask-sources-heading" className={cn('flex flex-col gap-4', className)}>
      <h2 id="ask-sources-heading" className={kicker}>
        Sources
      </h2>
      {sources.length ? <SourceList sources={sources} sourceId={sourceId} highlight={highlight} /> : noSources}
    </aside>
  )
}

export function AskSourcesDisclosure({ sources, sourceId }: { sources: readonly NumberedSource[]; sourceId: (n: number) => string }) {
  const [all, setAll] = useState(false)
  if (!sources.length) return noSources
  const shown = all ? sources : sources.slice(0, FIRST)
  return (
    <Collapsible>
      <CollapsibleTrigger className="group inline-flex min-h-target items-center gap-1.5 text-body font-semibold text-accent">
        <Icon icon={ChevronRight} className="size-4 transition-transform duration-reveal group-data-panel-open:rotate-90" />
        {sources.length} {sources.length === 1 ? 'source' : 'sources'}
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-3 pt-2">
        <SourceList sources={shown} sourceId={sourceId} />
        {!all && sources.length > FIRST && (
          <button type="button" onClick={() => setAll(true)} className="inline-flex min-h-target items-center self-start text-body font-semibold text-accent hover:underline">
            Show {sources.length - FIRST} more
          </button>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
