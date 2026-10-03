import { z } from 'zod'

// Everything www.biyani.xyz says (specs/domain-hub "Hub content"; copy from openspec/changes/add-biyani-hub/design.md).
// `live` for the blog and knowledge base must match `site.live` in apps/web/content/projects (sites.test.ts).

const text = z.string().trim().min(1)
const https = z.url({ protocol: /^https$/ })

export const siteSchema = z.object({
  id: z.enum(['portfolio', 'blog', 'kb']),
  name: text,
  url: https,
  purpose: text,
  live: z.boolean(),
})

export const labSchema = z.object({
  name: text,
  /** Served by GitHub Pages at www.biyani.xyz/<path>/. */
  path: z.string().regex(/^[a-z0-9-]+$/, 'a repo name, e.g. click-tracker'),
  description: text,
})

export const hubSchema = z.object({
  identity: z.object({ name: text, line: text, portfolio: https, contact: https }),
  sites: z.array(siteSchema).min(1),
  labs: z.object({ heading: text, intro: text, entries: z.array(labSchema) }),
})

export type Hub = z.infer<typeof hubSchema>
export type Site = z.infer<typeof siteSchema>
export type Lab = z.infer<typeof labSchema>

export const LABS_ORIGIN = 'https://www.biyani.xyz'

export const hub: Hub = hubSchema.parse({
  identity: {
    name: 'Vishal Biyani',
    line: 'Technology delivery and programme leadership in financial services.',
    portfolio: 'https://vishal.biyani.xyz',
    contact: 'https://vishal.biyani.xyz/contact',
  },
  sites: [
    {
      id: 'portfolio',
      name: 'Portfolio',
      url: 'https://vishal.biyani.xyz',
      purpose: 'Programmes I’ve led, the tools built alongside them, and the story behind them.',
      live: true,
    },
    {
      id: 'blog',
      name: 'Blog',
      url: 'https://blog.biyani.xyz',
      purpose: 'Writing on delivery, payments and the tools in between.',
      live: false,
    },
    {
      id: 'kb',
      name: 'Knowledge Base',
      url: 'https://kb.biyani.xyz',
      purpose: 'A payments and capital-markets knowledge base with a searchable glossary.',
      live: false,
    },
  ],
  labs: {
    heading: 'Labs',
    intro: 'Earlier experiments, kept online as they were.',
    entries: [
      { name: 'Click Tracker API', path: 'click-tracker', description: 'Documentation for a small click-tracking API.' },
      {
        name: 'Jira Transition Runner',
        path: 'jira-transition-runner',
        description: 'Documentation for a Jira workflow-transition tool. The source is private.',
      },
      { name: 'Auth.js documentation', path: 'my-next-auth-app', description: 'Notes on running Auth.js across several front ends.' },
    ],
  },
})

export const labUrl = (lab: Lab) => `${LABS_ORIGIN}/${lab.path}/`
export const hostOf = (url: string) => new URL(url).host
