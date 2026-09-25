import { Fragment } from 'react'
import { Link } from 'react-router'
import { Portrait } from '@/components/Portrait.tsx'
import { buildProgramme, fractionalYear } from '@/components/programme/buildProgramme.ts'
import { spanTone } from '@/components/programme/tones.ts'
import { milestones, organisations, profile, roles } from '@/content/index.ts'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/ui/button.tsx'

// Home hero (design package §7): 12 columns on desktop (statement 8, portrait 3), 8 on tablet, stacked on
// mobile with the 104px portrait beside the role line, and two panes on compact landscape (statement /
// portrait + mini line + proof row). The DOM is the same in every mode; only the grid placement changes.

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="grid gap-6 tablet:grid-cols-8 tablet:items-end desktop:grid-cols-12 desktop:items-end compact-landscape:grid-cols-2 compact-landscape:gap-7"
    >
      <div className="flex flex-col gap-6 tablet:col-span-5 desktop:col-span-8 compact-landscape:gap-3">
        <p className="font-mono text-mono-s text-muted uppercase mobile:hidden">
          {profile.positioning} · {profile.location}
        </p>
        <h1 id="hero-heading" className="font-sans text-display font-semibold">
          {/* Spaces between the lines keep the accessible name readable: "I lead delivery. I build tools. …" */}
          {profile.statement.map((line, i) => (
            <Fragment key={line}>
              {i > 0 && ' '}
              <span className="block">
                {line}
                <span className="text-accent">.</span>
              </span>
            </Fragment>
          ))}
        </h1>
        <p className="max-w-160 font-serif text-lede text-ink-2 compact-landscape:hidden">
          <span className="mobile:hidden">{profile.lede}</span>
          <span className="hidden mobile:inline">{profile.ledeShort}</span>
        </p>
        <div className="flex flex-wrap gap-3 mobile:flex-col compact-landscape:mt-auto">
          <Link to="/work" className={cn(buttonVariants({ size: 'lg' }), 'compact-landscape:h-11')}>
            See the work
          </Link>
          <Link to="/ask" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'compact-landscape:h-11')}>
            Ask about my experience
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3 mobile:order-first tablet:col-span-3 desktop:col-span-3 desktop:col-start-10">
        <figure className="flex flex-col gap-4 mobile:flex-row mobile:items-end compact-landscape:flex-row compact-landscape:items-center compact-landscape:gap-3">
          <Portrait src={profile.portrait.src} alt={profile.portrait.alt} className="shrink-0" />
          <figcaption className="font-mono text-mono-s text-muted uppercase compact-landscape:font-sans compact-landscape:text-label compact-landscape:text-ink-2 compact-landscape:normal-case">
            <span className="mobile:hidden">{profile.currentRole}</span>
            <span className="hidden mobile:inline">
              {profile.positioning}
              <br />
              {profile.location} · {organisations.at(-1)!.short}
            </span>
          </figcaption>
        </figure>
        <MiniLine />
        <ProofRow />
      </div>
    </section>
  )
}

/** Compact landscape: the Programme Line as bare spans, a preview of the full figure below. */
function MiniLine() {
  const { lanes } = buildProgramme({ organisations, roles, milestones, width: 100, now: fractionalYear(new Date()) })
  return (
    <div aria-hidden="true" className="hidden flex-col gap-1.5 border-t-2 border-border-strong pt-2 compact-landscape:flex">
      {lanes.map((lane) => (
        <div key={lane.org.id} className="flex items-center gap-2">
          <span className="w-20 shrink-0 font-mono text-mono-s whitespace-nowrap text-muted">{lane.org.short}</span>
          <span className="relative h-2.5 min-w-0 flex-1">
            {lane.segments.map((segment) => (
              <span
                key={segment.role.id}
                className={cn('absolute top-0 h-2.5 rounded-full', spanTone[segment.tone])}
                style={{ left: `${segment.x}%`, width: `${segment.width}%` }}
              />
            ))}
          </span>
        </div>
      ))}
    </div>
  )
}

/** Compact landscape: the proof ledger as one row (the full ledger is hidden in this mode). */
function ProofRow() {
  return (
    <ul className="hidden justify-between gap-3 border-t border-border pt-2 font-mono text-mono-s text-muted compact-landscape:flex">
      {profile.proof.map((item) => (
        <li key={item.label}>
          <span className="font-sans text-h3 font-semibold text-ink tabular-nums">{item.value}</span>{' '}
          <span aria-hidden="true">{item.short}</span>
          <span className="sr-only">{item.label}</span>
        </li>
      ))}
    </ul>
  )
}
