import { periodStart } from '@content/derive.ts'
import type { Skill } from '@content/schema.ts'

// Skills over time (design/exploration/05-component-architecture.md "CapabilityMap": grid bars from skill dates).
// Like the Programme Line, positions come only from the records: each bar runs from `since` to `until`, or to
// now for a skill still in use, on one axis shared by every group.

export interface CapabilityBar {
  skill: Skill
  /** Left edge and width as fractions of the track (0–1). */
  start: number
  width: number
  current: boolean
}

export interface CapabilityGroup {
  name: string
  bars: CapabilityBar[]
}

export interface CapabilityMapModel {
  axisStart: number
  axisEnd: number
  ticks: number[]
  groups: CapabilityGroup[]
}

/** Groups in the order the records introduce them; within a group, longest-standing first. */
export function buildCapabilityMap(skills: readonly Skill[], now: number): CapabilityMapModel {
  const axisStart = Math.floor(Math.min(...skills.map((skill) => periodStart(skill.since))) / 5) * 5
  const axisEnd = Math.floor(now) + 1
  const at = (year: number) => (year - axisStart) / (axisEnd - axisStart)

  const groups = new Map<string, CapabilityBar[]>()
  for (const skill of skills) {
    const start = periodStart(skill.since)
    const end = skill.until ? periodStart(skill.until) : now
    const bars = groups.get(skill.group) ?? []
    bars.push({ skill, start: at(start), width: Math.max(at(end) - at(start), 0.005), current: !skill.until })
    groups.set(skill.group, bars)
  }

  const ticks: number[] = []
  for (let year = axisStart; year < axisEnd; year += 5) ticks.push(year)

  return {
    axisStart,
    axisEnd,
    ticks,
    groups: [...groups].map(([name, bars]) => ({ name, bars: bars.sort((a, b) => a.start - b.start || a.skill.name.localeCompare(b.skill.name)) })),
  }
}

/** "2019 – now", "2010 – 2020". */
export const skillYears = (skill: Pick<Skill, 'since' | 'until'>) => `${skill.since.slice(0, 4)} – ${skill.until ? skill.until.slice(0, 4) : 'now'}`
