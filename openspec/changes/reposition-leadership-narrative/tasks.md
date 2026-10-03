## 1. Content model

- [x] 1.1 Add `kind` (`programme` | `tool`, default `tool`) and `headline` to `projectMetaSchema`, with per-kind rules: a programme requires `headline`, and a tool requires `stack` and `architecture`. `featured` becomes a position within its kind. Remove `highlighted`. Verify new fixture tests in `scripts/content/content.test.ts` fail a programme without a headline and a tool without a stack, each naming the file and field
- [x] 1.2 Add `yearsSince` to `content/derive.ts` and use it in `profile.ts` and the `experience.tsx` meta. Verify a unit test returns 26 for `2000-05` at 2026-10-03, and that no "25 years" or "25+" strings remain (`rg "25 years|25\+|Twenty-five" apps/web`)
- [x] 1.3 Remove `draft` from `aboutSchema` and add `evidence` to principles. Make `indexes.ts` include About unconditionally. Verify `buildAiContext` output contains the About story

## 2. Confidentiality guard

- [x] 2.1 Add `scripts/content/guard.ts` (design D6), run it over `content/` sources and the emitted indexes in the content plugin. Verify tests: "Goldman Sachs" in a fixture project fails naming the file and term; "$40M" fails; "FNAM" fails; the privacy page's "cookie" passes
- [x] 2.2 Add the "don't name CoreCard's clients" rule to `apps/api/src/ai/prompt.ts`, with an `ask.test.ts` fixture. Verify `pnpm --filter api test` passes

## 3. Profile, roles and credentials

- [x] 3.1 Update `profile.ts` with the design's draft copy: kicker, statement, lede, short lede, caption and the four proof items. Verify `pnpm --filter web test` (home and hero tests updated) passes and the hero contains no technology names
- [x] 3.2 Rewrite role outcomes in `roles.ts` per the design: drop Cookie/Jazz, scope the JPMorgan Chase 4×, add the IFC cadence/review/SLA lines and the BFS UK troubled-programme line, keep 8 banks, replace the coaching line with the approved 150+ wording, normalise the client to "JPMorgan Chase", and keep the title Principal Project Analyst. Verify the guard passes and the experience tests pass
- [x] 3.3 Retitle the recognition in `credentials.ts` as "Project of the Year — Cognizant internal recognition, IFC portfolio". Verify the credentials ledger renders it on /about and /experience

## 4. Programme case studies

- [x] 4.1 Write `content/projects/corecard-predictable-delivery.md` (kind programme, featured 1), with the Delivery engineering section. Verify it renders at `/work/corecard-predictable-delivery` with headline, ToC and facts, and that the guard passes
- [x] 4.2 Write `content/projects/ifc-portfolio-stabilisation.md` (featured 2). Verify the render and that the 2013 award wording matches 3.3
- [x] 4.3 Write `content/projects/jpmorgan-reference-data.md` (featured 3), with "FNMA (Fannie Mae)" and the system-wide 4× as separate results, and no vendors named other than FNMA. Verify the render and `rg -i "fnam\b|freddie|bloomberg" apps/web/content` returns nothing
- [x] 4.4 Add any needed domains to `project-domains.ts` (e.g. `programme-delivery`, `production-operations`, `market-data`). Verify the content check passes

## 5. Tools and Work

- [x] 5.1 Rewrite every tool's `summary` problem first and set `featured` 1–3 on Fast-JiraQL, Jira Dashboard and Confluence Pages. Verify the card test asserts summaries don't start with a technology name
- [x] 5.2 Correct `confluence-pages-details.md` and remove the private Bitbucket link from `jira-dashboard.md` (owner confirmed both repos are private).  In `confluence-pages-details.md`: remove the PyPI, GitHub and Read the Docs links, the "published on PyPI" summary and the `pip install` section; set `type: personal`; and state that the code is in a private repository. Verify `rg -i "pypi|pip install|readthedocs" apps/web/content/projects/confluence-pages-details.md` returns nothing and the case study renders without a links row
- [x] 5.3 Add the `kind` filter to `features/work/filters.ts` and `routes/work.tsx`, sorting programmes first. Verify `filters.test.ts` and `work.test.tsx` cover `/work?kind=programme` (3 results, filter selected)
- [x] 5.4 Render the programme headline in `ProjectCard` in place of the architecture thumbnail. Verify `ProjectCard.test.tsx` and `/_dev/ui` in both themes

## 6. Home

- [x] 6.1 Replace `SelectedWork` and `HighlightedProjects` with `ProgrammesLed` and `DeliveryTools` in `Sections.tsx` and `routes/home.tsx`, and update the Ask starter questions. Verify `home.test.tsx` asserts the section order and the absence of blog, knowledge-base and OAuth cards

## 7. About

- [x] 7.1 Update `about.ts` with the design's story and the four "How I lead" principles with evidence. In `routes/about.tsx` remove the draft UI, rename the heading and render the evidence. Verify `about.test.tsx` finds no `[data-placeholder]` and finds four evidence lines

## 8. Spec alignment, review and verification

- [x] 8.1 Amend `openspec/changes/rebuild-portfolio-app/specs/content-pages/spec.md` (Home and About requirements, design D8). Verify `openspec validate rebuild-portfolio-app` and `openspec validate reposition-leadership-narrative` pass
- [x] 8.2 Owner sign-off on all copy (hero, case studies, About, tool summaries). Record changes in the content files. Verify the owner has approved in conversation
- [x] 8.3 Run `pnpm --filter web lint`, `pnpm --filter web test`, `pnpm --filter web build` (with `VITE_API_BASE_URL` set) and e2e. Verify all pass
- [x] 8.4 On the dev server, check Home, Work, three case studies, About and Experience in all four layout modes and both themes: no overflow, Home not longer than today's by more than one section, body text at prose/body sizes. Verify with screenshots in the PR — Done via the e2e layout matrix (every route, all viewports, both themes: no sideways scroll, touch targets, thumbnails fit); Home keeps six h2 sections, as before. Screenshots were not attached.
- [x] 8.5 Final content sweep. Verify by putting the command output in the PR description:
  - `rg -i "goldman|apple|cookie and|jazz|fnam\b|freddie|JP Morgan|JPMC|\$[0-9]" apps/web/content apps/web/dist` returns nothing
  - "150+" appears only in `roles.ts`, and "approximately 150" only in the CoreCard case study
  - the 4× is never attached to the FNMA example
- [x] 8.6 Commit on a feature branch, push to GitHub and open a GitHub pull request. Verify the PR link is shared with the owner
