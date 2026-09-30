import { Fragment, type ReactNode } from 'react'
import { Link, useMatches } from 'react-router'
import type { LegalPage } from '@content/schema.ts'
import { legal } from '@/content/index.ts'
import { PageMeta } from '@/layout/PageMeta.tsx'
import { PageShell } from '@/layout/PageShell.tsx'

// /legal/privacy, /legal/terms and /colophon (specs/content-pages "About, Colophon and Legal"; task 10.5), from
// content/legal.ts. The route's handle names the document. Sections are headed h2 under the page's h1; text may
// carry [label](href) links, and a section may add a plain-text flow drawing and a table (content/schema.ts).

export interface LegalHandle {
  document: 'privacy' | 'terms' | 'colophon'
}

type Section = LegalPage['sections'][number]

const PATHS: Record<LegalHandle['document'], string> = { privacy: '/legal/privacy', terms: '/legal/terms', colophon: '/colophon' }

const kicker = 'font-mono text-mono-s text-muted uppercase'
const prose = 'font-serif text-prose text-ink-2'
const caption = 'font-sans text-label text-muted'
const link = 'text-accent underline underline-offset-4 hover:text-accent-hover'

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
          Last updated: <time dateTime={legal.updated}>{updated}</time>
        </p>
      </div>

      <div className="flex max-w-195 flex-col gap-8">
        {page.sections.map((section) => (
          <LegalSection key={section.title} section={section} />
        ))}
      </div>
    </PageShell>
  )
}

function LegalSection({ section }: { section: Section }) {
  const id = slug(section.title)
  return (
    <section aria-labelledby={id} className="flex min-w-0 flex-col gap-3 border-t border-border pt-4">
      <h2 id={id} className="font-sans text-h3 font-semibold">
        {section.title}
      </h2>
      <Paragraphs texts={section.paragraphs} />
      {section.diagram && (
        <figure className="flex min-w-0 flex-col gap-2">
          {/* Focusable so keyboard users can scroll it on narrow screens; the words are in its label. */}
          <pre role="img" aria-label={section.diagram.alt} tabIndex={0} className="overflow-x-auto rounded-md border border-border bg-sunken p-4 font-mono text-label text-ink">
            {section.diagram.drawing}
          </pre>
          <figcaption className={caption}>{section.diagram.caption}</figcaption>
        </figure>
      )}
      {section.table && (
        <table className="w-full border-collapse text-left font-sans text-body text-ink-2">
          <caption className={`${caption} pb-2 text-left`}>{section.table.caption}</caption>
          <thead>
            <tr>
              {section.table.columns.map((column) => (
                <th key={column} scope="col" className="border-b border-border-strong px-3 py-2 align-bottom font-semibold text-ink first:pl-0">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.table.rows.map(([service, ...cells]) => (
              <tr key={service}>
                <th scope="row" className="border-b border-border px-3 py-2 align-top font-semibold text-ink first:pl-0">
                  {service}
                </th>
                {cells.map((cell) => (
                  <td key={cell} className="border-b border-border px-3 py-2 align-top break-words">
                    <Inline text={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {section.items && (
        <ul className={`flex list-disc flex-col gap-1.5 pl-6 ${prose}`}>
          {section.items.map((item) => (
            <li key={item}>
              <Inline text={item} />
            </li>
          ))}
        </ul>
      )}
      {section.after && <Paragraphs texts={section.after} />}
    </section>
  )
}

function Paragraphs({ texts }: { texts: readonly string[] }) {
  return texts.map((text) => (
    <p key={text} className={prose}>
      <Inline text={text} />
    </p>
  ))
}

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g

/** Text with [label](href) links: site paths through the router, anything else as a plain link. */
function Inline({ text }: { text: string }) {
  const parts: ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(LINK)) {
    const [whole, label = '', href = ''] = match
    parts.push(text.slice(last, match.index))
    parts.push(
      href.startsWith('/') ? (
        <Link key={match.index} to={href} className={link}>
          {label}
        </Link>
      ) : (
        <a key={match.index} href={href} className={link}>
          {label}
        </a>
      ),
    )
    last = match.index + whole.length
  }
  parts.push(text.slice(last))
  return <Fragment>{parts}</Fragment>
}

const slug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
