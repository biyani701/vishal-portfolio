import type { ReactNode } from 'react'
import { Link, useLoaderData, type LoaderFunctionArgs } from 'react-router'
import type { ProjectMeta } from '@content/schema.ts'
import { ArchitectureFigure } from '@/components/ArchitectureFigure.tsx'
import { MarkdownContent } from '@/components/MarkdownContent.tsx'
import { StatusChip } from '@/components/StatusChip.tsx'
import { TableOfContents } from '@/components/TableOfContents.tsx'
import { loadProject, projectDomains, projects, roles } from '@/content/index.ts'
import { stackSlug } from '@/features/work/filters.ts'
import { relatedProjects, rolesForProject } from '@/features/work/related.ts'
import { PageShell } from '@/layout/PageShell.tsx'
import { cn } from '@/lib/utils'
import { Component as NotFound } from './not-found.tsx'

// /work/:slug (specs/content-pages "Work"; task 8.2): header with status, facts, then ToC · reading · aside on
// desktop (design package §7). Tablet and compact landscape keep the ToC as a side column with the aside under
// the reading column; phones fold the ToC into a disclosure. The body is loaded with the route, so the page
// never renders half-empty.

export async function loader({ params }: LoaderFunctionArgs) {
  return (await loadProject(params.slug ?? '')) ?? null
}

const TYPE_LABELS: Record<ProjectMeta['type'], string> = { personal: 'Personal', 'open-source': 'Open source', work: 'Work' }
const LINK_LABELS: Record<keyof ProjectMeta['links'], string> = {
  github: 'GitHub',
  docs: 'Documentation',
  demo: 'Live site',
  pypi: 'PyPI',
  bitbucket: 'Bitbucket',
}

const kicker = 'font-mono text-mono-s text-muted uppercase'
const ledger = 'border-t-2 border-border-strong pt-4'
const textLink = 'inline-flex min-h-target items-center text-accent underline-offset-4 hover:underline'

function Fact({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <dt className={kicker}>{label}</dt>
      <dd className="text-body text-ink">{children}</dd>
    </div>
  )
}

/** Inline links separated by commas; each is a full-height target. */
function LinkList({ items }: { items: { to: string; label: string; external?: boolean }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4">
      {items.map((item) =>
        item.external ? (
          <li key={item.to}>
            <a href={item.to} className={textLink}>
              {item.label} ↗
            </a>
          </li>
        ) : (
          <li key={item.to}>
            <Link to={item.to} className={textLink}>
              {item.label}
            </Link>
          </li>
        ),
      )}
    </ul>
  )
}

