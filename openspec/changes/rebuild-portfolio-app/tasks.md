## 1. P1 — Scaffold apps/web

- [x] 1.1 Create `apps/web` (Vite, React 19, TypeScript, React Router) in the pnpm workspace and Turborepo pipelines; verify `pnpm --filter web dev` serves a placeholder page and `build` emits `dist/`
- [x] 1.2 Add Vitest + Testing Library + jsdom with one smoke test; verify `pnpm --filter web test` passes
- [x] 1.3 Add ESLint 9 flat config with the UF-3 guards (forbidden imports, `@base-ui/react` only in `src/ui`, no `asChild`, no arbitrary Tailwind values outside `src/design`/`src/ui`); verify fixture files violating each rule fail lint
- [x] 1.4 Add the Playwright harness with the 9-viewport matrix and a route list fixture (no-overflow and header-overlap assertions); verify it runs green against the placeholder
- [x] 1.5 Configuration: `VITE_*` variables, `runtime-config.js` loader, and a required-variable check at build; verify that a missing `VITE_API_BASE_URL` fails the build with its name
- [x] 1.6 CI workflow for `apps/web` (Node 22, pnpm: lint, typecheck, test, build, e2e) plus a Vercel preview per PR; verify a PR shows all checks and a preview URL; production Pages deploy stays on `apps/portfolio`

## 2. P2 — Design system

- [x] 2.1 `src/design/tokens.css`: the §4 light and dark tokens, the four `@custom-variant` modes and the no-flash theme script in `index.html`; verify a token snapshot test and that the dark theme applies before first paint (Playwright with emulated dark scheme)
- [x] 2.2 Self-host Bricolage Grotesque, Newsreader and JetBrains Mono (woff2 subsets, preload); verify fallback rendering with fonts blocked
- [x] 2.3 `shadcn init --base base`, then add Button, Dialog, AlertDialog, Drawer, Popover, PreviewCard, Menu, ContextMenu, NavigationMenu, Autocomplete, Combobox, Select, Tabs, Tooltip, Toast, Collapsible, Accordion, Field/Form/Input/Checkbox/RadioGroup, ToggleGroup, ScrollArea and Separator, restyled with Programme tokens and `cva`; verify none import Radix/vaul/cmdk
- [ ] 2.4 Contract tests for Dialog, Drawer, Menu, Autocomplete, Popover, Tabs and Toast (focus trap/restore, Escape, outside click, keyboard navigation, 44px targets); verify all pass
- [ ] 2.5 StatusChip, Portrait (DD-4 guard), Lucide icon wrapper and motion helpers (`Reveal`, reduced-motion gate); verify unit tests, including reduced motion
- [ ] 2.6 `/_dev/ui` gallery (dev only) showing every component in light and dark; verify axe finds no violations there
- [ ] 2.7 Add the UI rule block to `CLAUDE.md` and `AGENTS.md` (Base UI 1.x, `render` not `asChild`, `shadcn add`, tokens only); verify both files contain it

## 3. P3 — Layout foundation

- [ ] 3.1 `useLayoutMode` with the same queries as the CSS variants; verify unit tests for 932×430, 568×320, 1024×768, 390×844 and 768×1024
- [ ] 3.2 AppShell (header 64/56/44, static footer, header height published as a CSS variable, `viewport-fit=cover`, safe areas) and PageShell; verify Playwright header-overlap and no-overflow on the placeholder routes
- [ ] 3.3 `redirects.ts` implementing the full route migration map, and 404 page; verify a test iterates every legacy path and asserts its destination with `replace`
- [ ] 3.4 Theme control (light/dark/system) with persistence through the existing consent-gated cookie plus local-storage fallback; verify it persists across reloads and follows the OS on "system"

## 4. P4 — Content layer

