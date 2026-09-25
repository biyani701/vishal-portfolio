import type { Organisation, Role } from './schema.ts'

// Employers and engagements (apps/portfolio Experience, CareerTimeline, ProfileSummaryNew). The Programme
// Line is drawn from these dates only; a role without `end` is current. Newest first. Skills are only those
// the outcomes state; `projects` links a role to the projects built in it (none are attributed yet).
export const organisations = [
  { id: 'tata-infotech', name: 'Tata Infotech Ltd', short: 'Tata Infotech' },
  { id: 'cognizant', name: 'Cognizant Technology Solutions', short: 'Cognizant' },
  { id: 'corecard', name: 'CoreCard Software India', short: 'CoreCard' },
] as const satisfies readonly Organisation[]

export const roles = [
  {
    id: 'corecard',
    org: 'corecard',
    label: 'CoreCard',
    title: 'Principal Project Analyst',
    start: '2019-11',
    location: 'Mumbai',
    outcomes: [
      'Led the Agile PMO and coached 150+ team members on Agile principles, aligning product delivery with client goals.',
      'Owned delivery and client relationships for key accounts, including the Cookie and Jazz projects.',
      'Improved release management and operational efficiency, establishing release best practices.',
    ],
    skills: ['Agile PMO', 'Coaching', 'Release management', 'Client management'],
    projects: [],
  },
  {
    id: 'bfs-uk',
    org: 'cognizant',
    client: 'BFS UK Accounts',
    label: 'BFS UK',
    title: 'Delivery Lead',
    note: '8 banks',
    start: '2014-12',
    end: '2019-09',
    outcomes: [
      'Directed scope, timelines and deliverables for eight UK banking clients across Time & Material and Fixed Price engagements.',
      'Managed P&L for key portfolios, meeting top-line growth and bottom-line targets.',
      'Resolved cross-team dependencies and removed blockers to keep projects moving.',
      'Drove process improvements that raised resource utilisation and streamlined delivery.',
      'Championed Agile adoption across diverse teams.',
      'Partnered on RFP and RFI responses that contributed to new business wins.',
    ],
    skills: ['Delivery management', 'P&L', 'Fixed Price delivery', 'Agile', 'RFP responses'],
    projects: [],
  },
  {
    id: 'ifc',
    org: 'cognizant',
    client: 'International Finance Corporation, World Bank Group',
    label: 'IFC',
    title: 'Senior Manager',
    start: '2012-11',
    end: '2014-12',
    outcomes: [
      'Managed a suite of 50+ applications with a team of 24 onsite and 26 offshore.',
      'Moved unstructured processes to structured ones, improving operational efficiency.',
      'Built Tableau reporting dashboards over BMC Remedy data.',
      'Ran development and releases for 50+ applications.',
      'Directed production support: incident management, prioritisation and root-cause analysis.',
    ],
    skills: ['Application portfolio management', 'Production support', 'Tableau', 'BMC Remedy'],
    projects: [],
  },
  {
    id: 'jpmc',
    org: 'cognizant',
    client: 'JP Morgan Chase',
    label: 'JP Morgan Chase',
    title: 'Technical Project Manager',
    start: '2003-10',
    end: '2012-11',
    outcomes: [
      'Re-architected applications to scale horizontally, quadrupling throughput and improving stability.',
      'Proposed and led 10+ automation initiatives that cut cost and raised productivity.',
      'Managed project and technical delivery for developer teams onsite and offshore.',
    ],
    skills: ['Architecture', 'Automation', 'Delivery management'],
    projects: [],
  },
  {
    id: 'tata-infotech',
    org: 'tata-infotech',
    label: 'Tata Infotech',
    early: true,
    title: 'Senior Software Engineer',
    start: '2000-05',
    end: '2003-10',
    location: 'Mumbai and Singapore',
    outcomes: [],
    skills: [],
    projects: [],
  },
] as const satisfies readonly Role[]
