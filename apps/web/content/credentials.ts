import type { Credentials } from './schema.ts'

// apps/portfolio Education, Certifications and Recognition. Certifications and recognition are also the
// Programme Line's milestones.
export const credentials = {
  education: [
    {
      id: 'iit-bombay',
      degree: 'M.Tech, Energy Systems Engineering',
      institution: 'Indian Institute of Technology (IIT) Bombay',
      start: 1998,
      end: 2000,
    },
    {
      id: 'gec-raipur',
      degree: 'B.E., Chemical Engineering',
      institution: 'Government Engineering College, Raipur',
      start: 1994,
      end: 1998,
    },
  ],
  certifications: [
    {
      id: 'aws-saa',
      title: 'AWS Certified Solutions Architect – Associate',
      short: 'AWS Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2020-09',
    },
  ],
  recognition: [
    { id: 'guiding-star', title: 'Guiding Star', date: '2009-Q4' },
    { id: 'project-of-the-year', title: 'Project of the Year', date: '2013' },
    { id: 'manager-of-the-quarter', title: 'Manager of the Quarter', date: '2021-Q3' },
  ],
} as const satisfies Credentials
