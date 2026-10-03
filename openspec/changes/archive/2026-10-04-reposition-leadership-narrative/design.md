## Context

See proposal.md for the motivation. The facts below come from the owner's portfolio brief and the decisions confirmed in conversation (2026-10-03):

- "8 UK banks" stands.
- **Two separate 150 figures:**
  - **150+ people**, cumulative, brought through the Agile delivery model by hands-on coaching. This figure appears only as a CoreCard outcome on Experience.
  - **~150 people**, the peak Development + QA + PMO population on the major card programme. This figure appears only in the CoreCard case study.
  - Neither figure is on the proof ledger, and the two never share a paragraph.
- CoreCard has **not** cleared naming its client or the client’s product, so neither is named on the site (or in this repository).
- Two internal client codenames were on the live site; they come off.
- JPMorgan Chase data vendors other than FNMA (Fannie Mae) are parked.
- **Formal title:** Principal Project Analyst, unchanged on Experience.
- **Portrait caption:** Programme delivery lead · CoreCard.
- **Naming:** JPMorgan Chase is the one spelling in public prose. The current "JPMorgan Chase" is normalised.
- **Public sources:** the owner's public sources (the client's public material, Fannie Mae, Freddie Mac) are validation material only. They never appear on the site, and they are never used to extend the owner's stated role.

Current state that shapes the approach:

- **Content.** All facts live in `apps/web/content/`: typed collections plus `projects/*.md` with zod frontmatter. `scripts/content` validates them at build time and emits `search-index.json` and `ai-context.json`, which `apps/api` uses for Ask.
- **Projects.** `ProjectMeta` has no notion of kind. `featured` (1–3) drives Home's "Selected work" and `highlighted` (1–3) drives Home's "Highlighted projects". Cards use an `architecture` thumbnail.
- **About.** `about.ts` has `draft: true`. The page renders draft markings, and `indexes.ts` keeps About out of Ask's corpus while it's a draft.
- **Specs.** `openspec/specs/` is empty. The in-flight `rebuild-portfolio-app` change owns `content-pages`, and its Home requirement lists "highlighted projects" explicitly.

## Goals / Non-Goals

**Goals:**
- Content and structure changes only, inside the existing visual language (tokens, components, layout modes).
- One source for every figure, with derived values (years) computed rather than typed.
- A build-time guard so confidential names and figures cannot return through content or Ask.

**Non-Goals:**
- No visual redesign, new tokens or new primitives.
- No public-source citations or links to the client's material. These are deferred until CoreCard clears the names.
- Not removing any existing project from `/work`. Only their Home placement and summaries change.

## Decisions

### D1. Programme case studies are project records with `kind: programme`
Add `kind: 'programme' | 'tool'` (default `tool`) to `projectMetaSchema`, and use a `superRefine` to set the per-kind rules:
- A programme requires `headline: { value, label }`. Its `stack` and `architecture` are optional.
- A tool keeps `stack` (min 1) and `architecture` (2–4) as required.

`ProjectCard` renders a programme's headline figure in place of the architecture thumbnail. `featured` becomes a position *within its kind* (1–3), so Home takes three programmes and three tools from it. The programmes use `type: work`.

*Alternative:* a separate `programmes/` collection with its own route. Rejected, because it would duplicate the case-study layout, filters, search and Ask indexing that projects already have.

### D2. Years are derived
Add `yearsSince(start: YearMonth, now: Date)` to `content/derive.ts`. `profile.ts` uses it for the lede and the proof figure, and `experience.tsx` for its meta description. It evaluates at build time, so a deployed build can lag by at most one anniversary until the next deploy. That is acceptable.

### D3. Home composition
`routes/home.tsx` becomes: Hero → ProgrammeLine → ProofLedger → `ProgrammesLed` → `DeliveryTools` → AskPrompt → ContactBand.
- `SelectedWork` splits into the two kind-filtered sections. Each has its own "All programmes →" or "All tools →" link to `/work?kind=…`.
- `HighlightedProjects` and the `highlighted` field are removed.
- The Ask starter questions change to: "How did he run delivery at CoreCard?", "What did he change at the IFC?", "Which tools has he built for delivery?"

### D4. Work kind filter
Extend `features/work/filters.ts` with `kind` (`programme` | `tool`), using the same read/write-to-URL pattern as `domain` and `stack`. Sorting becomes: kind (programme first), then `featured`, then year.

### D5. About is final, not draft
- Remove `draft` from `aboutSchema`, along with the `DraftMark` and placeholder aside in `routes/about.tsx`.
- Add `evidence: text` to each principle, rendered under the principle in the muted label style.
- Rename the section heading "How I work" to "How I lead".
- `indexes.ts` includes About unconditionally.

### D6. Confidentiality guard in the content build
`scripts/content/guard.ts` scans:
- the raw source of every file under `content/`
- the emitted `search-index.json` and `ai-context.json`

It checks them against a denylist and throws `<file>: denylisted term "<term>"`. The patterns are case-insensitive and word-bounded:
- the uncleared client and product names and the internal codenames (stored as hashes; see `packages/content-guard`), and `fnam`
- currency: `[$£€₹]\s?\d` and `\b(USD|GBP|INR|EUR)\s?\d`

