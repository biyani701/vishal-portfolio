import { defineAskTool } from './ask.js'
import { z } from 'zod'

// Spike S1 only: a placeholder prompt and one read-only tool, enough to show a tool call streaming end to end.
// Task 11.2 replaces both with the agent's real prompt and its tools over ai-context.json.

export const SPIKE_PROMPT =
  "You answer visitors' questions about Vishal Biyani's portfolio site. Use the tools to look things up; don't guess."

export const SITE_SECTIONS = ['Home', 'Work', 'Experience', 'About', 'Writing', 'Knowledge', 'Contact'] as const

export const spikeTools = [
  defineAskTool({
    name: 'list_site_sections',
    description: 'Lists the sections of the portfolio site, optionally only those whose name contains a word.',
    parameters: z.object({ contains: z.string().optional().describe('Case-insensitive filter on the section name') }),
    execute: async ({ contains }) => ({
      sections: SITE_SECTIONS.filter((name) => !contains || name.toLowerCase().includes(contains.toLowerCase())),
    }),
  }),
]