function Facts({ meta }: { meta: ProjectMeta }) {
  const links = (Object.entries(meta.links) as [keyof ProjectMeta['links'], string][]).map(([key, href]) => ({
    to: href,
    label: LINK_LABELS[key],
    external: true,
  }))
  return (
    <dl className={cn(ledger, 'grid grid-cols-2 gap-x-6 gap-y-4 tablet:grid-cols-4 desktop:grid-cols-4 compact-landscape:grid-cols-4')}>
      <Fact label="Year">{meta.year}</Fact>
      <Fact label="Type">{TYPE_LABELS[meta.type]}</Fact>
      <Fact label="Domain" className="col-span-2">
        <LinkList items={meta.domains.map((domain) => ({ to: `/work?domain=${domain}`, label: projectDomains[domain as keyof typeof projectDomains] ?? domain }))} />
      </Fact>
      <Fact label="Stack" className={cn('col-span-2', links.length === 0 && 'col-span-full')}>
        <LinkList items={meta.stack.map((name) => ({ to: `/work?stack=${stackSlug(name)}`, label: name }))} />
      </Fact>
      {links.length > 0 && (
        <Fact label="Links" className="col-span-2">
          <LinkList items={links} />
        </Fact>
      )}
      {meta.outcomes.length > 0 && (
        <Fact label="Outcomes" className="col-span-full">
          <ul className="flex list-disc flex-col gap-1 pl-5 font-serif text-prose text-ink-2">
            {meta.outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </Fact>
      )}
    </dl>
  )
}

function Aside({ meta, className }: { meta: ProjectMeta; className?: string }) {
  const related = relatedProjects(meta, projects)
  const builtIn = rolesForProject(meta.slug, roles)
  // Ask reads the page it was opened from (task 11.6 turns this into project context and a suggested question).
  const askUrl = `/ask?${new URLSearchParams({ about: `/work/${meta.slug}` })}`

  return (
    <aside aria-label="About this project" className={cn('flex flex-col gap-8', className)}>
      <section aria-labelledby="ask-about-heading" className={cn(ledger, 'flex flex-col gap-2')}>
        <h2 id="ask-about-heading" className={kicker}>
          Questions
        </h2>
        <p className="font-serif text-body text-ink-2">Ask about {meta.title}. Answers come only from this site.</p>
        <Link to={askUrl} className="inline-flex min-h-target items-center font-semibold text-accent underline-offset-4 hover:underline">
          Ask about this →
        </Link>
      </section>

      {builtIn.length > 0 && (
        <section aria-labelledby="roles-heading" className={cn(ledger, 'flex flex-col gap-2')}>
          <h2 id="roles-heading" className={kicker}>
            Built during
          </h2>
          <LinkList items={builtIn.map((role) => ({ to: `/experience#${role.id}`, label: `${role.title}, ${role.label}` }))} />
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className={cn(ledger, 'flex flex-col gap-1')}>
          <h2 id="related-heading" className={kicker}>
            Related work
          </h2>
          <ul>
            {related.map((project) => (
              <li key={project.slug}>
                <Link to={`/work/${project.slug}`} className="flex min-h-target flex-col gap-0.5 border-b border-border py-3 text-ink hover:text-accent">
                  <span className="font-sans text-body font-semibold">{project.title}</span>
                  <span className="text-label text-muted">{project.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Link to="/work" className={cn(textLink, 'font-semibold')}>
        All {projects.length} projects →
      </Link>
    </aside>
  )
}

export function Component() {
  const project = useLoaderData<typeof loader>()
  if (!project) return <NotFound />

  const { meta, html, headings } = project
  const hasToc = headings.length > 0
  const side = 'tablet:col-span-3 desktop:col-span-3 compact-landscape:col-span-3'
  const reading = hasToc
    ? 'tablet:col-span-5 desktop:col-span-6 compact-landscape:col-span-5'
    : 'tablet:col-span-8 desktop:col-span-9 compact-landscape:col-span-8'

  return (
    // Keyed by slug so moving to a related case study starts with a fresh page (closed ToC, no stale state).
    <PageShell key={meta.slug} className="flex flex-col gap-section">
      <header className="flex max-w-195 flex-col gap-3">
        <nav aria-label="Breadcrumb">
          <Link to="/work" className={cn(kicker, 'inline-flex min-h-target items-center hover:text-accent')}>
            ← Work
          </Link>
        </nav>
        <h1 className="font-sans text-h1 font-semibold">{meta.title}</h1>
        <p className="font-serif text-lede text-ink-2">{meta.summary}</p>
        <div className="flex flex-wrap items-center gap-2">
          {meta.status === 'in-flight' ? <StatusChip status="in-flight" /> : <StatusChip status="delivered" period={String(meta.year)} />}
        </div>
      </header>

      <Facts meta={meta} />

      <div className="grid gap-x-10 gap-y-section tablet:grid-cols-8 desktop:grid-cols-12 compact-landscape:grid-cols-8">
        {hasToc && <TableOfContents headings={headings} className={cn(side, 'self-start tablet:sticky-below-header desktop:sticky-below-header compact-landscape:sticky-below-header')} />}
        <article className={cn('flex min-w-0 flex-col gap-8', reading)}>
          <ArchitectureFigure title={meta.title} boxes={meta.architecture} />
          <MarkdownContent html={html} />
        </article>
        <Aside
          meta={meta}
          className={cn(
            'desktop:col-span-3',
            hasToc ? 'tablet:col-span-5 tablet:col-start-4 compact-landscape:col-span-5 compact-landscape:col-start-4' : 'tablet:col-span-8 compact-landscape:col-span-8',
          )}
        />
      </div>
    </PageShell>
  )
}
