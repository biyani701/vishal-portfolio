import type { Hub, Lab, Site } from '../../content/sites.ts'
import { hostOf, labUrl } from '../../content/sites.ts'
import { cn } from '../cn.ts'
import { Status } from './Status.tsx'

// The whole of www.biyani.xyz (specs/domain-hub "Hub content"): identity with the portfolio as the primary action,
// then Sites, then the quieter Labs, then the footer. Rendered to static HTML at build time (scripts/render.ts).

const kicker = 'font-mono text-mono-s uppercase text-muted'
const container = 'mx-auto w-full max-w-6xl px-page'
const sectionHeading = 'font-sans text-h2 font-semibold'
const textLink = 'inline-flex min-h-target items-center font-semibold text-accent underline-offset-4 hover:text-accent-hover hover:underline'

export function Page({ hub, year }: { hub: Hub; year: number }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <div aria-hidden="true" className="hub-backdrop pointer-events-none absolute inset-x-0 top-0 h-176" />
      <Header />
      <main id="main" className="relative flex flex-col gap-section pb-section">
        <Identity hub={hub} />
        <Sites sites={hub.sites} />
        <Labs labs={hub.labs} />
      </main>
      <Footer hub={hub} year={year} />
    </div>
  )
}

function Header() {
  return (
    <header className={cn(container, 'relative flex h-header items-center justify-between')}>
      <a href="/" className="inline-flex min-h-target items-center font-mono text-label font-semibold text-ink">
        biyani<span className="text-accent">.</span>xyz
      </a>
      {/* Shown by src/theme-toggle.ts; without JavaScript the page follows the system theme. */}
      <button
        type="button"
        hidden
        data-theme-toggle
        aria-label="Switch theme"
        className="inline-flex size-target items-center justify-center rounded-md border border-border bg-surface text-ink-2 transition-colors duration-colour hover:border-border-control hover:text-ink"
      >
        <svg data-icon="moon" aria-hidden="true" viewBox="0 0 24 24" className="size-4.5 fill-none stroke-current stroke-2">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg data-icon="sun" aria-hidden="true" viewBox="0 0 24 24" className="hidden size-4.5 fill-none stroke-current stroke-2">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
        </svg>
      </button>
    </header>
  )
}

function Identity({ hub }: { hub: Hub }) {
  const { identity } = hub
  return (
    <section aria-labelledby="identity-heading" className={cn(container, 'flex flex-col gap-6 pt-12 tablet:pt-16 desktop:pt-24')}>
      <p className={kicker}>www.biyani.xyz</p>
      <h1 id="identity-heading" className="max-w-4xl font-sans text-display font-semibold">
        {identity.name}
        <span className="hub-accent-text">.</span>
      </h1>
      <p className="max-w-2xl font-serif text-lede text-ink-2">{identity.line}</p>
      <div className="flex flex-wrap items-center gap-3 mobile:flex-col mobile:items-stretch">
        <a
          href={identity.portfolio}
          className="inline-flex h-target-primary items-center justify-center gap-2 rounded-md bg-accent-fill px-6 font-semibold text-on-accent transition-colors duration-colour hover:bg-accent-fill-hover"
        >
          Visit the portfolio <span aria-hidden="true">→</span>
        </a>
        <a
          href={identity.contact}
          className="inline-flex h-target-primary items-center justify-center rounded-md border border-border-control bg-surface px-6 font-semibold text-ink transition-colors duration-colour hover:border-ink"
        >
          Get in touch
        </a>
      </div>
    </section>
  )
}

function Sites({ sites }: { sites: Hub['sites'] }) {
  return (
    <section aria-labelledby="sites-heading" className={cn(container, 'flex flex-col gap-6')}>
      <div className="flex flex-col gap-2 border-t border-border pt-6">
        <p className={kicker}>On this domain</p>
        <h2 id="sites-heading" className={sectionHeading}>
          Sites
        </h2>
      </div>
      <ul className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-3 compact-landscape:grid-cols-3">
        {sites.map((site) => (
          <li key={site.id} className="flex">
            <SiteCard site={site} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function SiteCard({ site }: { site: Site }) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-mono-s text-muted">{hostOf(site.url)}</span>
        <Status live={site.live} />
      </div>
      <h3 className="font-sans text-h3 font-semibold">{site.name}</h3>
      <p className="flex-1 font-serif text-body text-ink-2">{site.purpose}</p>
      {site.live && (
        <span aria-hidden="true" className="font-semibold text-accent">
          Visit →
        </span>
      )}
    </>
  )
  const card = 'hub-card flex flex-1 flex-col gap-3 rounded-lg border border-border bg-surface p-6'
  // A site that isn't live yet has no link (specs/domain-hub "Site not live yet").
  return site.live ? (
    <a href={site.url} className={cn(card, 'text-ink')}>
      {body}
    </a>
  ) : (
    <div className={cn(card, 'bg-sunken')}>{body}</div>
  )
}

function Labs({ labs }: { labs: Hub['labs'] }) {
  return (
    <section aria-labelledby="labs-heading" className={cn(container, 'flex flex-col gap-4')}>
      <div className="flex flex-col gap-2 border-t border-border pt-6">
        <h2 id="labs-heading" className="font-sans text-h3 font-semibold">
          {labs.heading}
        </h2>
        <p className="font-serif text-body text-muted">{labs.intro}</p>
      </div>
      <ul className="flex flex-col">
        {labs.entries.map((lab) => (
          <li key={lab.path}>
            <LabRow lab={lab} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function LabRow({ lab }: { lab: Lab }) {
  return (
    <a
      href={labUrl(lab)}
      className="group flex min-h-target flex-col gap-1 border-b border-border py-3 text-ink-2 transition-colors duration-colour hover:text-ink tablet:flex-row tablet:items-baseline tablet:gap-6 desktop:flex-row desktop:items-baseline desktop:gap-6"
    >
      <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 tablet:w-64 tablet:shrink-0 tablet:flex-col desktop:w-80 desktop:shrink-0 desktop:flex-col">
        <span className="font-sans text-body font-semibold">{lab.name}</span>
        <span className="font-mono text-mono-s text-muted">/{lab.path}</span>
      </span>
      <span className="flex-1 text-label text-muted">{lab.description}</span>
      <span aria-hidden="true" className="text-muted transition-colors duration-colour group-hover:text-accent mobile:hidden">
        ↗
      </span>
    </a>
  )
}

function Footer({ hub, year }: { hub: Hub; year: number }) {
  return (
    <footer className={cn(container, 'relative mt-auto')}>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border py-6">
        <p className="text-label text-muted">
          © {year} {hub.identity.name}
        </p>
        <a href={hub.identity.contact} className={textLink}>
          Get in touch through the portfolio →
        </a>
      </div>
    </footer>
  )
}
