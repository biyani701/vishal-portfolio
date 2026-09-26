import type { About } from './schema.ts'

// The About page's story and working principles (design package §12.1: supplied by the owner). Until then this
// is a DRAFT: the story restates facts from elsewhere in content/ (roles, credentials, proof) and the principles
// are suggestions inferred from the role outcomes, for the owner to rewrite. `draft: true` makes the page mark
// it as placeholder copy and keeps it out of Ask's corpus (scripts/content/indexes.ts).
export const about = {
  draft: true,
  story: [
    'I joined Tata Infotech as a Senior Software Engineer in 2000, the year I finished an M.Tech at IIT Bombay, and have spent the years since in financial-services software: JP Morgan Chase, the World Bank Group’s IFC, eight UK banks, and now CoreCard.',
    'Somewhere along the way the job changed from writing the code to running the programmes around it: scope, estimates, releases, P&L and the people doing the work. The engineering habit stayed. When a delivery question keeps coming up, I would rather build a tool that answers it than ask for another status report.',
    'This site is part of that habit. The projects on it are tools built alongside delivery work, and the site itself is one of them.',
  ],
  principles: [
    {
      title: 'Make delivery measurable',
      text: 'Plans, risks and status should come from the work itself, so the numbers in a steering meeting are ones the team recognises.',
    },
    {
      title: 'Remove blockers before adding process',
      text: 'Most delays are dependencies nobody owns. Finding the owner usually does more than another ceremony.',
    },
    {
      title: 'Coach, then step back',
      text: 'Agile adoption sticks when teams run it themselves; the PMO’s job is to make that possible, not to run it for them.',
    },
    {
      title: 'Build the tool when the question repeats',
      text: 'A small script that answers a recurring question saves more time than a better spreadsheet.',
    },
  ],
} as const satisfies About
