import type { Profile } from './schema.ts'

// Identity, positioning and proof. Sources: apps/portfolio ProfileSummaryNew, Experience and Hero; statement,
// lede and proof labels from the Programme canvas (design/exploration/11-final-design-package.md).
// Contact details are deliberately absent: visitors use the Contact form.
export const profile = {
  name: 'Vishal Biyani',
  positioning: 'Technical Program Manager · Delivery Director',
  location: 'Mumbai',
  statement: ['I lead delivery', 'I build tools', 'I explain payments'],
  lede: "Twenty-five years delivering software for JP Morgan Chase, the World Bank Group's IFC, eight UK banks and CoreCard — and writing the Python that makes delivery measurable.",
  ledeShort: '25 years delivering software for JP Morgan Chase, the IFC, eight UK banks and CoreCard.',
  currentRole: 'Principal Project Analyst · CoreCard',
  summary:
    'A results-driven Technical Program Manager and Delivery Director with over 25 years of experience steering complex, high-impact software initiatives, aligning strategy with execution across financial services.',
  proof: [
    { value: '25+', label: 'years in financial-services software', short: 'yrs' },
    { value: '8', label: 'UK banking clients led at once', short: 'banks' },
    { value: '150+', label: 'people coached through Agile PMO', short: 'coached' },
    { value: '50+', label: 'applications run for the IFC', short: 'apps' },
  ],
  links: {
    linkedin: 'https://www.linkedin.com/in/vishalbiyani2/',
    github: 'https://github.com/biyani701',
  },
  portrait: { src: '/images/portrait.jpg', alt: 'Vishal Biyani in a light blue checked shirt' },
} as const satisfies Profile
