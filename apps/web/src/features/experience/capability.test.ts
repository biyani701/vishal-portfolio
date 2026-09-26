import { describe, expect, it } from 'vitest'
import type { Skill } from '@content/schema.ts'
import { buildCapabilityMap, skillYears } from './capability.ts'

const skill = (name: string, group: string, since: string, until?: string): Skill => ({ name, group, since, until, use: 'professional' })

describe('buildCapabilityMap', () => {
  const now = 2026.5
  const map = buildCapabilityMap(
    [skill('Python', 'Programming', '2019-01'), skill('C', 'Programming', '2010-01', '2020-01'), skill('Git', 'SCM', '2015-07')],
    now,
  )

  it('runs one axis from the earliest skill (to a 5-year mark) to the start of next year', () => {
    expect(map).toMatchObject({ axisStart: 2010, axisEnd: 2027, ticks: [2010, 2015, 2020, 2025] })
  })

  it('keeps groups in record order, earliest skill first, positioned only from their dates', () => {
    expect(map.groups.map((g) => [g.name, g.bars.map((b) => b.skill.name)])).toEqual([
      ['Programming', ['C', 'Python']],
      ['SCM', ['Git']],
    ])
    const [c, python] = map.groups[0]!.bars
    expect(c).toMatchObject({ start: 0, current: false })
    expect(c!.width).toBeCloseTo(10 / 17)
    expect(python!.start).toBeCloseTo(9 / 17)
    expect(python!.start + python!.width).toBeCloseTo((now - 2010) / 17)
    expect(python!.current).toBe(true)
  })
})

describe('skillYears', () => {
  it('prints the years in use', () => {
    expect(skillYears({ since: '2019-01' })).toBe('2019 – now')
    expect(skillYears({ since: '2010-01', until: '2020-01' })).toBe('2010 – 2020')
  })
})
