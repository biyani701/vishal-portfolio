import { useId, useState } from 'react'
import { Link } from 'react-router'
import { periodLabel, roleDates, roleYears, type Milestone } from '@content/derive.ts'
import type { Organisation, Role } from '@content/schema.ts'
import { StatusChip } from '@/components/StatusChip.tsx'
import { milestones as allMilestones, organisations as allOrganisations, roles as allRoles } from '@/content/index.ts'
import { cn } from '@/lib/utils'
import { ScrollArea, ScrollBar } from '@/ui/scroll-area.tsx'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip.tsx'
import {
  buildProgramme,
  describeProgramme,
  fractionalYear,
  type MilestoneCluster,
  type Programme,
  type Segment,
  type SegmentTone,
  type Tick,
} from './buildProgramme.ts'
import { useTrack } from './useTrack.ts'

// The Programme Line (design package §6; task 6.2). The layout mode picks the form in CSS, so every form is
// in the DOM and the others are display:none: swimlanes on desktop and tablet (scrolling on tablet when the
// track would be under 600px), labelled 28px lanes on compact landscape where the whole figure links to
// Experience, and span rows on mobile. Each form measures its own track and builds its own geometry.

interface ProgrammeData {
  organisations: readonly Organisation[]
  roles: readonly Role[]
  milestones: readonly Milestone[]
  now: number
}

export type ProgrammeLineProps = Partial<ProgrammeData> & { className?: string }

const pct = (x: number, width: number) => `${(x / width) * 100}%`
const experienceLink = (role: Role) => `/experience#${role.id}`
const engagement = (role: Role) => [role.label, role.title, role.note].filter(Boolean).join(' · ')
const statusText = (segment: Segment) => (segment.status === 'in-flight' ? 'In flight' : 'Delivered')

// Stands in for the web font's metrics until the track is measured (buildProgramme's default).
const approximateMeasure = (label: string) => label.length * 6.6

function useProgramme(data: ProgrammeData, fallbackWidth: number) {
  const [ref, { width, measure = approximateMeasure }] = useTrack(fallbackWidth)
  return [ref, buildProgramme({ ...data, width, measure }), measure] as const
}

type Measure = (label: string) => number

export function ProgrammeLine({
  organisations = allOrganisations,
  roles = allRoles,
  milestones = allMilestones,
  now = fractionalYear(new Date()),
  className,
}: ProgrammeLineProps) {
  const headingId = useId()
  const [asTable, setAsTable] = useState(false)
  const data = { organisations, roles, milestones, now }
  const summary = describeProgramme(organisations, roles, milestones)

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        'flex flex-col gap-4 border-t-2 border-border-strong pt-4 compact-landscape:grid compact-landscape:grid-cols-4 compact-landscape:gap-6',
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 compact-landscape:flex-col compact-landscape:flex-nowrap compact-landscape:items-start">
        <h2 id={headingId} className="font-sans text-h3 font-semibold">
          Programme line
        </h2>
        <p className="hidden font-mono text-mono-s text-muted uppercase desktop:block">
          2000 → now · {organisations.length} organisations · {roles.length} engagements
        </p>
        <p className="hidden text-label text-ink-2 compact-landscape:block">
          {organisations.length} organisations, {roles.length} engagements, 2000 → now.
        </p>
        <Legend className="order-last basis-full compact-landscape:order-none desktop:order-none desktop:ml-auto desktop:basis-auto" />
        <button
          type="button"
          onClick={() => setAsTable((on) => !on)}
          className="hit-target relative ml-auto cursor-pointer text-label font-semibold text-accent underline-offset-4 hover:underline compact-landscape:ml-0 desktop:ml-0"
        >
          {asTable ? 'View as chart' : 'View as table'}
        </button>
      </div>

      <div className="flex min-w-0 flex-col gap-3 compact-landscape:col-span-3">
        {asTable ? (
          <ProgrammeTable roles={roles} />
        ) : (
          <>
            <Lanes data={data} summary={summary} />
            <CompactLanes data={data} summary={summary} />
            <SpanRows data={data} summary={summary} />
          </>
        )}
        <MilestoneList milestones={milestones} />
      </div>
    </section>
  )
}

