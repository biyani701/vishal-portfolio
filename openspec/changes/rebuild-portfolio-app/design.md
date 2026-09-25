## Context

- **Motivation and scope:** see proposal.md.
- **Design:** frozen in `design/exploration/11-final-design-package.md` (tokens §4, status §5, Programme Line §6, responsive §7, Ask §8, ownership §9, decisions §13). This document covers **how to build it**.
- **Current state:**
  - `apps/portfolio` (CRA 5, MUI 7) is served from GitHub Pages at `vishal.biyani.xyz`, with the `404.html` deep-link trick and `runtime-config.js`.
  - `apps/auth-server` (Next 15, Auth.js, Prisma) runs on Vercel.
  - The monorepo uses pnpm workspaces + Turborepo.
  - CI (`deploy-portfolio.yml`) builds with npm on Node 20.10.
- **Fixed decisions:** UF-1…UF-3, DD-1…DD-4, D-1…D-9, C-1, C-2.

## Goals / Non-Goals

**Goals:**
- Build `apps/web` alongside the current app, and cut over only when the whole site passes its gates.
- Keep auth working without touching `apps/auth-server`.
- Every phase is independently buildable, reviewable, and ends with green gates.

**Non-Goals:**
- SSR frameworks.
- A CMS.
- Server-side conversation storage.
- Changing Auth.js.
- Writing new content (placeholders ship until supplied).

## System architecture

```
Browser ──► GitHub Pages: apps/web (static SPA, Vite build)
   │            ├─ /search-index.json, /ai-context.json (build artefacts)
   │            └─ runtime-config.js (API + auth URLs)
   ├──────► apps/auth-server (Vercel, unchanged)   Auth.js sessions, OAuth
   └──────► apps/api (Vercel, NEW)  api.vishal.biyani.xyz
                ├─ AG-UI runtime  ──► LLM provider (Anthropic)
                │     └─ tools read https://vishal.biyani.xyz/ai-context.json (cached)
                ├─ POST /contact  ──► Postgres (store) ──► email provider (notify)
                └─ cron: retry undelivered emails; purge past retention
```

Diagram: `design/exploration/diagrams/06-system-architecture.html`.

## Decisions

### A1. New app beside the old one, then cut over
`apps/web` is a fresh Vite + React 19 app. `apps/portfolio` stays deployed until Phase 14.
- **Previews:** `apps/web` also deploys to a Vercel preview project for review. Pages can host only one site per repository.
- **Cut-over:** switch the Pages workflow to publish `apps/web/dist`, then delete `apps/portfolio` in a follow-up PR once stable.
- *Alternative considered:* migrating in place. Rejected, because the UI, IA and stack all change and nothing of the old component tree survives.

### A2. Front-end structure
```
apps/web/
  src/design/      tokens.css (@theme, light/dark, @custom-variant modes), fonts
  src/ui/          shadcn components generated with --base base (only place importing @base-ui/react) + contract tests
  src/components/  ProgrammeLine, StatusChip, ProjectCard, RoleCard, CodeBlock, MarkdownContent, layouts…
  src/features/ask/  CopilotKit v2 headless integration + Ask compositions
  src/layout/      AppShell, PageShell, useLayoutMode, redirects.ts
  src/routes/      thin route modules (React Router, lazy-loaded per section)
  content/         profile.ts, roles.ts, skills.ts, credentials.ts, projects/*.md, writing/*.md, knowledge/**, glossary.ts
  scripts/         build-search-index.ts, build-ai-context.ts
```
- **Routing:** React Router in data mode, with lazy route modules per section, so Ask and CopilotKit load only when Ask opens.
- **Content:** loaded at build time via `import.meta.glob` and validated with zod. Markdown goes through unified/remark/rehype with sanitisation. Code blocks are highlighted by Shiki at build time.

### A3. Styling and components
- Tailwind v4 `@theme` holds the tokens from §4.
- Dark mode comes from a `data-theme` attribute plus `prefers-color-scheme`. An inline script in `index.html` applies the saved or OS theme before first paint.
- Layout modes are `@custom-variant`s; `useLayoutMode` reads the same query strings through `matchMedia`.
- shadcn components are generated with `init --base base`. They are restyled to Programme tokens, and their variants are defined with `cva`.
- Lint guards enforce UF-3: `no-restricted-imports` for forbidden packages, a custom rule against `asChild`, and `tailwindcss/no-arbitrary-value` outside `src/design` and `src/ui`.

### A4. Programme Line implementation
- **Data:** a pure function `buildProgramme(roles, milestones, width)` returns segments (x, width, labelInside), milestone clusters (the 12px rule) and axis ticks. It is unit-tested at 288 / 343 / 358 / 500 / 1100 px.
- **Rendering:** CSS/SVG. The layout mode picks the form; the table alternative renders from the same data.

