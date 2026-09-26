import { useEffect, useRef, type ReactNode } from 'react'
import { useLocation } from 'react-router'
import { roleDates } from '@content/derive.ts'
import type { Role } from '@content/schema.ts'
import { CapabilityMap } from '@/components/CapabilityMap.tsx'
import { CredentialsLedger } from '@/components/CredentialsLedger.tsx'
import { prefersReducedMotion } from '@/components/motion/useReducedMotion.ts'
import { ProgrammeLine } from '@/components/programme/ProgrammeLine.tsx'
import { RolePanel } from '@/components/RolePanel.tsx'
import { organisations, profile, projects, roles as contentRoles } from '@/content/index.ts'
import { PageShell } from '@/layout/PageShell.tsx'

// /experience (specs/content-pages "Experience"; task 7.1): the interactive Programme Line, the role panel,
// skills over time and the credentials ledger. The selected role is the URL hash (/experience#bfs-uk), so a
// role can be linked to and every way of choosing one (a segment, a row, the table, earlier/later) is a link.
// Without a role in the hash the current role is shown. Other hashes (#skills, #certifications) are sections.

// Widened from the literal content types, so lookups by id and dates type-check.
const roles: readonly Role[] = contentRoles
const current = roles.find((role) => !role.end) ?? roles[0]!

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="flex flex-col gap-5 border-t-2 border-border-strong pt-4">
      <h2 id={`${id}-title`} className="font-sans text-h2 font-semibold">
        {title}
      </h2>
      {children}
    </section>
  )
}

/** Brings the panel into view: always for a deep link, and after a selection only when it's out of sight. */
function usePanelInView(roleId: string, fromHash: boolean) {
  const panel = useRef<HTMLElement>(null)
  const first = useRef(true)

  useEffect(() => {
    const element = panel.current
    const isFirst = first.current
    first.current = false
    if (!element || !fromHash || !element.scrollIntoView) return
    const behavior = isFirst || prefersReducedMotion() ? 'auto' : 'smooth'
    const top = element.getBoundingClientRect().top
    const header = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
    // Rows sit above the panel on phones, so a tap there usually needs this; on desktop the panel is in view.
    if (isFirst || top < header || top > window.innerHeight * 0.6) element.scrollIntoView({ block: 'start', behavior })
  }, [roleId, fromHash])

  return panel
}

export function Component() {
  const { hash } = useLocation()
  const fromHash = roles.find((role) => role.id === decodeURIComponent(hash.slice(1)))
  const role = fromHash ?? current
  const index = roles.indexOf(role)
  const panel = usePanelInView(role.id, Boolean(fromHash))

  return (
    <PageShell className="flex flex-col gap-section">
      <div className="flex max-w-195 flex-col gap-3">
        <h1 className="font-sans text-h1 font-semibold">Experience</h1>
        <p className="font-serif text-lede text-ink-2">{profile.summary}</p>
      </div>

      <div className="flex flex-col gap-6">
        <ProgrammeLine selected={role.id} />
        <RolePanel
          ref={panel}
          role={role}
          organisation={organisations.find((org) => org.id === role.org)!}
          // Roles are newest first; positions count from the earliest.
          position={roles.length - index}
          total={roles.length}
          earlier={roles[index + 1]}
          later={roles[index - 1]}
          projects={projects.filter((project) => role.projects.includes(project.slug))}
        />
        {/* Live regions announce changes, not their first content: this speaks only when the selection changes. */}
        <p aria-live="polite" className="sr-only">
          Showing {role.title}, {role.label}, {roleDates(role)}
        </p>
      </div>

      <Section id="skills" title="Skills over time">
        <CapabilityMap />
      </Section>

      <Section id="credentials" title="Credentials">
        <CredentialsLedger />
      </Section>
    </PageShell>
  )
}
