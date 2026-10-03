---
slug: "corecard-predictable-delivery"
title: "Building predictable delivery at scale"
kind: "programme"
headline: {"value": "7 teams · 104 people", "label": "one delivery structure and cadence"}
year: 2019
type: "work"
status: "in-flight"
featured: 1
summary: "CoreCard, a major US consumer card programme: a delivery structure and cadence where dates are fixed up front and only work that fits is committed."
domains: ["programme-delivery", "payments"]
outcomes: []
links: {}
---

## Context

When I joined CoreCard in 2019, the programme had no established PMO and no consistent Agile operating model. Teams were organised by function and product, serving a major US consumer card programme.

I set up a delivery structure and cadence across 7 teams and 104 people.

## What I did

- Led release planning, cross-team scheduling, estimate validation, dependencies and escalations.
- Reconciled customer commitments with engineering capacity.
- Ran release governance, billing validation and delivery traceability.
- Became the primary lead for customer delivery discussions within about 6 months, working with 10–15 customer product owners and the relevant service leads.

## Operating model

- Customer deliveries every 2 sprints (about 4 weeks), later every 4 sprints (about 8 weeks).
- Delivery dates fixed up front. Only work that could realistically fit was committed; the rest was reprioritised or moved to a later delivery.
- High-priority defects closed before release.

The result was a planning and release model the customer could rely on.

## A major programme within the same card-platform engagement

- 2–3 months of proposal and sizing, and involvement from proposal through planning and execution.
- Coordinated engineering and QA estimates and sizing.
- Contributed to the financial proposal.
- Took part in senior client discussions to explain and defend the proposed numbers. The final commercial figures were vetted by the COO.
- At its peak, the programme had approximately 150 people across Development, QA and PMO.

### Split to unblock

The customer needed an important deliverable in about 1 month; the engineering estimate was about 2. Working with the internal teams and the customer, we split the work: the critical scenarios shipped within the month, and the rest followed in parallel. That unblocked the customer without overcommitting the teams.

## Delivery engineering

I don't treat a PMO as spreadsheets and meetings. Where delivery friction kept recurring, I removed it with a tool:

- **Customer-to-internal Jira sync.** The customer's Jira and ours weren't connected; automation replaced the manual transfer between them.
- **A standard estimation template**, so estimates from different teams could be compared and validated.
- **Generated release notes**, instead of assembling them by hand for every delivery.
- **SVN pre-commit checks** that enforce Jira traceability on every change.
- **Delivery analytics**, later built out as Plotly Dash tooling.