### A5. Ask integration
- **Front end:** `@copilotkit/react-core/v2/headless`.
  - `useAgent` drives the conversation.
  - `useRenderToolCall` / `useRenderTool` render activity lines and results.
  - `useHumanInTheLoop` renders the confirmation form.
  - `useConfigureSuggestions` supplies follow-ups.
  - `useAgentContext` passes page context.
  - `useThreads` keeps browser-local history.
  - The live region uses `@react-aria/live-announcer`.
- **Runtime (apps/api):** `@copilotkit/runtime` with an Anthropic model.
  - The default model is Claude Sonnet 5, set by environment variable. Haiku 4.5 generates suggestions.
  - Tools are implemented over `ai-context.json`, which is fetched from the site and cached by ETag. The corpus is small (tens of records), so in-memory keyword/BM25 search is enough; no vector database.
- **Spike S1 (Phase 11 entry):** confirm the runtime's supported server adapter for a Vercel Node function, and that its Anthropic adapter supports tool calls and streaming with the v2 client. If an adapter is missing, run the runtime in a Next.js route handler inside `apps/api`. That is an implementation detail and changes no decision.

### A6. apps/api
- A Vercel project using Node functions.
  - **Framework:** Hono, or a Next.js route-handler app if S1 requires it.
  - **Origin:** `api.vishal.biyani.xyz`. CORS is restricted to the site origin.
- **Contact:**
  - The payload is validated with zod, including a honeypot check.
  - Rate limiting is per IP, using Upstash Redis or Vercel KV.
  - Each message is inserted into Postgres (Neon via the Vercel Marketplace; one table, `contact_messages`).
  - The owner is then emailed through Resend. If sending fails, the row stays `pending_email`, and a Vercel Cron job retries every 15 minutes and flags a message after 24 hours.
  - A nightly cron purges messages past the retention period.
- **Limits:** per-IP runtime rate limits, a maximum output token budget per answer, and a daily cost cap (tracked in KV). The service degrades gracefully when limits are reached.
- **Logging:** structured logs contain no bodies, email addresses or conversation text.
- *Alternatives considered:* Postmark instead of Resend (equivalent), and storing messages in Vercel KV instead of Postgres (Postgres is simpler for querying and retention).

### A7. Auth
`AuthProvider` talks to the existing Auth.js endpoints through `runtime-config.js` URLs. Callback routes stay at the same paths. `SignInPanel` and `AccountMenu` are Programme compositions. `apps/auth-server` does not change.

### A8. Deployment and CI
- The pnpm workspace gains `apps/web` and `apps/api`; Turborepo pipelines are `lint`, `typecheck`, `test`, `build`, `e2e`.
- **Web workflow:** Node 22, pnpm, all gates, then a Pages deploy from `main`, keeping the `404.html` step. A preview goes to Vercel on each PR.
- **API:** Vercel Git integration, with production on `main`.
- Production secrets exist only in the Vercel project environment. Local development may use git-ignored `apps/api/.env`; no secrets are committed or exposed to the web bundle.

## Dependency sequence

| Phase | Deliverable | Depends on |
|---|---|---|
| P1 | `apps/web` scaffold, CI, lint guards, Playwright harness | — |
| P2 | Design system: tokens, fonts, themes, `src/ui` via shadcn `--base base`, contract tests, `/_dev/ui` gallery, CLAUDE.md UI rules | P1 |
| P3 | Layout foundation: modes, AppShell/PageShell, header measurement, safe areas, redirects, 404 | P2 |
| P4 | Content layer: schemas, migrate real content, `search-index.json`, `ai-context.json` | P1 |
| P5 | Navigation shell: nav (3 compositions), command palette (search only), footer, theme control, auth integration (sign-in, account, callbacks) | P3, P4 |
| P6 | Home + ProgrammeLine (all forms + table) | P5 |
| P7 | Experience + About | P6 |
| P8 | Work + case studies | P5 |
| P9 | Writing + Knowledge + Glossary + 3-D Secure flow | P5 |
| P10 | `apps/api` scaffold + `/contact` (DB, email, rate limit, cron) + Contact page + legal/privacy/colophon | P1 (API), P5 (page) |
| P11 | Ask: spike S1, runtime + agent tools, Ask UI (all surfaces and states), Ask → contact | P4, P5, P10 |
| P12 | Cross-app verification: Playwright matrix × routes × themes, real devices | P6–P11 |
| P13 | Accessibility, performance and SEO: axe on all routes, prerender of static routes, meta/OG, sitemap, consented analytics | P12 |
| P14 | Cut-over: DNS for `api.`, Pages source switch, smoke tests, rollback runbook; then remove `apps/portfolio` | P13 |

