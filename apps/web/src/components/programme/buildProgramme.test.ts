import { describe, expect, it } from 'vitest'
import { credentials } from '@content/credentials.ts'
import { milestonesOf } from '@content/derive.ts'
import { organisations, roles } from '@content/roles.ts'
import { buildProgramme, describeProgramme, fractionalYear } from './buildProgramme.ts'

// Task 6.1: the geometry at the track widths validated in the design package (§6).
const milestones = milestonesOf(credentials)
const now = fractionalYear(new Date(2026, 8, 25))
const at = (width: number) => buildProgramme({ organisations, roles, milestones, width, now })
const clusterSizes = (width: number) => at(width).clusters.map((c) => c.milestones.length)

describe('buildProgramme', () => {
  it('draws only from the records, on an axis from 2000 to next year', () => {
    const programme = at(1100)
    expect(programme.axisEnd).toBe(2027)
    const bfs = programme.segments.find((s) => s.role.id === 'bfs-uk')!
    // Dec 2014 – Sep 2019 on a 27-year axis.
    expect(bfs.x).toBeCloseTo(((2014 + 11 / 12 - 2000) / 27) * 1100, 5)
    expect(bfs.width).toBeCloseTo(((4 + 9 / 12) / 27) * 1100, 5)
    const corecard = programme.segments.find((s) => s.role.id === 'corecard')!
    expect(corecard.x + corecard.width).toBeCloseTo(programme.nowX, 5)
  })

  it('groups segments into one lane per organisation, oldest organisation first', () => {
    expect(at(1100).lanes.map((lane) => [lane.org.id, lane.segments.map((s) => s.role.id)])).toEqual([
      ['tata-infotech', ['tata-infotech']],
      ['cognizant', ['jpmc', 'ifc', 'bfs-uk']],
      ['corecard', ['corecard']],
    ])
  })

  it('uses in-flight for the current role, past for pre-Cognizant work and delivered otherwise', () => {
    const tones = Object.fromEntries(at(1100).segments.map((s) => [s.role.id, s.tone]))
    expect(tones).toEqual({ corecard: 'current', 'bfs-uk': 'delivered', ifc: 'delivered', jpmc: 'delivered', 'tata-infotech': 'past' })
  })

  it.each([
    [288, [1, 1, 2]],
    [343, [1, 1, 2]],
    [358, [1, 1, 2]],
    [500, [1, 1, 1, 1]],
    [1100, [1, 1, 1, 1]],
  ])('at %ipx, milestones cluster as %j (AWS 2020 and Manager of the Quarter 2021 merge below 12px)', (width, sizes) => {
    expect(clusterSizes(width)).toEqual(sizes)
  })

  it('places a cluster at the mean of its members and keeps every milestone', () => {
    const programme = at(288)
    const pair = programme.clusters.at(-1)!
    expect(pair.milestones.map((m) => m.id)).toEqual(['aws-saa', 'manager-of-the-quarter'])
    expect(programme.clusters.flatMap((c) => c.milestones)).toHaveLength(4)
  })

  it.each([
    [288, ['2000', '2010', '2020']],
    [500, ['2000', '2005', '2010', '2015', '2020', '2025']],
  ])('ticks the axis at %ipx: %j', (width, years) => {
    expect(at(width).ticks.map((t) => String(t.year))).toEqual(years)
  })

  it('puts a label inside only when it fits with 8px padding (IFC fits at the 844px landscape track)', () => {
    const measure = (label: string) => label.length * 6.6
    const ifc = (width: number) => buildProgramme({ organisations, roles, milestones, width, now, measure }).segments.find((s) => s.role.id === 'ifc')!
    expect(ifc(467).width).toBeGreaterThanOrEqual(36)
    expect(ifc(467).labelInside).toBe(true)
    expect(ifc(343).labelInside).toBe(false) // ~26px: "IFC" moves outside
    const jpmc = buildProgramme({ organisations, roles, milestones, width: 1100, now, measure }).segments.find((s) => s.role.id === 'jpmc')!
    expect(jpmc.labelInside).toBe(true)
  })
})

describe('describeProgramme', () => {
  it('summarises every organisation, client and milestone', () => {
    expect(describeProgramme(organisations, roles, milestones)).toBe(
      'Career timeline, 2000 to now: Tata Infotech 2000–2003; Cognizant 2003–2019 for JP Morgan Chase, IFC and BFS UK; CoreCard 2019–now. ' +
        'Milestones: Guiding Star Q4 2009, Project of the Year 2013, AWS Solutions Architect Sep 2020, Manager of the Quarter Q3 2021.',
    )
  })
})