- [ ] 4.1 Zod schemas and loaders for profile, roles, milestones, skills, credentials, projects, writing, knowledge and glossary; verify an invalid fixture fails the build with the file and field named
- [ ] 4.2 Migrate the real content from `apps/portfolio` (Experience, CareerTimeline, Skills, Works, Certifications, Education, Recognition, sampleBlogData, domainKnowledgeData, glossaryData), removing the placeholder `resumeData`; verify record counts (5 projects, 5 engagements, 68 terms, 3 articles, 3 domains)
- [ ] 4.3 Markdown pipeline (remark/rehype + sanitise + Shiki); verify a fixture article renders headings, a code block and a table
- [ ] 4.4 Build `search-index.json` and `ai-context.json`; verify both are generated, deterministic, and contain only published fields

## 5. P5 — Navigation shell and auth

- [ ] 5.1 Navigation in three compositions (desktop NavigationMenu; Drawer for tablet/mobile; 44px compact bar) with current-section indication; verify the Playwright nav flows in each mode
- [ ] 5.2 Command palette (Dialog + Autocomplete) over the search index, with the "Ask: …" option stubbed until P11; verify ⌘K opens it, results are grouped, and the keyboard works
- [ ] 5.3 AuthProvider using the existing Auth.js endpoints; SignInPanel; AccountMenu; `/account`; callback routes at their existing paths; verify a GitHub sign-in round trip against the auth server on a preview
- [ ] 5.4 Footer and legal links; verify links resolve and the footer stays static in all modes

## 6. P6 — Home and Programme Line

- [ ] 6.1 `buildProgramme` pure function (segments, label-inside rule, 12px milestone clustering, axis); verify unit tests at 288/343/358/500/1100 px
- [ ] 6.2 ProgrammeLine forms (lanes, compact strip, span rows, table) with `aria-label` and "View as table"; verify Playwright at 320×568, 375×667, 390×844 and 844×390: no overflow, rows ≥ 56px
- [ ] 6.3 Home sections (hero with portrait, Programme Line, proof ledger, selected work, Ask input, writing/knowledge, contact band) in all four modes; verify against the Programme canvas artboards and that Playwright is green

## 7. P7 — Experience and About

- [ ] 7.1 `/experience`: interactive Programme Line + role panel with deep links (`#role-id`), prev/next, skills over time, credentials; verify the deep-link test and keyboard selection
- [ ] 7.2 `/about` (story, principles, credentials, no portrait) with placeholder copy clearly marked; verify that no portrait renders and there's no overflow in any mode

## 8. P8 — Work

- [ ] 8.1 `/work` with URL-synced filters and ProjectCard (screenshot or ArchitectureThumb); verify the `?stack=python` scenario
- [ ] 8.2 `/work/:slug` case-study layout (facts, ToC, prose, ArchitectureFigure, CodeBlock, aside with "Ask about this" and related); verify all 5 projects render and the ToC collapses on mobile

## 9. P9 — Writing and Knowledge

- [ ] 9.1 `/writing` and `/writing/:slug` (article layout, ToC, CodeBlock copy with toast, glossary-term popovers); verify the code-copy scenario
- [ ] 9.2 `/knowledge` and `/knowledge/:domain/:topic`; verify all migrated topics render
- [ ] 9.3 `/knowledge/glossary` (Autocomplete, category counts, A–Z, detail panel, Drawer on mobile); verify the "auth" search scenario
- [ ] 9.4 The 3-D Secure StepFlow (desktop sequence + mobile vertical steps, Prev/Next, "Step n of 5" announcements); verify the keyboard stepping scenario

## 10. P10 — apps/api and Contact

