import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { ProjectCard } from '@/components/ProjectCard.tsx'
import { StatusChip } from '@/components/StatusChip.tsx'
import { featuredProjects, highlightedProjects, profile, projects } from '@/content/index.ts'
import { cn } from '@/lib/utils'
import { Button } from '@/ui/button.tsx'
import { Input } from '@/ui/input.tsx'

// Home's sections below the hero and the Programme Line (specs/content-pages "Home"; the Programme canvas
// Home artboards). Each opens with the 2px ledger rule (§3 "Plan, proof, status").

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

export function SelectedWork() {
  return (
    <section aria-labelledby="work-heading" className="flex flex-col gap-5">
      <SectionHeading
        id="work-heading"
        action={
          <Link to="/work" className={arrowLink}>
            All {projects.length} projects →
          </Link>
        }
      >
        Selected work
      </SectionHeading>
      <ul className="grid gap-5 tablet:grid-cols-2 desktop:grid-cols-3 compact-landscape:grid-cols-2">
        {featuredProjects.map((project) => (
          <li key={project.slug} className="flex">
            <ProjectCard project={project} thumbClassName="mobile:hidden" className="flex-1" />
          </li>
        ))}
      </ul>
    </section>
  )
}

// Starters shown under the question input; each opens Ask with the question filled in.
const suggestions = ['Compare his engineering projects', 'What did he run at the IFC?', 'What is he building now?']

const askUrl = (question: string) => (question ? `/ask?${new URLSearchParams({ q: question })}` : '/ask')

/** The Home question input: one of Ask's four entry points. It never opens Ask on its own. */
export function AskPrompt() {
  const navigate = useNavigate()
  const inputId = useId()
  const [question, setQuestion] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    navigate(askUrl(question.trim()))
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
              <Link to={askUrl(suggestion)} className={cn(arrowLink, 'font-normal')}>
                {suggestion} →
              </Link>
            </li>
          ))}
        </ul>
      </form>
    </section>
  )
}

/** The separately hosted projects (specs/content-pages "Home"), as rows so they don't repeat the cards above. */
export function HighlightedProjects() {
  return (
    <section aria-labelledby="highlighted-heading" className="flex flex-col gap-2.5">
      <SectionHeading id="highlighted-heading">Independent projects</SectionHeading>
      <p className="font-serif text-lede text-ink-2">Separate sites and repositories, each with its own architecture.</p>
      <ul>
        {highlightedProjects.map((project) => (
          <li key={project.slug}>
            <Link
              to={`/work/${project.slug}`}
              className="flex min-h-target flex-col gap-2 border-b border-border py-3.5 text-ink hover:text-accent tablet:flex-row tablet:items-baseline tablet:justify-between tablet:gap-6 desktop:flex-row desktop:items-baseline desktop:justify-between desktop:gap-6"
            >
              <span className="flex flex-col gap-1">
                <h3 className="font-sans text-h3 font-semibold">{project.title}</h3>
                <span className="font-serif text-body text-ink-2">{project.summary}</span>
              </span>
              {project.status === 'in-flight' ? (
                <StatusChip status="in-flight" className="self-start" />
              ) : (
                <StatusChip status="delivered" period={String(project.year)} className="self-start" />
              )}
            </Link>
          </li>
        ))}
      </ul>
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
