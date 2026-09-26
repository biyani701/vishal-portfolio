import type { Ref } from 'react'
import { Link } from 'react-router'
import { roleDates } from '@content/derive.ts'
import type { Organisation, ProjectMeta, Role } from '@content/schema.ts'
import { StatusChip } from '@/components/StatusChip.tsx'
import { cn } from '@/lib/utils'

// The role panel on Experience (specs/content-pages "Experience"; design package §9 "RolePanel"): dates,
// status, achievements, skills evidenced, "Ask about this role", and earlier/later links that select the
// neighbouring roles. Links keep the scroll position; the page brings the panel into view when it has to.

interface RolePanelProps {
  role: Role
  organisation: Organisation
  /** 1-based position, oldest first, and the number of roles. */
  position: number
  total: number
  earlier?: Role
  later?: Role
  projects: readonly ProjectMeta[]
  ref?: Ref<HTMLElement>
}

const kicker = 'font-mono text-mono-s text-muted uppercase'
const textLink = 'inline-flex min-h-target items-center font-semibold text-accent underline-offset-4 hover:underline'
const select = (role: Role) => ({ to: `/experience#${role.id}`, preventScrollReset: true, replace: true })

export function RolePanel({ role, organisation, position, total, earlier, later, projects, ref }: RolePanelProps) {
  const askUrl = `/ask?${new URLSearchParams({ about: `/experience#${role.id}` })}`
  const context = [organisation.name, role.client && `for ${role.client}`, role.note].filter(Boolean).join(' · ')

  return (
    <section
      ref={ref}
      aria-labelledby="role-heading"
      data-role-panel={role.id}
      className="grid gap-8 rounded-lg border border-border bg-surface p-5 tablet:p-8 desktop:grid-cols-12 desktop:gap-x-10 desktop:p-8"
    >
      <div className="flex flex-col gap-3 desktop:col-span-5">
        <p className={kicker}>
          {role.label} · Engagement {position} of {total}
        </p>
        <h2 id="role-heading" className="font-sans text-h2 font-semibold">
          {role.title}
        </h2>
        <p className="font-serif text-lede text-ink-2">{context}</p>
        <p className="font-mono text-mono-s text-muted tabular-nums">
          {roleDates(role)}
          {role.location && ` · ${role.location}`}
        </p>
        <div>{role.end ? <StatusChip status="delivered" period={role.end.slice(0, 4)} /> : <StatusChip status="in-flight" />}</div>
        <Link to={askUrl} className={cn(textLink, 'self-start')}>
          Ask about this role →
        </Link>
      </div>

      <div className="flex flex-col gap-6 desktop:col-span-7">
        <div className="flex flex-col gap-2">
          <h3 className={kicker}>Outcomes</h3>
          <ul className="flex list-disc flex-col gap-2 pl-5 font-serif text-prose text-ink-2 marker:text-muted">
            {role.outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </div>
        {role.skills.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className={kicker}>Skills evidenced</h3>
            <ul className="flex flex-wrap gap-1.5">
              {role.skills.map((skill) => (
                <li key={skill} className="rounded-sm border border-border px-2 py-0.5 text-label text-ink-2">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}
        {projects.length > 0 && (
          <div className="flex flex-col gap-1">
            <h3 className={kicker}>Projects</h3>
            <ul className="flex flex-wrap gap-x-4">
              {projects.map((project) => (
                <li key={project.slug}>
                  <Link to={`/work/${project.slug}`} className={textLink}>
                    {project.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <nav aria-label="Other roles" className="flex flex-wrap justify-between gap-x-6 border-t border-border pt-3 desktop:col-span-12">
        {earlier ? (
          <Link {...select(earlier)} className={textLink}>
            ← Earlier: {earlier.label}
          </Link>
        ) : (
          <span />
        )}
        {later && (
          <Link {...select(later)} className={cn(textLink, 'ml-auto')}>
            Later: {later.label} →
          </Link>
        )}
      </nav>
    </section>
  )
}
