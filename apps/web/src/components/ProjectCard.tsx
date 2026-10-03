import { Fragment } from 'react'
import { Link } from 'react-router'
import type { ProjectMeta } from '@content/schema.ts'
import { StatusChip } from '@/components/StatusChip.tsx'
import { cn } from '@/lib/utils'

// A project card for Home and /work (design package §4.4): a programme's headline outcome, a screenshot, or a typographic
// architecture thumbnail drawn from tokens when there is none. No stock imagery and no invented metrics.

/**
 * Labels wrap between words and never inside one, so a box is at least as wide as its longest word. A host name
 * (two or more dots, e.g. blog.biyani.xyz) may also break after a dot, or it alone would overflow a narrow card;
 * names such as Auth.js stay whole.
 */
const breakAfterDots = (label: string) =>
  label.split(/(\s+)/).flatMap((word, w) =>
    (word.match(/\./g)?.length ?? 0) >= 2 ? word.split(/(?<=\.)(?=\S)/).flatMap((part, i) => (i ? [<wbr key={`${w}-${i}`} />, part] : [part])) : [word],
  )

/** The project's architecture as labelled boxes, left to right, joined by accent connectors. */
export function ArchitectureThumb({ boxes, className }: { boxes: readonly string[]; className?: string }) {
  return (
    <div aria-hidden="true" data-architecture-thumb className={cn('flex items-center justify-center px-3', className)}>
      {boxes.map((box, i) => (
        <Fragment key={box}>
          {i > 0 && <span className="h-px w-3 shrink-0 bg-accent" />}
          <span className="rounded-sm border border-border-strong bg-surface px-2 py-1.5 text-center font-mono text-mono-s text-ink">
            {breakAfterDots(box)}
          </span>
        </Fragment>
      ))}
    </div>
  )
}

/** A programme's headline outcome (specs/portfolio-narrative "Programme case studies"), in place of the thumbnail. */
export function HeadlineThumb({ headline, className }: { headline: NonNullable<ProjectMeta['headline']>; className?: string }) {
  return (
    <div data-headline-thumb className={cn('flex flex-col justify-center gap-1 px-5', className)}>
      <span className="font-sans text-h2 font-semibold text-ink tabular-nums">{headline.value}</span>
      <span className="text-label text-muted">{headline.label}</span>
    </div>
  )
}

interface ProjectCardProps {
  project: ProjectMeta
  /** Extra classes for the thumbnail, e.g. to drop it on phones. */
  thumbClassName?: string
  /** Without the thumbnail, for results inside an answer (Ask). */
  compact?: boolean
  className?: string
}

export function ProjectCard({ project, thumbClassName, compact = false, className }: ProjectCardProps) {
  const thumb = cn('h-37.5 border-b border-border bg-sunken', thumbClassName)
  return (
    <Link
      to={`/work/${project.slug}`}
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border border-border bg-surface text-ink transition-colors duration-colour hover:border-border-strong',
        className,
      )}
    >
      {compact ? null : project.headline ? (
        <HeadlineThumb headline={project.headline} className={thumb} />
      ) : project.screenshot ? (
        <img src={project.screenshot} alt="" decoding="async" loading="lazy" className={cn(thumb, 'w-full object-cover')} />
      ) : (
        project.architecture && <ArchitectureThumb boxes={project.architecture} className={thumb} />
      )}
      <div className={cn('flex flex-col gap-2.5', compact ? 'p-4' : 'p-5')}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-sans text-h3 font-semibold">{project.title}</h3>
          {project.status === 'in-flight' ? (
            <StatusChip status="in-flight" />
          ) : (
            <StatusChip status="delivered" period={String(project.year)} />
          )}
        </div>
        <p className="font-serif text-body text-ink-2">{project.summary}</p>
        {project.stack.length > 0 && (
          <ul aria-label="Stack" className="flex flex-wrap gap-1.5">
            {project.stack.slice(0, 3).map((item) => (
              <li key={item} className="rounded-sm border border-border px-2 py-0.5 text-label text-muted">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  )
}
