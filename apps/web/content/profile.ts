import { careerYears } from './derive.ts'
import { roles } from './roles.ts'
import type { Profile } from './schema.ts'

// Identity, positioning and proof (specs/portfolio-narrative "Positioning" and "Proof ledger"; copy approved by the
// owner in openspec/changes/reposition-leadership-narrative/design.md). Years are derived from the first role, so
// they never go stale. Contact details are deliberately absent: visitors use the Contact form.
const years = careerYears(roles)

export const profile = {
  name: 'Vishal Biyani',
  positioning: 'Technology delivery & programme leadership',
  location: 'Mumbai',
  statement: ['I lead delivery', 'I understand payments', 'I build tools'],
  lede: `${years} years in financial-services technology, from engineering at JPMorgan Chase to running the IFC's application portfolio, eight UK banking accounts and now a major US consumer card programme at CoreCard. I lead programmes across customers, product, engineering and QA, and build the tooling that keeps delivery predictable.`,
  ledeShort: `${years} years in financial-services technology: JPMorgan Chase, the IFC, eight UK banks and CoreCard.`,
  currentRole: 'Programme delivery lead · CoreCard',
  summary: `${years} years in financial-services technology, from engineer to programme leader: delivery across customers, product, engineering and QA, with enough technical depth to improve the delivery system itself.`,
  proof: [
    { value: String(years), label: 'years in financial-services technology', short: 'yrs' },
    { value: '104', label: 'people across 7 teams, CoreCard card programme', short: 'people' },
    { value: '50+', label: 'applications run for the IFC', short: 'apps' },
    { value: '4×', label: 'system-wide throughput, JPMorgan Chase reference-data platform', short: 'throughput' },
  ],
  links: {
    linkedin: 'https://www.linkedin.com/in/vishalbiyani2/',
    github: 'https://github.com/biyani701',
  },
  portrait: { src: '/images/portrait.jpg', alt: 'Vishal Biyani in a light blue checked shirt' },
} as const satisfies Profile