The privacy page's word "cookie" must stay allowed, so a codename that is also an ordinary word is matched only in its codename usages, not as the bare word.

*Alternative:* an ESLint rule. Rejected, because Markdown and the generated JSON aren't linted.

### D7. Ask cannot volunteer the client
The Ask model may know CoreCard's clients from its training data. `apps/api/src/ai/prompt.ts` gains one rule: "Do not name CoreCard's clients or their products. Refer to 'a major US consumer card programme'." `ask.test.ts` adds a fixture in which the visitor guesses the client, and checks the rule is sent.

### D8. Amend the in-flight content-pages spec
Edit `openspec/changes/rebuild-portfolio-app/specs/content-pages/spec.md` in place:
- **Home:** the section list follows D3.
- **About:** "story, working principles with evidence, and credentials".

This keeps both changes coherent when `rebuild-portfolio-app` is archived. `portfolio-narrative` holds the positioning and accuracy rules.

## Draft copy (for owner sign-off before merge)

### Hero
- **Kicker:** Technology delivery & programme leadership · Mumbai
- **Statement:**
  - I lead delivery.
  - I understand payments.
  - I build tools.
- **Lede:** {26} years in financial-services technology, from engineering at JPMorgan Chase to running the IFC's application portfolio, eight UK banking accounts and now a major US consumer card programme at CoreCard. I lead programmes across customers, product, engineering and QA, and build the tooling that keeps delivery predictable.
- **Short lede:** {26} years in financial-services technology: JPMorgan Chase, the IFC, eight UK banks and CoreCard.
- **Caption:** Programme delivery lead · CoreCard. The formal title, **Principal Project Analyst**, stays unchanged on Experience.

{26} is derived from the May 2000 start (D2), and reads 26 at the time of writing.

### Proof ledger
| Figure | Label |
|---|---|
| {26} | years in financial-services technology |
| 104 | people across 7 teams, CoreCard card programme |
| 50+ | applications run for the IFC |
| 4× | system-wide throughput, JPMorgan Chase reference-data platform |

### Programme case studies
Each has a headline, then context, problem, what I did and outcome.

**1. Building predictable delivery at scale** (CoreCard, 2019–present). Headline: *7 teams · 104 people*.
- **Context:** no established PMO or consistent Agile operating model, and teams aligned to function or product.
- **What I did:**
  - Set up a delivery structure and cadence.
  - Led release planning, cross-team scheduling, estimate validation, dependencies and escalations.
  - Reconciled customer commitments with engineering capacity.
  - Ran release governance, billing validation and traceability.
  - Became the primary lead for customer delivery discussions within about 6 months, working with 10–15 customer product owners and the relevant service leads.
- **Operating model:**
  - Deliveries every 2 sprints (about 4 weeks), later every 4 sprints (about 8 weeks).
  - Dates fixed up front, and only work that fits is committed.
  - High-priority defects closed before release.
- **A major programme within the same card-platform engagement:**
  - 2–3 months of proposal and sizing, involved from proposal through planning and execution.
  - Coordinated engineering and QA estimates and sizing.
  - Contributed to the financial proposal.
  - Took part in senior client discussions to explain and defend the proposed numbers.
  - The final commercial figures were vetted by the COO.
  - At its peak, the programme had approximately 150 people across Development, QA and PMO.
- **Split to unblock:** a deliverable needed in about 1 month was estimated at about 2. The critical scenarios shipped in the month, and the rest followed in parallel.
- **Delivery engineering:**
  - Customer-to-internal Jira sync, which removed manual transfer between systems that weren't connected.
  - A standard estimation template.
  - Generated release notes.
  - SVN pre-commit checks that enforce Jira traceability.
  - Delivery analytics, later Plotly Dash tooling.

**2. Stabilising a 50+ application portfolio** (IFC, World Bank Group, via Cognizant, 2012–2014). Headline: *0 contractual SLA breaches*.
- **Problem:** several project managers had left, knowledge transfer was weak, delivery and production support were unstable, and deployments were ad hoc.
- **What I did:**
  - Took ownership and stabilised delivery and customer confidence in about 3 months.
  - Ran development and production support.
  - Moved from ad-hoc deployments to about 1-week implementation windows, later about 2-week windows.
  - Set up a weekly management review with 6–7 client managers.
  - Introduced Remedy-based ticket ageing and SLA tracking, and tightened testing and release discipline.
- **Outcome:**
  - A predictable release cadence, with priority tickets handled on time.
  - No contractual SLA breaches or penalties across the engagement.
  - The portfolio expanded to further engagements.
  - 2013 Project of the Year, Cognizant internal recognition for the scale, complexity and delivery performance of the portfolio.

