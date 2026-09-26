// Display names for the `domains` tags in content/projects/*.md, used by the /work domain filter. Every tag a
// project uses must be listed here (scripts/content checks it).
export const projectDomains = {
  apis: 'APIs',
  dashboards: 'Dashboards',
  'delivery-tooling': 'Delivery tooling',
  'developer-tools': 'Developer tools',
  'internal-tools': 'Internal tools',
  'knowledge-management': 'Knowledge management',
  payments: 'Payments',
  publishing: 'Publishing',
  web: 'Web',
} as const satisfies Record<string, string>
