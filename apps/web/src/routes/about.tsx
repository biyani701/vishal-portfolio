import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { CredentialsLedger } from '@/components/CredentialsLedger.tsx'
import { about, profile } from '@/content/index.ts'
import { PageMeta } from '@/layout/PageMeta.tsx'
import { PageShell } from '@/layout/PageShell.tsx'

// /about (specs/portfolio-narrative "About page"): the story as a career arc, "How I lead" with one example under
// each principle, and credentials, without the portrait (DD-4: Home only, lint-enforced).

const arrowLink = 'inline-flex min-h-target items-center font-semibold text-accent underline-offset-4 hover:underline'

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

export function Component() {
  return (
    <PageShell className="flex flex-col gap-section">
      <PageMeta title="About" description="The story, working principles and credentials behind the work." path="/about" />
      <div className="flex max-w-195 flex-col gap-3">
        <h1 className="font-sans text-h1 font-semibold">About</h1>
        <p className="font-serif text-lede text-ink-2">{profile.lede}</p>
      </div>

      <Section id="summary" title="Story">
        <div className="flex max-w-195 flex-col gap-5 font-serif text-prose text-ink-2">
          {about.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Section>

      <Section id="principles" title="How I lead">
        <ol className="grid gap-x-10 gap-y-6 tablet:grid-cols-2 desktop:grid-cols-2 compact-landscape:grid-cols-2">
          {about.principles.map((principle, i) => (
            <li key={principle.title} className="flex flex-col gap-2 border-t border-border pt-3">
              <span aria-hidden="true" className="font-mono text-mono-s text-muted tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-sans text-h3 font-semibold">{principle.title}</h3>
              {'text' in principle && <p className="font-serif text-body text-ink-2">{principle.text}</p>}
              <p className="text-label text-muted">
                <span className="font-semibold text-ink-2">In practice: </span>
                {principle.evidence}
              </p>
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
          Programmes and tools →
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