// Swatches match the form on screen: soft segment fills in the lanes, solid spans in mobile rows.
function Legend({ className }: { className?: string }) {
  const swatch = 'h-2 w-3.5 rounded-full border mobile:h-1.5'
  return (
    <ul className={cn('flex flex-wrap gap-x-3 gap-y-1 font-mono text-mono-s text-muted compact-landscape:flex-col', className)}>
      <li className="flex items-center gap-1.5">
        <span aria-hidden="true" className={cn(swatch, 'border-accent-soft-border bg-accent-soft mobile:border-accent-fill mobile:bg-accent-fill')} />
        Delivered
      </li>
      <li className="flex items-center gap-1.5">
        <span aria-hidden="true" className={cn(swatch, 'border-flight-border bg-flight-bg mobile:border-flight-dot mobile:bg-flight-dot')} />
        In flight
      </li>
      <li className="flex items-center gap-1.5">
        <span aria-hidden="true">◆</span>
        Milestone
      </li>
    </ul>
  )
}

/* ── Axis and milestones, shared by every chart form ── */

function Axis({ ticks, width, showNow = false }: { ticks: Tick[]; width: number; showNow?: boolean }) {
  // "now" needs its own room at the right edge; on 5-year axes 2025 sits too close to it.
  const now = showNow && width - ticks.at(-1)!.x > 64
  return (
    <div aria-hidden="true" className="relative h-4 font-mono text-mono-s text-muted tabular-nums">
      {ticks.map((tick) => (
        <span key={tick.year} className={cn('absolute top-0', tick.x > 0 && '-translate-x-1/2')} style={{ left: pct(tick.x, width) }}>
          {tick.year}
        </span>
      ))}
      {now && <span className="absolute top-0 right-0">now</span>}
    </div>
  )
}

function ClusterMarker({ cluster, width }: { cluster: MilestoneCluster; width: number }) {
  const count = cluster.milestones.length
  const certification = cluster.milestones.every((m) => m.kind === 'certification')
  return (
    <span
      data-cluster={count}
      className={cn(
        'absolute top-1/2 -translate-1/2 font-mono text-mono-s leading-none',
        count > 1 ? 'rounded-full bg-ink px-1.5 py-0.5 text-bg' : certification ? 'text-accent' : 'text-ink',
      )}
      style={{ left: pct(cluster.x, width) }}
    >
      ◆{count > 1 && count}
    </span>
  )
}

function MilestoneList({ milestones }: { milestones: readonly Milestone[] }) {
  return (
    <ul aria-label="Milestones" className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-mono-s text-muted compact-landscape:hidden">
      {milestones.map((m) => (
        <li key={m.id}>
          <span aria-hidden="true">◆ </span>
          {m.title} {periodLabel(m.date)}
        </li>
      ))}
    </ul>
  )
}

/* ── Swimlanes (desktop, tablet) and labelled lanes (compact landscape) ── */

const segmentTone: Record<SegmentTone, string> = {
  current: 'border-flight-border bg-flight-bg font-semibold text-flight-fg',
  delivered: 'border-accent-soft-border bg-accent-soft text-ink',
  past: 'border-border bg-past-track text-ink',
}

/** Free track on each side of a segment, up to its neighbours in the lane. */
interface Room {
  left: number
  right: number
}

const LABEL_GAP_PX = 4

/**
 * A label that doesn't fit inside its segment sits beside it, on a side with room before the next segment
 * (§6.3). With no room on either side it's left off the chart: the lane header, tooltip, aria-label and
 * table all still name the engagement.
 */
function outsideLabel(segment: Segment, room: Room, width: number, measure: Measure) {
  const needed = measure(segment.label) + 2 * LABEL_GAP_PX
  if (room.right >= needed) return { left: `calc(${pct(segment.x + segment.width, width)} + ${LABEL_GAP_PX}px)` }
  if (room.left >= needed) return { right: `calc(${pct(width - segment.x, width)} + ${LABEL_GAP_PX}px)` }
  return undefined
}

