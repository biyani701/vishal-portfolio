import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router'
import type { ProjectMeta } from '@content/schema.ts'
import { ProjectCard } from '@/components/ProjectCard.tsx'
import { featuredProgrammes, featuredTools, profile, projects } from '@/content/index.ts'
import { useOpenAsk } from '@/features/ask/entry-context.ts'
import { AskLink } from '@/features/ask/entry.tsx'
import { askHref } from '@/features/ask/request.ts'
import { cn } from '@/lib/utils'
import { Button } from '@/ui/button.tsx'
import { Input } from '@/ui/input.tsx'

// Home's sections below the hero and the Programme Line (specs/portfolio-narrative "Home story order"; the
// Programme canvas Home artboards). Each opens with the 2px ledger rule (§3 "Plan, proof, status").

const ledger = 'border-t-2 border-border-strong pt-4'
const arrowLink = 'inline-flex min-h-target items-center font-semibold text-accent underline-offset-4 hover:underline'

function SectionHeading({ id, children, action }: { id: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className={cn(ledger, 'flex flex-wrap items-baseline justify-between gap-x-6')}>
      <h2 id={id} className="font-sans text-h2 font-semibold">
        {children}
      </h2>
      {action}
    </div>
  )
}

/** The proof figures: four columns, or 2 × 2 on phones. Compact landscape shows them in the hero instead. */
export function ProofLedger() {
  return (
    <section aria-labelledby="proof-heading" className="compact-landscape:hidden">
      <h2 id="proof-heading" className="sr-only">
        Proof
      </h2>
      <ul className="grid grid-cols-2 gap-px border-t-2 border-border-strong bg-border tablet:grid-cols-4 desktop:grid-cols-4">
        {profile.proof.map((item) => (
          <li key={item.label} className="flex flex-col gap-1 bg-bg py-5 pr-4 pl-5 first:pl-0 mobile:odd:pl-0 mobile:even:pl-4">
            <span className="font-sans text-h1 font-semibold tabular-nums">{item.value}</span>
            <span className="text-label text-muted">{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function FeaturedProjects({ id, title, kind, items }: { id: string; title: string; kind: ProjectMeta['kind']; items: readonly ProjectMeta[] }) {
  const all = projects.filter((project) => project.kind === kind).length
  return (
    <section aria-labelledby={id} className="flex flex-col gap-5">
      <SectionHeading
        id={id}
        action={
          <Link to={`/work?kind=${kind}`} className={arrowLink}>
            All {all} {kind === 'programme' ? 'programmes' : 'tools'} →
          </Link>
        }
      >
        {title}
      </SectionHeading>
      <ul className="grid gap-5 tablet:grid-cols-2 desktop:grid-cols-3 compact-landscape:grid-cols-2">
        {items.map((project) => (
          <li key={project.slug} className="flex">
            <ProjectCard project={project} thumbClassName="mobile:hidden" className="flex-1" />
          </li>
        ))}
      </ul>
    </section>
  )
}

/** The programme case studies: the leadership story's proof, before any tool. */
export function ProgrammesLed() {
  return <FeaturedProjects id="programmes-heading" title="Programmes I’ve led" kind="programme" items={featuredProgrammes} />
}

/** Tools built to remove delivery friction: supporting evidence, after the programmes. */
export function DeliveryTools() {
  return <FeaturedProjects id="tools-heading" title="Delivery tools" kind="tool" items={featuredTools} />
}

// Starters shown under the question input; each opens Ask with the question filled in.
const suggestions = ['How did he run delivery at CoreCard?', 'What did he change at the IFC?', 'Which tools has he built for delivery?']

/** The Home question input: one of Ask's four entry points. It never opens Ask on its own. */
export function AskPrompt() {
  const open = useOpenAsk()
  const inputId = useId()
  const [question, setQuestion] = useState('')

  // Asking is the visitor's action: the question is sent when they press Ask, never before.
  const submit = (event: FormEvent) => {
    event.preventDefault()
    open(askHref({ q: question.trim() }))
  }

  return (
    <section aria-labelledby="ask-heading" className={cn(ledger, 'grid gap-6 desktop:grid-cols-12 desktop:gap-x-6')}>
      <div className="flex flex-col gap-2.5 desktop:col-span-4">
        <h2 id="ask-heading" className="font-sans text-h2 font-semibold">
          Ask the portfolio
        </h2>
        <p className="font-serif text-lede text-ink-2">
          Short on time? Ask a question. Answers come only from this site and name their sources.
        </p>
      </div>
      <form onSubmit={submit} className="flex flex-col gap-3.5 desktop:col-span-7 desktop:col-start-6">
        <label htmlFor={inputId} className="font-mono text-mono-s text-muted uppercase">
          Your question
        </label>
        <div className="flex gap-2">
          <Input
            id={inputId}
            name="q"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Has he run fixed-price delivery for regulated clients?"
            autoComplete="off"
            className="h-13 border-border-strong font-serif text-lede"
          />
          <Button type="submit" size="lg" className="h-13">
            Ask
          </Button>
        </div>
        <ul className="flex flex-wrap gap-x-6">
          {suggestions.map((suggestion) => (
            <li key={suggestion}>
              <AskLink to={askHref({ prefill: suggestion })} className={cn(arrowLink, 'font-normal')}>
                {suggestion} →
              </AskLink>
            </li>
          ))}
        </ul>
      </form>
    </section>
  )
}

export function ContactBand() {
  return (
    <section
      aria-labelledby="contact-heading"
      className="flex flex-col gap-4 border-t-2 border-border-strong py-6 tablet:flex-row tablet:items-center tablet:justify-between tablet:gap-8 desktop:flex-row desktop:items-center desktop:justify-between desktop:gap-8 desktop:py-11"
    >
      <h2 id="contact-heading" className="max-w-195 font-sans text-h2 font-semibold">
        Running a programme that has to land? <span className="text-accent">Let's talk.</span>
      </h2>
      <Link
        to="/contact"
        className="inline-flex h-13 shrink-0 items-center justify-center rounded-md bg-ink px-6 font-semibold text-bg transition-colors duration-colour hover:bg-ink-2"
      >
        Start a conversation
      </Link>
    </section>
  )
}
