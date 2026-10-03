import { useId } from 'react'
import { useSearchParams } from 'react-router'
import { ProjectCard } from '@/components/ProjectCard.tsx'
import { projectDomains, projects } from '@/content/index.ts'
import {
  domainOptions,
  filterProjects,
  kindOptions,
  readFilters,
  stackOptions,
  writeFilters,
  type FilterOption,
  type WorkFilters,
} from '@/features/work/filters.ts'
import { PageMeta } from '@/layout/PageMeta.tsx'
import { PageShell } from '@/layout/PageShell.tsx'
import { Button } from '@/ui/button.tsx'
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/ui/combobox'
import { ToggleGroup, ToggleGroupItem } from '@/ui/toggle-group.tsx'

// /work (specs/content-pages "Work"; specs/portfolio-narrative "Project kinds on Work"): every project as a
// ProjectCard, programmes first, filtered by one kind, one domain and one stack. The filters live in the URL, so a filtered list can be shared and Back restores it; changing a
// filter replaces the history entry rather than adding one per click.

const KINDS = kindOptions(projects)
const DOMAINS = domainOptions(projects, projectDomains)
const STACKS = stackOptions(projects)
const ALL = 'all'

const kicker = 'font-mono text-mono-s text-muted uppercase'

export function Component() {
  const [params, setParams] = useSearchParams()
  const filters = readFilters(params, DOMAINS, STACKS, KINDS)
  const shown = filterProjects(projects, filters)
  const stackId = useId()

  const update = (next: WorkFilters) =>
    setParams(writeFilters(params, { ...filters, ...next }), { replace: true, preventScrollReset: true })
  const selectedStack = STACKS.find((option) => option.value === filters.stack) ?? null
  const filtered = Boolean(filters.kind || filters.domain || filters.stack)

  return (
    <PageShell className="flex flex-col gap-section">
      <PageMeta title="Work" description="Programmes Vishal Biyani has led, and the tools built alongside them, filterable by kind, domain and stack." path="/work" />
      <div className="flex max-w-195 flex-col gap-3">
        <h1 className="font-sans text-h1 font-semibold">Work</h1>
        <p className="font-serif text-lede text-ink-2">
          Programmes I’ve led, told as problem, action and outcome, and the tools built alongside them to remove
          delivery friction.
        </p>
      </div>

      <section aria-label="Filters" className="flex flex-col gap-4 border-t-2 border-border-strong pt-4">
        <div className="flex flex-col gap-2">
          <span id="kind-label" className={kicker}>
            Kind
          </span>
          <ToggleGroup
            aria-labelledby="kind-label"
            className="flex-wrap"
            value={[filters.kind ?? ALL]}
            onValueChange={([next]: string[]) => next && update({ kind: next === ALL ? undefined : next })}
          >
            {[{ value: ALL, label: 'All', count: projects.length }, ...KINDS].map((option) => (
              <ToggleGroupItem
                key={option.value}
                value={option.value}
                variant="outline"
                className="aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-bg"
              >
                {option.label}
                <span className="font-mono text-mono-s opacity-70">{option.count}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="flex flex-col gap-2">
          <span id="domain-label" className={kicker}>
            Domain
          </span>
          <ToggleGroup
            aria-labelledby="domain-label"
            className="flex-wrap"
            value={[filters.domain ?? ALL]}
            // Pressing the selected chip again would empty the group; keep the current choice instead.
            onValueChange={([next]: string[]) => next && update({ domain: next === ALL ? undefined : next })}
          >
            {[{ value: ALL, label: 'All', count: projects.length }, ...DOMAINS].map((option) => (
              <ToggleGroupItem
                key={option.value}
                value={option.value}
                variant="outline"
                className="aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-bg"
              >
                {option.label}
                <span className="font-mono text-mono-s opacity-70">{option.count}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={stackId} className={kicker}>
            Stack
          </label>
          <Combobox<FilterOption>
            items={STACKS}
            value={selectedStack}
            itemToStringLabel={(option) => option.label}
            isItemEqualToValue={(option, value) => option.value === value.value}
            onValueChange={(option) => update({ stack: option?.value })}
          >
            <ComboboxInput id={stackId} placeholder="Any stack" showClear={Boolean(selectedStack)} className="w-full max-w-80" />
            <ComboboxContent>
              <ComboboxEmpty>No stack matches</ComboboxEmpty>
              <ComboboxList>
                {(option: FilterOption) => (
                  <ComboboxItem key={option.value} value={option}>
                    {option.label}
                    <span className="ml-auto pr-6 font-mono text-mono-s text-muted">{option.count}</span>
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </section>

      <section aria-labelledby="results-heading" className="flex flex-col gap-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 id="results-heading" className="sr-only">
            Projects
          </h2>
          <p role="status" className="text-label text-muted">
            {filtered ? `${shown.length} of ${projects.length} projects` : `${projects.length} projects`}
          </p>
          {filtered && (
            <Button variant="ghost" onClick={() => update({ kind: undefined, domain: undefined, stack: undefined })}>
              Clear filters
            </Button>
          )}
        </div>
        {shown.length > 0 ? (
          <ul className="grid gap-5 tablet:grid-cols-2 desktop:grid-cols-3 compact-landscape:grid-cols-2">
            {shown.map((project) => (
              <li key={project.slug} className="flex">
                <ProjectCard project={project} thumbClassName="mobile:hidden" className="flex-1" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-serif text-lede text-ink-2">No project matches these filters. Try another kind, domain or stack.</p>
        )}
      </section>
    </PageShell>
  )
}