function Lanes({ data, summary }: { data: ProgrammeData; summary: string }) {
  const [ref, programme, measure] = useProgramme(data, 900)
  return (
    <figure aria-label={summary} data-form="lanes" className="hidden rounded-lg border border-border bg-surface tablet:block desktop:block">
      <ScrollArea>
        <div className="flex flex-col gap-2.5 px-5 pt-4 pb-3 text-label font-medium">
          <LaneRows programme={programme} measure={measure} compact={false} />
          <div className="flex">
            <span className="w-36 shrink-0" />
            {/* Under 600px of track, the lanes scroll rather than squeeze (§6.2, tablet). */}
            <div ref={ref} className="min-w-0 flex-1 border-t border-border pt-1.5 tablet:min-w-150">
              <Axis ticks={programme.ticks} width={programme.width} />
            </div>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </figure>
  )
}

function CompactLanes({ data, summary }: { data: ProgrammeData; summary: string }) {
  const [ref, programme, measure] = useProgramme(data, 620)
  // A summary figure: one link to Experience, no per-segment targets (§6.2).
  return (
    <Link
      to="/experience"
      aria-label={`${summary} Open Experience.`}
      data-form="compact"
      className="hidden rounded-lg border border-border bg-surface px-4 pt-3 pb-2 text-ink hover:border-border-strong compact-landscape:block"
    >
      <figure className="flex flex-col gap-2 text-label font-medium">
        <LaneRows programme={programme} measure={measure} compact />
        <div className="flex">
          <span className="w-20 shrink-0" />
          <div ref={ref} className="min-w-0 flex-1 border-t border-border pt-1">
            <Axis ticks={programme.ticks} width={programme.width} />
          </div>
        </div>
        <figcaption className="text-label font-semibold text-accent">Open Experience →</figcaption>
      </figure>
    </Link>
  )
}

function LaneRows({ programme, measure, compact }: { programme: Programme; measure: Measure; compact: boolean }) {
  const { width, lanes, clusters } = programme
  const header = cn('shrink-0 font-normal text-muted', compact ? 'w-20' : 'w-36')
  return (
    <>
      {lanes.map((lane) => (
        <div key={lane.org.id} className="flex items-center">
          <span className={header}>{lane.org.short}</span>
          <div className={cn('relative min-w-0 flex-1', compact ? 'h-7' : 'h-7.5 tablet:min-w-150')}>
            {lane.segments.map((segment, i) => {
              const [prev, next] = [lane.segments[i - 1], lane.segments[i + 1]]
              const room = {
                left: segment.x - (prev ? prev.x + prev.width : 0),
                right: (next ? next.x : width) - (segment.x + segment.width),
              }
              return <LaneSegment key={segment.role.id} segment={segment} room={room} width={width} measure={measure} compact={compact} />
            })}
          </div>
        </div>
      ))}
      <div className="flex items-center">
        <span className={header}>Milestones</span>
        <div aria-hidden="true" className={cn('relative h-5 min-w-0 flex-1', !compact && 'tablet:min-w-150')}>
          {clusters.map((cluster) => (
            <ClusterMarker key={cluster.milestones[0]!.id} cluster={cluster} width={width} />
          ))}
        </div>
      </div>
    </>
  )
}

interface LaneSegmentProps {
  segment: Segment
  room: Room
  width: number
  measure: Measure
  compact: boolean
}

function LaneSegment({ segment, room, width, measure, compact }: LaneSegmentProps) {
  const { role } = segment
  const box = cn('absolute top-0 flex items-center gap-1.5 rounded-sm border px-2 whitespace-nowrap', compact ? 'h-7' : 'h-7.5', segmentTone[segment.tone])
  const style = { left: pct(segment.x, width), width: pct(segment.width, width) }
  const outside = segment.labelInside ? undefined : outsideLabel(segment, room, width, measure)
  const content = segment.labelInside && (
    <>
      {segment.tone === 'current' && <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-flight-dot" />}
      {segment.label}
    </>
  )
  const outsideText = outside && (
    <span aria-hidden="true" data-label="outside" className="absolute top-0 flex h-full items-center whitespace-nowrap text-ink-2" style={outside}>
      {segment.label}
    </span>
  )

  if (compact) {
    return (
      <>
        <span className={box} style={style} data-role={role.id}>
          {content}
        </span>
        {outsideText}
      </>
    )
  }

  const name = `${engagement(role)}, ${roleDates(role)}, ${statusText(segment)}`
  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={<Link to={experienceLink(role)} aria-label={name} data-role={role.id} className={cn(box, 'hit-target hover:border-border-strong')} style={style} />}
        >
          {content}
        </TooltipTrigger>
        {/* Desktop only, and never the only source: the same facts are in the table and the aria-label (§6.6). */}
        <TooltipContent className="tablet:hidden">
          {role.title} · {roleDates(role)}
        </TooltipContent>
      </Tooltip>
      {outsideText}
    </>
  )
}

