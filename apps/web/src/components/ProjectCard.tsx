import { Fragment } from 'react'
import { Link } from 'react-router'
import type { ProjectMeta } from '@content/schema.ts'
import { StatusChip } from '@/components/StatusChip.tsx'
import { cn } from '@/lib/utils'

// A project card for Home's selected work and /work (design package §4.4): a screenshot, or a typographic
// architecture thumbnail drawn from tokens when there is none. No stock imagery and no invented metrics.

/** The project's architecture as labelled boxes, left to right, joined by accent connectors. */
export function ArchitectureThumb({ boxes, className }: { boxes: readonly string[]; className?: string }) {
  return (
    <div aria-hidden="true" className={cn('flex items-center justify-center px-4', className)}>
      {boxes.map((box, i) => (
        <Fragment key={box}>
          {i > 0 && <span className="h-px w-4 shrink-0 bg-accent" />}
          <span className="min-w-0 rounded-sm border border-border-strong bg-surface px-2 py-1.5 text-center font-mono text-mono-s text-ink">
            {box}
          </span>
        </Fragment>
      ))}
    </div>
  )
}

interface ProjectCardProps {
  project: ProjectMeta
  /** Extra classes for the thumbnail, e.g. to drop it on phones. */
  thumbClassName?: string
  className?: string
}

export function ProjectCard({ project, thumbClassName, className }: ProjectCardProps) {
  const thumb = cn('h-37.5 border-b border-border bg-sunken', thumbClassName)
  return (
    <Link
      to={`/work/${project.slug}`}
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border border-border bg-surface text-ink transition-colors duration-colour hover:border-border-strong',
        className,
      )}
    >
      {project.screenshot ? (
        <img src={project.screenshot} alt="" decoding="async" loading="lazy" className={cn(thumb, 'w-full object-cover')} />
      ) : (
        <ArchitectureThumb boxes={project.architecture} className={thumb} />
      )}
      <div className="flex flex-col gap-2.5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-sans text-h3 font-semibold">{project.title}</h3>
          {project.status === 'in-flight' ? (
            <StatusChip status="in-flight" />
          ) : (
            <StatusChip status="delivered" period={String(project.year)} />
          )}
        </div>
        <p className="font-serif text-body text-ink-2">{project.summary}</p>
        <ul aria-label="Stack" className="flex flex-wrap gap-1.5">
          {project.stack.slice(0, 3).map((item) => (
            <li key={item} className="rounded-sm border border-border px-2 py-0.5 text-label text-muted">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  )
}
