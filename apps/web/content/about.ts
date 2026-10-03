import type { About } from './schema.ts'

// The About page's story and "How I lead" principles (specs/portfolio-narrative "About page"), approved by the owner
// in openspec/changes/reposition-leadership-narrative/design.md. The story follows the career arc; each principle
// carries one concrete example from a role or case study. About is part of Ask's corpus.
export const about = {
  story: [
    'I started in 2000 as a software engineer at Tata Infotech, the year I finished an M.Tech at IIT Bombay. At JPMorgan Chase, through Cognizant, I was technical lead on the Global Market Reference Data platform, and stayed hands-on with the C++ as the role grew into project and programme management. That is where I learned how much of a bank depends on data nobody sees until it is late.',
    'Running the IFC’s portfolio of 50+ applications taught me that delivery is an operating rhythm: release windows, a weekly review with the client, and ticket ageing everyone can see. In UK banking the work widened to eight client accounts, fixed-price and T&M engagements, account P&L and RFP responses, including a multi-year programme inherited in trouble and brought home.',
    'At CoreCard I set up the delivery structure for a major US consumer card programme: 104 people across seven teams, with a release cadence, estimates and customer commitments that engineering could actually meet.',
    'The engineering habit stayed. When a delivery question keeps coming up, I would rather build something that answers it than ask for another status report. That is where the tools on this site come from.',
  ],
  principles: [
    {
      title: 'Commit only what fits',
      text: 'Dates are fixed up front, and scope is what flexes.',
      evidence: 'CoreCard deliveries on a fixed 4-week, later 8-week cadence, with remaining work re-planned rather than squeezed in.',
    },
    {
      title: 'Split the problem until it fits',
      evidence: 'A deliverable needed in one month but estimated at two. The critical scenarios shipped in the month, and the rest followed in parallel.',
    },
    {
      title: 'Make delivery measurable',
      text: 'Status should come from the work itself.',
      evidence: 'At the IFC, ticket ageing and SLA tracking were reviewed weekly with client managers, with no contractual SLA breaches.',
    },
    {
      title: 'Build the tool when the question repeats',
      evidence: 'Customer and internal Jira weren’t connected, so I wrote the sync. Release notes and traceability checks followed.',
    },
  ],
} as const satisfies About