/* ── Span rows (mobile) ── */

const spanTone: Record<SegmentTone, string> = {
  current: 'bg-flight-dot',
  delivered: 'bg-accent-fill',
  past: 'bg-past',
}

function SpanRows({ data, summary }: { data: ProgrammeData; summary: string }) {
  const [ref, programme] = useProgramme(data, 343)
  const { width, segments, clusters, ticks } = programme
  // Full month ranges fit from a 343px track (375px viewports); the 288px track uses years.
  const dates = width >= 320 ? roleDates : roleYears
  const row = 'flex min-h-14 flex-col justify-center gap-1.5 border-t border-border py-2 text-ink'
  const meta = 'flex items-center justify-between gap-2 font-mono text-mono-s text-muted tabular-nums'

  return (
    <figure aria-label={summary} data-form="rows" className="hidden mobile:block">
      <div ref={ref}>
        <Axis ticks={ticks} width={width} showNow />
      </div>
      <ul className="mt-1">
        {segments.map((segment) => (
          <li key={segment.role.id}>
            <Link to={experienceLink(segment.role)} className={row} data-role={segment.role.id}>
              <span className={meta}>
                <span>{dates(segment.role)}</span>
                {segment.status === 'in-flight' ? <StatusChip status="in-flight" /> : <span>Delivered</span>}
              </span>
              <span className="text-body leading-snug font-semibold">{engagement(segment.role)}</span>
              <span aria-hidden="true" className="relative h-1.5 rounded-full bg-past-track">
                <span
                  className={cn('absolute top-0 h-1.5 rounded-full', spanTone[segment.tone])}
                  style={{ left: pct(segment.x, width), width: pct(segment.width, width) }}
                />
              </span>
            </Link>
          </li>
        ))}
        <li>
          <Link to="/experience#milestones" className={row} data-role="milestones">
            <span className={meta}>
              <span>Milestones</span>
              <span>{data.milestones.length}</span>
            </span>
            <span aria-hidden="true" className="relative h-4 border-t border-dashed border-border-control">
              {clusters.map((cluster) => (
                <ClusterMarker key={cluster.milestones[0]!.id} cluster={cluster} width={width} />
              ))}
            </span>
          </Link>
        </li>
      </ul>
    </figure>
  )
}

/* ── Table alternative (every form, §6.6) ── */

function ProgrammeTable({ roles }: { roles: readonly Role[] }) {
  const cell = 'border-t border-border py-2 pr-3 align-top'
  return (
    <table className="w-full text-left text-label">
      <caption className="sr-only">Career timeline: period, engagement and status</caption>
      <thead className="font-mono text-mono-s text-muted uppercase">
        <tr>
          <th scope="col" className="pb-2 font-normal">
            Period
          </th>
          <th scope="col" className="pb-2 font-normal">
            Engagement
          </th>
          <th scope="col" className="pb-2 font-normal">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {roles.map((role) => (
          <tr key={role.id}>
            <td className={cn(cell, 'font-mono tabular-nums text-muted')}>{roleDates(role)}</td>
            <th scope="row" className={cn(cell, 'font-medium')}>
              <Link to={experienceLink(role)} className="text-ink underline-offset-4 hover:text-accent hover:underline">
                {engagement(role)}
              </Link>
            </th>
            <td className={cn(cell, 'pr-0')}>{role.end ? 'Delivered' : <StatusChip status="in-flight" />}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
