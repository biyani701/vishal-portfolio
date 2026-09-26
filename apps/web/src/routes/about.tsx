import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { CredentialsLedger } from '@/components/CredentialsLedger.tsx'
import { about, profile } from '@/content/index.ts'
import { PageShell } from '@/layout/PageShell.tsx'

// /about (specs/content-pages "About, Colophon and Legal"; task 7.2): story, working principles and credentials,
// without the portrait (DD-4: Home only, lint-enforced). While content/about.ts is a draft, the page says so at
// the top and marks each draft section, so placeholder copy is never mistaken for the owner's words.

const firstName = profile.name.split(' ')[0]
const kicker = 'font-mono text-mono-s text-muted uppercase'
const arrowLink = 'inline-flex min-h-target items-center font-semibold text-accent underline-offset-4 hover:underline'

function DraftMark() {
  return (
    <span data-placeholder className="rounded-full border border-dashed border-border-control px-2.5 py-0.5 font-mono text-mono-s text-muted uppercase">
      Draft copy
    </span>
  )
}

function Section({ id, title, draft = false, children }: { id: string; title: string; draft?: boolean; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="flex flex-col gap-5 border-t-2 border-border-strong pt-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h2 id={`${id}-title`} className="font-sans text-h2 font-semibold">
          {title}
        </h2>
        {draft && <DraftMark />}
      </div>
      {children}
    </section>
  )
}

export function Component() {
  return (
    <PageShell className="flex flex-col gap-section">
      <div className="flex max-w-195 flex-col gap-3">
        <h1 className="font-sans text-h1 font-semibold">About</h1>
        <p className="font-serif text-lede text-ink-2">{profile.lede}</p>
      </div>

      {about.draft && (
        <aside aria-label="Placeholder copy" data-placeholder className="flex max-w-195 flex-col gap-1 rounded-md border border-dashed border-border-control bg-sunken p-4">
          <p className={kicker}>Placeholder copy</p>
          <p className="text-body text-ink-2">
            The story and principles on this page are a draft assembled from the Experience record. They will be replaced
            with {firstName}’s own words.
          </p>
        </aside>
      )}

      <Section id="summary" title="Story" draft={about.draft}>
        <div className="flex max-w-195 flex-col gap-5 font-serif text-prose text-ink-2">
          {about.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Section>

      <Section id="principles" title="How I work" draft={about.draft}>
        <ol className="grid gap-x-10 gap-y-6 tablet:grid-cols-2 desktop:grid-cols-2 compact-landscape:grid-cols-2">
          {about.principles.map((principle, i) => (
            <li key={principle.title} className="flex flex-col gap-2 border-t border-border pt-3">
              <span aria-hidden="true" className="font-mono text-mono-s text-muted tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-sans text-h3 font-semibold">{principle.title}</h3>
              <p className="font-serif text-body text-ink-2">{principle.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="credentials" title="Credentials">
        <CredentialsLedger />
      </Section>

      <nav aria-label="More about Vishal" className="flex flex-wrap gap-x-8 gap-y-1 border-t border-border pt-4">
        <Link to="/experience" className={arrowLink}>
          Roles and outcomes →
        </Link>
        <Link to="/work" className={arrowLink}>
          Projects →
        </Link>
        <a href={profile.links.linkedin} className={arrowLink}>
          LinkedIn ↗
        </a>
        <a href={profile.links.github} className={arrowLink}>
          GitHub ↗
        </a>
        <Link to="/contact" className={arrowLink}>
          Get in touch →
        </Link>
      </nav>
    </PageShell>
  )
}
