import type { Organisation, Role } from './schema.ts'

// Employers and engagements (apps/portfolio Experience, CareerTimeline, ProfileSummaryNew). The Programme
// Line is drawn from these dates only; a role without `end` is current. Newest first. Skills are only those
// the outcomes state; `projects` links a role to its programme case study.
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
      'Set up delivery structure and cadence for a major US consumer card programme: 7 teams, 104 people.',
      'Introduced Agile delivery across the programme and brought 150+ people through sprint planning, estimation and release cadence, until the team leads could run the model themselves.',
      'Led customer delivery discussions and release governance.',
      'Improved release management and operational efficiency, establishing release best practices.',
    ],
    skills: ['Agile PMO', 'Coaching', 'Release management', 'Client management'],
    projects: ['corecard-predictable-delivery'],
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
      'Directed scope, timelines and deliverables for eight UK banking clients across Time & Material and Fixed Price engagements, including a multi-year programme inherited in a troubled state and delivered.',
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
      'Replaced ad-hoc deployments with implementation windows, about weekly and later fortnightly, and set up a weekly management review with 6–7 client managers.',
      'No contractual SLA breaches or penalties across the engagement.',
    ],
    skills: ['Application portfolio management', 'Production support', 'Tableau', 'BMC Remedy'],
    projects: ['ifc-portfolio-stabilisation'],
  },
  {
    id: 'jpmc',
    org: 'cognizant',
    client: 'JPMorgan Chase',
    label: 'JPMorgan Chase',
    title: 'Technical Project Manager',
    start: '2003-10',
    end: '2012-11',
    outcomes: [
      'Re-engineered reference-data processing; database analysis measured approximately 4× throughput across the whole system.',
      'Proposed and led 10+ automation initiatives that cut cost and raised productivity.',
      'Managed project and technical delivery for developer teams onsite and offshore.',
    ],
    skills: ['Architecture', 'Automation', 'Delivery management'],
    projects: ['jpmorgan-reference-data'],
  },
  {
    id: 'tata-infotech',
    org: 'tata-infotech',
    label: 'Tata Infotech',
    early: true,
    title: 'Senior Software Engineer',
    note: 'Deputed to Tata Consultancy Services',
    start: '2000-05',
    end: '2003-10',
    location: 'Mumbai and Singapore',
    // The owner's own account (2026-10-03): the start of the financial-services story.
    outcomes: [
      'Joined Tata Infotech in 2000 and, after three to four months of training, was deputed to Tata Consultancy Services.',
      'Worked on the Network Custody & Clearing System (NCS, now part of Tata BaNCS) for Standard Chartered’s rollout across 12 APAC regions, including about 11 months in Singapore: trade settlement, corporate actions, securities safekeeping, SWIFT and IBM MQSeries.',
      'Owned the Communication Interface module, which sent files to custody systems in Japan, Hong Kong, Singapore, Malaysia and other APAC locations, and provided 24×7 production and month-end support.',
      'After returning from Singapore, worked on DBS (Development Bank of Singapore), converting the Communication Interface module from DB2 to Oracle because of detailed knowledge of how it behaved.',
    ],
    skills: ['Custody and clearing', 'Trade settlement', 'SWIFT', 'IBM MQSeries', 'Production support', 'DB2 to Oracle migration'],
    projects: [],
  },
] as const satisfies readonly Role[]
