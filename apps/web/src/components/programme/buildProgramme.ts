import { periodLabel, periodStart, roleStatus, type Milestone, type RoleStatus } from '@content/derive.ts'
import type { Organisation, Role } from '@content/schema.ts'

// The Programme Line's geometry (design.md A4; design package §6), as a pure function of the records and the
// track width, so every form (lanes, compact strip, span rows, table) draws from the same numbers.
// Nothing is estimated: positions come only from role and milestone dates.

export const AXIS_START = 2000
/** Minimum distance between milestone marker centres before they merge into a cluster (§6.4). */
export const CLUSTER_PX = 12
/** Padding on each side of a label drawn inside its segment (§6.3). */
export const LABEL_PADDING_PX = 8

export type SegmentTone = 'current' | 'delivered' | 'past'

export interface Segment {
  role: Role
  org: string
  x: number
  width: number
  label: string
  /** The label fits inside the segment with 8px padding each side; otherwise it's drawn outside. */
  labelInside: boolean
  status: RoleStatus
  tone: SegmentTone
}

export interface Lane {
  org: Organisation
  segments: Segment[]
}

export interface MilestoneCluster {
  /** Centre of the marker (the mean of its members). */
  x: number
  milestones: Milestone[]
}

export interface Tick {
  year: number
  x: number
}

export interface Programme {
  width: number
  axisEnd: number
  lanes: Lane[]
  /** Every segment, newest role first (the order of the records). */
  segments: Segment[]
  clusters: MilestoneCluster[]
  ticks: Tick[]
  /** Where "now" falls on the track. */
  nowX: number
}

export interface ProgrammeInput {
  organisations: readonly Organisation[]
  roles: readonly Role[]
  milestones: readonly Milestone[]
  /** Track width in CSS px. */
  width: number
  /** Today, as a fractional year (2026.73). */
  now: number
  /** Rendered width of a segment label in px; the default approximates 12px Bricolage Grotesque. */
  measure?: (label: string) => number
}

const approximateWidth = (label: string) => label.length * 6.6

/** Today as a fractional year. */
export const fractionalYear = (date: Date) => date.getFullYear() + date.getMonth() / 12 + (date.getDate() - 1) / 365

export function buildProgramme({ organisations, roles, milestones, width, now, measure = approximateWidth }: ProgrammeInput): Programme {
  // The axis runs from 2000 to the start of next year (2027 while it's 2026), so "now" never sits on the edge.
  const axisEnd = Math.floor(now) + 1
  const span = axisEnd - AXIS_START
  const at = (year: number) => ((year - AXIS_START) / span) * width

  const segments: Segment[] = roles.map((role) => {
    const start = at(periodStart(role.start))
    const end = at(role.end ? periodStart(role.end) : now)
    const segmentWidth = Math.max(end - start, 2)
    const status = roleStatus(role)
    return {
      role,
      org: role.org,
      x: start,
      width: segmentWidth,
      label: role.label,
      labelInside: measure(role.label) + 2 * LABEL_PADDING_PX <= segmentWidth,
      status,
      tone: status === 'in-flight' ? 'current' : role.early ? 'past' : 'delivered',
    }
  })

  const lanes = organisations.map((org) => ({
    org,
    segments: segments.filter((segment) => segment.org === org.id).sort((a, b) => a.x - b.x),
  }))

  const clusters: MilestoneCluster[] = []
  const markers = [...milestones].map((milestone) => ({ milestone, x: at(periodStart(milestone.date)) })).sort((a, b) => a.x - b.x)
  for (const { milestone, x } of markers) {
    const last = clusters.at(-1)
    const lastX = last ? at(periodStart(last.milestones.at(-1)!.date)) : -Infinity
    if (last && x - lastX < CLUSTER_PX) {
      last.milestones.push(milestone)
      last.x = last.milestones.reduce((sum, m) => sum + at(periodStart(m.date)), 0) / last.milestones.length
    } else {
      clusters.push({ x, milestones: [milestone] })
    }
  }

  // Every 5 years when there's room (§6.2), every 10 on narrow tracks.
  const step = width >= 400 ? 5 : 10
  const ticks: Tick[] = []
  for (let year = AXIS_START; year < axisEnd; year += step) ticks.push({ year, x: at(year) })

  return { width, axisEnd, lanes, segments, clusters, ticks, nowX: at(now) }
}

/** The `aria-label` summary shared by every form (§6.6). */
export function describeProgramme(organisations: readonly Organisation[], roles: readonly Role[], milestones: readonly Milestone[]) {
  const parts = organisations.map((org) => {
    const own = roles.filter((role) => role.org === org.id).sort((a, b) => a.start.localeCompare(b.start))
    const first = own[0]!.start.slice(0, 4)
    const current = own.find((role) => !role.end)
    const last = current ? 'now' : own.map((role) => role.end!).sort().at(-1)!.slice(0, 4)
    const clients = own.filter((role) => role.client).map((role) => role.label)
    return `${org.short} ${first}–${last}${clients.length ? ` for ${list(clients)}` : ''}`
  })
  const marks = milestones.map((m) => `${m.title} ${periodLabel(m.date)}`)
  return `Career timeline, 2000 to now: ${parts.join('; ')}. Milestones: ${marks.join(', ')}.`
}

const list = (items: string[]) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`)