- **Can run in parallel:** P4 alongside P2/P3; P8, P9 and P10 alongside P6/P7.
- **Critical path:** P1 → P2 → P3 → P5 → P6 → P7 → P12 → P13 → P14, with P11 joining before P12.

## Risks / Trade-offs

- **CopilotKit v2 API churn.** Releases are frequent. → Pin the exact version; wrap every hook in `features/ask/`; spike S1 before building the UI; contract tests run against a mocked AG-UI event stream.
- **Base UI is recent.** 1.0 shipped in Dec 2025. → Components live in `src/ui` as owned source; contract tests; quarterly `shadcn diff`.
- **LLM cost or abuse on a public site.** → Rate limits, per-answer caps and a daily budget with graceful degradation; no tools with side effects except the human-in-the-loop contact draft.
- **Contact data is personal data.** → Minimal fields, retention purge, no PII in logs, privacy policy updated in P10.
- **SEO of a client-rendered SPA.** → Prerender static routes in P13; keep content in HTML-first components.
- **Cut-over breaks old links.** → The redirect table is covered by tests that iterate every old route; smoke tests run against production after the switch.

## Migration Plan

1. P1–P13 build on `main` behind the separate `apps/web` directory. The production site is unchanged throughout. Reviews use Vercel previews of `apps/web`.
2. `apps/api` goes live early (P10) on its subdomain; nothing in production calls it until cut-over.
3. **Cut-over (P14):** switch the Pages workflow to `apps/web/dist`, verify, then set runtime-config to the production API.
4. **Rollback:** re-run the previous Pages workflow commit to republish `apps/portfolio`. `apps/api` can stay up, because nothing depends on it after rollback.
5. `apps/portfolio` is deleted in a follow-up PR after two stable weeks.

### A9. Operational configuration (resolved 2026-09-25)
Retention and AI limits are **configuration, not code**. They are read from environment variables in `apps/api`: Vercel project env for preview and production, plus a git-ignored `apps/api/.env` locally. A committed `apps/api/.env.example` documents every key without values. None of these reach the web bundle.

| Variable | Purpose | Default if unset |
|---|---|---|
| `CONTACT_RETENTION_DAYS` | Purge stored contact messages older than this | `365` |
| `AI_DAILY_BUDGET_USD` | Daily LLM spend cap; Ask degrades gracefully when reached | `2` |
| `AI_RATE_LIMIT_PER_IP_PER_HOUR` | Ask requests per IP per hour | `30` |
| `AI_MAX_OUTPUT_TOKENS` | Cap per answer | `1200` |
| `CONTACT_RATE_LIMIT_PER_IP_PER_HOUR` | Contact submissions per IP per hour | `5` |
| `AI_MODEL` / `AI_SUGGESTION_MODEL` | Model IDs | Claude Sonnet 5 / Claude Haiku 4.5 |
| `RESEND_API_KEY` | Email provider key (**secret**) | none (required) |
| `CONTACT_FROM_EMAIL` | Verified sender on the owner's domain (e.g. `contact@biyani.xyz`) | none (required) |
| `CONTACT_TO_EMAIL` | Destination for notifications | none (required) |
| `ANTHROPIC_API_KEY`, `DATABASE_URL`, `KV_*` | Provider credentials (**secrets**) | none (required) |
| `ALLOWED_ORIGINS` | CORS allow-list | production site origin |

The service validates required variables at start-up and fails fast with the variable name. The privacy policy states retention from `CONTACT_RETENTION_DAYS`, so the policy text and the config must be changed together.

### A10. Email and DNS (resolved 2026-09-25)
- **Resend:** the owner has an existing Resend account.
- **Domain:** `biyani.xyz` is registered at Namecheap, which also manages DNS for `vishal.biyani.xyz`.
- **Sending domain:** verify `biyani.xyz` (or a sending subdomain) in Resend, then add Resend's SPF, DKIM and return-path records in Namecheap's DNS. The exact values come from the Resend dashboard at setup time. Optionally add a DMARC record.
- **API subdomain:** add a `CNAME api.vishal.biyani.xyz → cname.vercel-dns.com` record in Namecheap. Vercel issues the TLS certificate.
- These DNS changes are owner actions at Namecheap and are listed as tasks. No DNS change affects the existing `vishal.biyani.xyz` Pages records.

## Open Questions
- **Analytics:** keep it consent-gated through Klaro, as today. Proposed as the default; it doesn't block any phase.