**3. Re-engineering market reference-data processing** (JPMorgan Chase, via Cognizant, 2003–2012). Headline: *4× system-wide throughput*.
- **Context:** Global Market Reference Data, covering approximately 3 million securities. Approximately 10–12 vendor files from multiple external market and reference-data sources arrived at daily, weekly and monthly frequencies.
- **Problem:** large monthly files created a processing bottleneck.
- **What I did:** as technical lead, later project and programme manager, and hands-on in C++, redesigned processing around:
  - Oracle tables that drive batch decisions
  - multithreading
  - queue-based C++ workers
  - improved file handling
- **Results (two measurements):**
  - **FNMA workload:** the FNMA (Fannie Mae) monthly-file workload went from approximately 20–24 days to approximately 2 days.
  - **System-wide throughput:** separately, database analysis measured approximately 4× throughput across the whole reference-data system.

### About: story
1. I started in 2000 as a software engineer at Tata Infotech, the year I finished an M.Tech at IIT Bombay. At JPMorgan Chase, through Cognizant, I was technical lead on the Global Market Reference Data platform, and stayed hands-on with the C++ as the role grew into project and programme management. That is where I learned how much of a bank depends on data nobody sees until it is late.
2. Running the IFC's portfolio of 50+ applications taught me that delivery is an operating rhythm: release windows, a weekly review with the client, and ticket ageing everyone can see. In UK banking the work widened to eight client accounts, fixed-price and T&M engagements, account P&L and RFP responses, including a multi-year programme inherited in trouble and brought home.
3. At CoreCard I set up the delivery structure for a major US consumer card programme: 104 people across seven teams, with a release cadence, estimates and customer commitments that engineering could actually meet.
4. The engineering habit stayed. When a delivery question keeps coming up, I would rather build something that answers it than ask for another status report. That is where the tools on this site come from.

### About: how I lead
1. **Commit only what fits.** Dates are fixed up front, and scope is what flexes. *Evidence: CoreCard deliveries on a fixed 4-week, later 8-week cadence, with remaining work re-planned rather than squeezed in.*
2. **Split the problem until it fits.** *Evidence: a deliverable needed in one month but estimated at two. The critical scenarios shipped in the month, and the rest followed in parallel.*
3. **Make delivery measurable.** Status should come from the work itself. *Evidence: at the IFC, ticket ageing and SLA tracking were reviewed weekly with client managers, with no contractual SLA breaches.*
4. **Build the tool when the question repeats.** *Evidence: customer and internal Jira weren't connected, so I wrote the sync. Release notes and traceability checks followed.*

### Experience outcome edits
- **CoreCard** (title stays *Principal Project Analyst*):
  - Drop the two internal codenames.
  - "Set up delivery structure and cadence for a major US consumer card programme: 7 teams, 104 people."
  - "Introduced Agile delivery across the programme and brought 150+ people through sprint planning, estimation and release cadence, until the team leads could run the model themselves." This replaces "coached 150+ team members on Agile principles". It appears here only, never on the proof ledger or in the case study.
  - "Led customer delivery discussions and release governance."
- **JPMorgan Chase** (client name normalised from the current spelling with a space after "JP"): "Re-engineered reference-data processing; database analysis measured approximately 4× throughput across the whole system."
- **IFC:** add release windows, the weekly management review and "no contractual SLA breaches".
- **BFS UK:** add "including a multi-year programme inherited in a troubled state and delivered".

### Tool summaries (problem first)
- **Fast-JiraQL:** "Answers the delivery questions teams keep asking Jira, through one API. REST and GraphQL over Jira data in PostgreSQL."
- **Jira Delivery Dashboard:** "Sprints, worklogs and releases in one view, so status comes from the work itself. Dash, with an LLM over the data."
- **Confluence Space Pages Details:** "Pulls a whole Confluence space into structured data in one pass. Async Python." The code is in a private repository, so the card and case study carry no links. The existing PyPI claim, `pip install` section and dead GitHub and Read the Docs links are removed, and `type` changes from `open-source` to `personal`.
- **Blog Platform, Knowledge Base, OAuth Server, Admin Dashboard, Portfolio Website:** rewritten the same way, no longer on Home.

## Risks / Trade-offs

- **[Risk]** Unnamed-client phrasing reads as evasive. → Use a concrete, honest descriptor ("a major US consumer card programme") and lean on people, cadence and outcomes. Revisit if CoreCard clears the names.
- **[Risk]** The denylist blocks a legitimate word (e.g. an uncleared name that is also an everyday word). → The error names the term. Add a narrow allowlist entry when needed rather than weakening the pattern.
- **[Risk]** The Ask model confirms the client from its own knowledge. → D7 adds a prompt rule and a test. This is not airtight against a determined user, which is acceptable for a portfolio.
- **[Risk]** Agent-drafted copy is not in the owner's voice. → All copy above is a draft. The owner signs off before merge (task 8.2).
- **[Trade-off]** "0 contractual SLA breaches" as the IFC headline is the boldest figure on the site. It's scoped by its label and backed in the case study. The proof ledger uses 50+ applications instead.

## Migration Plan

Content-only deploy through the normal Vercel pipeline. To roll back, revert the merge commit. There are no data or API contract changes, apart from the regenerated `ai-context.json`, which is picked up from the deployed web build.
