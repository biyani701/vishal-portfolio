import type { Credentials, Role } from './schema.ts'

// Values derived from the records, shared by the site and the build-time indexes.

export interface Milestone {
  id: string
  title: string
  /** YYYY, YYYY-Qn or YYYY-MM. */
  date: string
  kind: 'certification' | 'recognition'
}

/** Certifications and recognition, oldest first: the Programme Line's milestone row. */
export function milestonesOf(credentials: Credentials): Milestone[] {
  return [
    ...credentials.certifications.map(({ id, short, date }) => ({ id, title: short, date, kind: 'certification' as const })),
    ...credentials.recognition.map(({ id, title, date }) => ({ id, title, date, kind: 'recognition' as const })),
  ].sort((a, b) => periodStart(a.date) - periodStart(b.date))
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** The start of a YYYY, YYYY-Qn or YYYY-MM period as a fractional year (2009-Q4 → 2009.75). */
export function periodStart(period: string): number {
  const [year, part] = period.split('-')
  if (!part) return Number(year)
  if (part.startsWith('Q')) return Number(year) + (Number(part.slice(1)) - 1) / 4
  return Number(year) + (Number(part) - 1) / 12
}

/** "Sep 2020", "Q4 2009" or "2013". */
export function periodLabel(period: string): string {
  const [year, part] = period.split('-')
  if (!part) return year!
  if (part.startsWith('Q')) return `${part} ${year}`
  return `${MONTHS[Number(part) - 1]} ${year}`
}

/** "Nov 2019 – now", "Dec 2014 – Sep 2019". */
export const roleDates = (role: Pick<Role, 'start' | 'end'>) =>
  `${periodLabel(role.start)} – ${role.end ? periodLabel(role.end) : 'now'}`

/** "2019 – now", "2014 – 19": the compact form for narrow rows. */
export function roleYears(role: Pick<Role, 'start' | 'end'>) {
  const start = role.start.slice(0, 4)
  if (!role.end) return `${start} – now`
  const end = role.end.slice(0, 4)
  return `${start} – ${end.slice(0, 2) === start.slice(0, 2) ? end.slice(2) : end}`
}

/** Status language (design package §5): a role without an end date is in flight. */
export type RoleStatus = 'in-flight' | 'delivered'
export const roleStatus = (role: Pick<Role, 'end'>): RoleStatus => (role.end ? 'delivered' : 'in-flight')