- [ ] 10.1 Scaffold `apps/api` on Vercel (Node functions; Hono), with `GET /health`, CORS limited to site origins, and structured logging without PII; verify a health check on the preview deploy and a CORS rejection test
- [ ] 10.2 Postgres `contact_messages` table + migrations; rate-limit store (KV); verify the migration applies on a preview database
- [ ] 10.2a Environment configuration: a typed env loader with defaults (design A9), a committed `apps/api/.env.example` without values, `.env` git-ignored, and secrets set only in the Vercel project env (the owner enters `RESEND_API_KEY`, `ANTHROPIC_API_KEY` and `DATABASE_URL`); verify a missing required variable fails start-up naming it, and that `git grep` finds no secret values
- [ ] 10.2b Resend sender domain: add `biyani.xyz` (or a sending subdomain) in Resend and create its SPF/DKIM/return-path (and optional DMARC) records in Namecheap DNS (owner action); verify Resend shows the domain as verified and a test email passes SPF and DKIM
- [ ] 10.3 `POST /contact`: validation, honeypot, per-IP rate limit (`CONTACT_RATE_LIMIT_PER_IP_PER_HOUR`), store-then-email via Resend from `CONTACT_FROM_EMAIL` to `CONTACT_TO_EMAIL`, `pending_email` retry cron, and a retention purge driven by `CONTACT_RETENTION_DAYS`; verify tests for success, email outage (stored + retried), rate limit, and purge at a changed retention value
- [ ] 10.4 `/contact` page (intent picker, fields, selectable email + Copy, success, failure alert, rate-limit message); verify the Playwright success and failure flows against a mocked endpoint
- [ ] 10.5 `/legal/privacy`, `/legal/terms` and `/colophon` content, including contact storage/retention and AI conversation handling; verify the owner has reviewed the privacy text

## 11. P11 — Ask

- [ ] 11.1 Spike S1: CopilotKit runtime adapter on a Vercel Node function + Anthropic tool-calling with the v2 client; verify an end-to-end tool call streams to a test page, and record the outcome in design.md
- [ ] 11.2 Runtime + agent in `apps/api` with the read-only tools over cached `ai-context.json`, the human-in-the-loop `draft_contact_request`, and the env-configured limits (`AI_RATE_LIMIT_PER_IP_PER_HOUR`, `AI_MAX_OUTPUT_TOKENS`, `AI_DAILY_BUDGET_USD`, `AI_MODEL`); verify tool unit tests, a prompt-injection fixture, and a budget-exhausted response
- [ ] 11.3 Ask front end (AskProvider, entry points, `/ask` page, bottom/right Drawer surfaces, AskTurn, AskActivity with Details, AskResult renderers, grouped AskSources, AskSuggestions, AskComposer with Stop, JumpToLatest); verify component tests against a mocked AG-UI event stream
- [ ] 11.4 Confirmation and failure states (AskConfirm with failed-step notice, send-failure alert via `/contact`, interrupted stream); verify the scenarios from the ask-experience spec
- [ ] 11.5 Accessibility: live announcer (polite/assertive), `aria-busy`, focus return, keyboard-only walkthrough; verify with a screen-reader smoke test and axe
- [ ] 11.6 Wire the command-palette "Ask: …" option and "Ask about this" links with page context; verify the contextual-ask scenario

## 12. P12 — Cross-application verification

- [ ] 12.1 Full Playwright matrix: every route × 9 viewports × light/dark (no overflow, header overlap, touch targets); verify green, with screenshots attached to the PR
- [ ] 12.2 Real-device pass (iOS Safari and Android Chrome, portrait and landscape, including the notch); verify the checklist is recorded in the PR

## 13. P13 — Accessibility, performance, SEO

- [ ] 13.1 axe on every route in both themes; verify zero violations
- [ ] 13.2 Prerender static routes, meta/OG tags, sitemap, robots; verify prerendered HTML contains page content
- [ ] 13.3 Performance budgets (lazy Ask bundle, font preload, image sizes); verify mobile Lighthouse ≥ 90 on Home, Work and an article
- [ ] 13.4 Analytics kept consent-gated through Klaro; verify no analytics requests before consent

## 14. P14 — Cut-over

- [ ] 14.1 Namecheap DNS: `CNAME api.vishal.biyani.xyz → cname.vercel-dns.com` (owner action; existing Pages records untouched), production env values in Vercel, and runtime-config values; verify TLS, health, CORS and a real contact email on production
- [ ] 14.2 Switch the Pages workflow to `apps/web/dist` (keeping CNAME and `404.html`), then run the production smoke test (routes, redirects, sign-in, contact, Ask); verify the checklist passes
- [ ] 14.3 Document and test the rollback (republish `apps/portfolio`); verify the rollback runs on a preview
- [ ] 14.4 After two stable weeks, remove `apps/portfolio`, its workflow and its dependencies; verify the workspace builds and CI is green
