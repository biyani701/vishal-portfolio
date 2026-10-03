## Why

The site reads as a developer portfolio: Home's "Selected work" and "Highlighted projects" are six software projects, the Work section has no programme case studies, and the About page is still marked draft. The owner's target audience is senior technology executives hiring for delivery, programme and technical-programme leadership. The site should tell that story (26 years in financial-services technology, from engineer to programme leader) and prove it with programmes, with the tools as supporting evidence that the owner improves the delivery system itself.

Some live copy is also unsafe or out of date. It names internal client codenames ("Cookie", "Jazz"), says "25 years", and states "quadrupling throughput" without saying what was measured.

## What Changes

- **Positioning and hero.** New kicker, statement ("I lead delivery. I understand payments. I build tools."), lede and caption ("Programme delivery lead · CoreCard"; the formal title Principal Project Analyst is unchanged) that position the owner as a senior technology delivery and programme leader. Years of experience are derived from the first role's start date, so they never go stale.
- **Proof ledger.** It shows four leadership outcomes: years in financial services, 104 people across 7 teams, 50+ applications, and 4× system-wide throughput. The 8 banks and the 150+ people brought through the Agile model stay as Experience outcomes; the separate ~150 peak programme population appears only in the CoreCard case study.
- **Programme case studies (new).** Three narrative case studies in Work:
  - *Building predictable delivery at scale* (CoreCard)
  - *Stabilising a 50+ application portfolio* (IFC)
  - *Re-engineering market reference-data processing* (JPMorgan Chase)
  Each follows problem → action → outcome, with a headline outcome.
- **Home restructure.** Hero → Programme Line → proof ledger → Programmes I've led (3 programme case studies) → Delivery tools (3 tools, problem first) → Ask → contact. **BREAKING (content):** the "Highlighted projects" band (blog, knowledge base, OAuth server) leaves Home. Those projects stay on `/work`.
- **Work.** Projects gain a kind (programme or tool), and `/work` can filter by it. Programme case studies list first. Tool summaries are rewritten to lead with the delivery problem, with technology second. Internal tools that have no public repository are described inside the CoreCard case study's "Delivery engineering" section, not as cards: Jira-to-Jira sync, release-note automation, SVN traceability controls, the estimation template and Dash analytics.
- **Experience.** Role outcomes are rewritten in the same voice. The codenames are removed. The JPMorgan Chase throughput claim is scoped to the whole system. IFC gains release cadence, the weekly management review and the SLA record. Project of the Year is attributed as Cognizant internal recognition.
- **About completed.** The story follows the career arc. "How I lead" has four principles, each with a concrete proof point. `draft` is removed, so About enters Ask's corpus.
- **Confidentiality guard.** A content test fails the build if any denylisted term appears in content or generated indexes:
  - Client names not cleared by CoreCard (Goldman Sachs, Apple Card)
  - The internal codenames (Cookie, Jazz)
  - Currency figures
  - The misspelling "FNAM"

## Capabilities

### New Capabilities

- `portfolio-narrative`: How the site presents the owner: positioning, proof, programme case studies, the Home story order, Experience and About copy, and the confidentiality and accuracy rules that constrain all of it.

### Modified Capabilities

None in `openspec/specs/`, which is empty. The in-flight `rebuild-portfolio-app` change owns `content-pages`. Its Home and About requirements are amended in that change's spec text so the two stay coherent (see design.md).

## Impact

- `apps/web/content/`: `profile.ts`, `roles.ts`, `about.ts`, `credentials.ts`, `schema.ts`, `project-domains.ts`, `projects/*.md` (3 new programme files, tool summaries rewritten).
- `apps/web/src/components/home/` (Hero, Sections), `routes/home.tsx`, `routes/work.tsx` and `features/work/filters.ts` (kind filter), `routes/about.tsx` (principle evidence), `routes/experience.tsx` (meta copy).
- `apps/web/scripts/content`: the confidentiality denylist check. The `ai-context.json` and `search-index.json` outputs change, which changes Ask's answers.
- Tests: home, work, about, experience, content-schema and the new denylist test.
- No API, dependency or infrastructure changes.
