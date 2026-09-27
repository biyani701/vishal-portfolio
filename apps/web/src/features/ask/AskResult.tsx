import { Link } from 'react-router'
import { roleDates, roleStatus } from '@content/derive.ts'
import { ProgrammeLine } from '@/components/programme/ProgrammeLine.tsx'
import { ProjectCard } from '@/components/ProjectCard.tsx'
import { StatusChip } from '@/components/StatusChip.tsx'
import { organisations, projects, roles } from '@/content/index.ts'
import type { Step } from './model.ts'
import { resultsOf } from './results.ts'
import type { Role } from '@content/schema.ts'

// Tool results as site components (specs/ask-experience "Answer structure"; design package §8): compact project
// cards that link to the case studies, role cards, and the Programme Line for the whole career. Records are
// looked up in the site's own content by id, so a card shows exactly what the site shows.

function RoleCard({ id }: { id: string }) {
  const role = (roles as readonly Role[]).find((r) => r.id === id)
  const org = role && organisations.find((o) => o.id === role.org)
  if (!role || !org) return null
  return (
    <Link
      to={`/experience#${role.id}`}
      className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4 text-ink transition-colors duration-colour hover:border-border-strong"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-sans text-h3 font-semibold">{role.title}</h3>
        {roleStatus(role) === 'in-flight' ? <StatusChip status="in-flight" /> : <StatusChip status="delivered" period={roleDates(role)} />}
      </div>
      <p className="text-label text-muted">
        {org.name}
        {role.client && ` · for ${role.client}`} · {roleDates(role)}
      </p>
    </Link>
  )
}

export function AskResult({ steps }: { steps: readonly Step[] }) {
  const shown = resultsOf(steps)
  const cards = shown.projects.map((slug) => projects.find((p) => p.slug === slug)).filter((p) => p !== undefined)
  if (!cards.length && !shown.roles.length && !shown.programme) return null
  return (
    <div className="flex flex-col gap-4">
      {shown.programme && <ProgrammeLine />}
      {shown.roles.length > 0 && (
        <ul aria-label="Roles" className="grid gap-3 tablet:grid-cols-2 desktop:grid-cols-2">
          {shown.roles.map((id) => (
            <li key={id} className="flex">
              <RoleCard id={id} />
            </li>
          ))}
        </ul>
      )}
      {cards.length > 0 && (
        <ul aria-label="Projects" className="grid gap-3 tablet:grid-cols-2 desktop:grid-cols-2">
          {cards.map((project) => (
            <li key={project.slug} className="flex">
              <ProjectCard project={project} compact className="flex-1" />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
