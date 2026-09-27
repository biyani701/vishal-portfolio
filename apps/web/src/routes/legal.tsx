import { useMatches } from 'react-router'
import type { LegalPage } from '@content/schema.ts'
import { legal } from '@/content/index.ts'
import { PageMeta } from '@/layout/PageMeta.tsx'
import { PageShell } from '@/layout/PageShell.tsx'

// /legal/privacy, /legal/terms and /colophon (specs/content-pages "About, Colophon and Legal"; task 10.5), from
// content/legal.ts. The route's handle names the document. While the owner hasn't reviewed the text, the page
// says it is a draft.

export interface LegalHandle {
  document: 'privacy' | 'terms' | 'colophon'
}

const PATHS: Record<LegalHandle['document'], string> = { privacy: '/legal/privacy', terms: '/legal/terms', colophon: '/colophon' }

const kicker = 'font-mono text-mono-s text-muted uppercase'

const updated = new Date(`${legal.updated}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

export function Component() {
  const { document } = useMatches().at(-1)!.handle as LegalHandle
  const page: LegalPage = legal[document]
  return (
    <PageShell className="flex flex-col gap-10">
      <PageMeta title={page.title} description={page.summary} path={PATHS[document]} />
      <div className="flex max-w-195 flex-col gap-3">
        <h1 className="font-sans text-h1 font-semibold">{page.title}</h1>
        <p className="font-serif text-lede text-ink-2">{page.summary}</p>
        <p className={kicker}>
          Last updated <time dateTime={legal.updated}>{updated}</time>
        </p>
      </div>

      {legal.draft && (
        <aside aria-label="Draft" data-placeholder className="flex max-w-195 flex-col gap-1 rounded-md border border-dashed border-border-control bg-sunken p-4">
          <p className={kicker}>Draft</p>
          <p className="text-body text-ink-2">This text describes how the site works today and is waiting for Vishal’s review.</p>
        </aside>
      )}

      <div className="flex max-w-195 flex-col gap-8">
        {page.sections.map((section) => (
          <section key={section.title} aria-labelledby={slug(section.title)} className="flex flex-col gap-3 border-t border-border pt-4">
            <h2 id={slug(section.title)} className="font-sans text-h3 font-semibold">
              {section.title}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="font-serif text-prose text-ink-2">
                {paragraph}
              </p>
            ))}
            {section.items && (
              <ul className="flex list-disc flex-col gap-1.5 pl-6 font-serif text-prose text-ink-2">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </PageShell>
  )
}

const slug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
