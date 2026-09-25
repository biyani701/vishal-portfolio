# 07 — Implementation Roadmap (after design approval)

> **Superseded (2026-09-25)** by `openspec/changes/rebuild-portfolio-app` (design.md dependency sequence P1–P14 and tasks.md). This roadmap is kept for history.

> **Status (2026-09-25):** UF-1/2/3 are accepted and DD-1…DD-4 are proposed.
> - Phase 2 builds `src/design/tokens.css` (Tailwind v4 `@theme`) and runs `shadcn init --base base`. It also adds the `src/ui` contract tests and the CLAUDE.md UI rule block.
> - Phase 3 builds the **new app on a fresh Vite + React 19 + Tailwind v4 scaffold**. The old CRA/MUI app is not upgraded to MUI 9, and it stays live until cut-over.
> - The table below reflects this.

Every phase ends with a buildable, deployable app and its own PR. Phase gates run lint, unit tests, `vite build`, and the Playwright viewport matrix (from Phase 4 on).

| Phase | Scope | Exit criteria | Depends on |
|---|---|---|---|
| **0** Inventory & architecture | This package | Approved: IA, route map, decisions D-1…D-9 | — |
| **1** Design exploration | 3 directions, AI states, responsive comps | Direction chosen (DD-1…DD-4); one refinement pass on Home, Work, Article and Ask for the chosen direction | 0 |
| **2** Design system foundation | `src/design/tokens.css` (Tailwind v4 `@theme`, light/dark, mode `@custom-variant`s); fonts self-hosted (Bricolage Grotesque, Newsreader, JetBrains Mono); Lucide; `shadcn init --base base` and the §A components from `05`; `src/ui` contract tests; lint guards (no Radix/vaul/cmdk/old Base UI, no arbitrary values); CLAUDE.md UI rule block; gallery route `/_dev/ui` | Tokens are the single source; contrast passes in light and dark; contract tests are green | 1 |
| **3** Platform scaffold | **New app**, not a migration: fresh Vite 8 + React 19 + React Router + Tailwind v4 + Vitest + ESLint 9 + Playwright + pnpm CI on Node 22+; env `VITE_*` + runtime-config; auth callback paths reserved. The old CRA/MUI app stays deployed until cut-over (Phase 14) | The empty shell builds and deploys to a preview path | 0 (can start in parallel with 1–2) |
| **4** Responsive foundation | `layout/modes`, `useLayoutMode`, AppShell measurement → CSS vars, PageShell, `viewport-fit=cover`, safe areas, lint rule | Unit tests for the mode matrix; Playwright no-overflow on all routes | 3 |
| **5** Application shell | Navigation (3 compositions), static footer, overlay stack, theme toggle, ⌘K search, AccountMenu, redirects table | Nav inventory checklist passes; landscape header ≤ 48px | 2, 4 |
| **6** Content layer + Homepage | `content/` typed records (real data; fix `resumeData` placeholder), Home sections | Home passes the Playwright matrix; Lighthouse ≥ 90 on mobile | 5 |
| **7** About / Experience | About, Experience (Timeline, CapabilityMap, credentials) | Anchors from the old home redirect correctly | 6 |
| **8** Work | Index + FilterBar, case-study template, ArchitectureFigure | Five projects migrated; outcomes/screenshots or approved placeholders | 6 |
| **9** Writing / Knowledge | MarkdownContent, CodeBlock (Shiki), article template, knowledge domains/topics, glossary, interactive 3DS flow; blog editor per D-3 | All old blog/knowledge URLs redirect | 6 |
| **10** Contact / Auth / Legal | Contact (Tally + consent), SignInPanel, callbacks untouched, legal, colophon, 404, `/_dev` | Real OAuth round trip on staging | 5 |
| **11** CopilotKit v2 / AG-UI | Runtime per D-9, content index, tools, Ask components, HITL contact, rate limits | Every AI state reproducible in tests (mocked AG-UI stream); red-team prompt-injection checklist passes | 6, D-9 approved |
| **12** Cross-app responsive verification | Full Playwright matrix (9 viewports × all routes), real-device pass (iOS Safari, Android Chrome, both orientations) | Zero overflow / overlap failures | 5–11 |
| **13** A11y / performance / SEO | axe on every route, keyboard paths, reduced motion, meta/OG, sitemap, prerender of static routes | WCAG 2.2 AA; CWV green | 12 |
| **14** Production hardening | Error boundaries, analytics consent, CSP, monitoring, rollback runbook | Go-live checklist signed off | 13 |

## Relationship to the existing OpenSpec change
`openspec/changes/modernize-react19-stack-and-responsive-layout/` covers Phases 3–4 and part of 5 (platform + responsive foundation), and it stays valid as the technical foundation. Once this exploration is approved it should be **revised** (via `/opsx:update`):
- Non-goals move into scope: "visual rebrand" and "new routes" are now in scope.
- The visual work moves into a new change, `redesign-portfolio-application`, with the capabilities `design-system`, `information-architecture`, `ask-experience` and `content-model`.
- `lucide-react` becomes the icon system instead of being removed.

Beads get created per phase (an epic with children and dependencies) **after** you approve the direction.
