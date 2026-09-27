## Context

- **Motivation and scope:** see proposal.md.
- **Design:** frozen in `design/exploration/11-final-design-package.md` (tokens §4, status §5, Programme Line §6, responsive §7, Ask §8, ownership §9, decisions §13). This document covers **how to build it**.
- **Current state:**
  - `apps/portfolio` (CRA 5, MUI 7) is served from GitHub Pages at `vishal.biyani.xyz`, with the `404.html` deep-link trick and `runtime-config.js`.
  - `apps/auth-server` (Next 15, Auth.js, Prisma) runs on Vercel.
  - The monorepo uses pnpm workspaces + Turborepo.
  - CI (`deploy-portfolio.yml`) builds with npm on Node 20.10.
- **Fixed decisions:** UF-1…UF-3, DD-1…DD-4, D-1…D-9, C-1, C-2.
- **Amendment (2026-09-26):** `apps/web` has no sign-in (A7). This overrides the auth rows of the route map in `design/exploration/02-information-architecture.md` and decision D-4.
- **Amendment (2026-09-26):** Writing, Knowledge, the Glossary and the 3-D Secure flow are not built in `apps/web`. They become separately hosted projects (a blog platform and a Neon-backed knowledge base) shown as case studies in Work; P9 now only moves the content out. This overrides the Writing and Knowledge parts of the design package and the route map; the route map is updated with the redirects (task 9.2).

## Goals / Non-Goals

**Goals:**
- Build `apps/web` alongside the current app, and cut over only when the whole site passes its gates.
- Every phase is independently buildable, reviewable, and ends with green gates.

**Non-Goals:**
- SSR frameworks.
- A CMS.
- Server-side conversation storage.
- Sign-in, accounts or any use of `apps/auth-server` from `apps/web`.
- Writing new content (placeholders ship until supplied).

## System architecture

```
Browser ──► GitHub Pages: apps/web (static SPA, Vite build)
   │            ├─ /search-index.json, /ai-context.json (build artefacts)
   │            └─ runtime-config.js (API URL)
   └──────► apps/api (Vercel, NEW)  api.vishal.biyani.xyz
                ├─ AG-UI runtime  ──► LLM provider (NVIDIA API catalog, OpenAI-compatible)
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
  content/         profile.ts, roles.ts, skills.ts, credentials.ts, projects/*.md
  scripts/         build-search-index.ts, build-ai-context.ts
```
- **Routing:** React Router in data mode, with lazy route modules per section, so Ask and CopilotKit load only when Ask opens.
- **Content:** loaded at build time via `import.meta.glob` and validated with zod. Markdown (case studies) goes through unified/remark/rehype with sanitisation. Code blocks are highlighted by Shiki at build time.

### A3. Styling and components
- Tailwind v4 `@theme` holds the tokens from §4.
- Dark mode comes from a `data-theme` attribute plus `prefers-color-scheme`. An inline script in `index.html` applies the saved or OS theme before first paint.
- Layout modes are `@custom-variant`s; `useLayoutMode` reads the same query strings through `matchMedia`.
- shadcn components are generated with `init --base base`. They are restyled to Programme tokens, and their variants are defined with `cva`.
- Lint guards enforce UF-3: `no-restricted-imports` for forbidden packages, a custom rule against `asChild`, and a custom `portfolio/no-arbitrary-tailwind` rule outside `src/design` and `src/ui` (chosen over `eslint-plugin-tailwindcss`, whose `no-arbitrary-value` misses arbitrary properties and the v4 `(--var)` shorthand).

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
- **Runtime (apps/api):** `@copilotkit/runtime` with an OpenAI-compatible chat-completions model.
  - **Provider (amended 2026-09-26, owner decision):** NVIDIA's API catalog (`https://integrate.api.nvidia.com/v1`), chosen for its free,
    rate-limited tier. The endpoint, key and model ids are configuration (`AI_BASE_URL`, `AI_API_KEY`,
    `AI_MODEL`, `AI_SUGGESTION_MODEL`), so moving to another OpenAI-compatible provider needs no code change.
    Replaces the earlier Anthropic choice.
  - **Models are discovered, not configured (amended 2026-09-26, owner request):** the free catalog rotates, so
    `apps/api/src/ai/` lists `{AI_BASE_URL}/models`, ranks chat candidates by generic signals from the id (no model
    names: excludes embedding, safety, vision and similar; prefers instruct models of a suitable size, not
    code-specialised, newer generations first), and probes the first few (`AI_MODEL_PROBE_LIMIT`, default 6). The
    agent model must make a tool call and the suggestion model must answer. The selection is shared through the KV
    store, refreshed daily by Vercel Cron (`GET /cron/ai-models`, bearer `CRON_SECRET`) or when stale
    (`AI_MODEL_REFRESH_HOURS`, default 24), kept as a fallback while the catalog is unreachable, and replaced when a
    model answers 404/410/403/402. `AI_MODEL` / `AI_SUGGESTION_MODEL` pin a model; `AI_MODEL_PREFER` reorders.
  - Provider rate-limit responses (429) degrade the same way as the daily budget: Ask says answers are unavailable
    for now and offers search and Contact. On a free tier `AI_DAILY_BUDGET_USD` rarely binds; it stays for paid
    providers.
  - The privacy policy (task 10.5) names the provider that processes questions.
  - Tools are implemented over `ai-context.json`, which is fetched from the site and cached by ETag. The corpus is small (tens of records), so in-memory keyword/BM25 search is enough; no vector database.
- **Spike S1 (Phase 11 entry):** confirm the runtime's supported server adapter for a Vercel Node function, and that its OpenAI-compatible adapter, pointed at `AI_BASE_URL`, supports tool calls and streaming with the v2 client for the discovered agent model. If discovery's tool probe proves too weak a check, tighten the probe (for example, a streamed tool call) rather than pinning a model. If an adapter is missing, run the runtime in a Next.js route handler inside `apps/api`. That is an implementation detail and changes no decision.
  - **Outcome (2026-09-27, `@copilotkit/runtime` / `@copilotkit/core` 1.74.0, pinned exactly):** no Next.js fallback is needed.
    - **Adapter:** `@copilotkit/runtime/v2/hono` (`createCopilotHonoHandler`) mounts under `/ask` in the existing Hono app, so Ask runs in the same Vercel Node function. Its CORS is set to the site's origin policy, since it otherwise defaults to any origin. The app-wide origin gate still refuses foreign origins first (`src/ai/ask.ts`).
    - **Model:** `BuiltInAgent` takes an AI SDK `LanguageModel`, so the provider is `createOpenAI({ baseURL: AI_BASE_URL }).chat(model)`. `.chat()` matters: the SDK otherwise calls OpenAI's Responses API, which the NVIDIA catalog doesn't serve. The runtime's `agents` option accepts a per-request factory, so each request uses the currently discovered model with no restart.
    - **Verified** (`src/ai/ask.test.ts`): `CopilotKitCore` from `@copilotkit/core`, the client under the React v2 hooks, talked over real HTTP to the mounted runtime. A provider stubbed at its HTTP boundary streamed a tool call in pieces. The client received `TOOL_CALL_START` → several `TOOL_CALL_ARGS` → `TOOL_CALL_END`, then the server-side `TOOL_CALL_RESULT`, then the answer as `TEXT_MESSAGE_CONTENT` deltas. Both provider calls were streamed chat completions on the discovered model, with `max_tokens` = `AI_MAX_OUTPUT_TOKENS`.
    - **Live check:** `src/ai/ask.live.test.ts` runs the same flow against the real catalog when `AI_API_KEY` is set (discovery → tool call → answer). It passed on 2026-09-27 with the discovered `nvidia/nemotron-3.5-lightning-30b-a3b`: it called the tool, the runtime ran it, and the answer streamed in 11 deltas. The run showed four things later tasks must handle:
      - NVIDIA sent the tool's arguments in one chunk, not in pieces.
      - The model opened and closed a text message alongside the tool call. AskActivity/AskTurn (11.3) must tolerate an empty text message before a tool call.
      - About 10.5s passed between the tool result and the first answer token. The UI's activity state (11.3/11.5) has to cover a wait that long.
      - 11 of the 12 discovery probes failed. The selection is cached in KV and refreshed daily, so this costs only the refresh, but it needs a look (vishal-portfolio-9cm.11.8).
  - **Agent (task 11.2, 2026-09-27):**
    - **Tools:** five read-only tools over `ai-context.json` (`src/ai/tools.ts`): `search_site` (in-memory BM25), `list_projects`, `get_project`, `get_experience` and `get_profile`.
      - Each returns `{ notice, result, sources }`. `notice` marks the result as data, `result` is what the UI renders as site components, and `sources` are the citations, grouped by section.
      - The corpus is fetched from `AI_CONTEXT_URL` and revalidated by ETag every 5 minutes. The last good copy is kept if the site is unreachable.
    - **Contact draft:** `draft_contact_request` is a front-end tool (`useHumanInTheLoop`), not a server interrupt. The visitor confirms in the page, and the browser sends the draft through `POST /contact` with `source: "ask"`. No tool on the server sends anything.
    - **Two agents:** `ask` uses the agent model. `ask-suggest` uses the suggestion model, with no tools and at most 300 output tokens, and serves `agent/suggest` only.
    - **Route guard:** a runtime `onBeforeHandler` hook allows only `info`, run/connect/stop for `ask`, and suggest for `ask-suggest`. Threads, memories, transcription and the inspector get 404.
    - **Limits:** runs are limited per IP by `AI_RATE_LIMIT_PER_IP_PER_HOUR`; suggestions get twice that. Requests are also checked against the daily budget, and the body limit is 96 KB.
    - **Budget:** tokens are counted from each call's usage, at `AI_USD_PER_MILLION_TOKENS` (default 0.5; 0 turns the budget off), per UTC day in KV.
    - **Model guard (`src/ai/guard.ts`):** wraps the model, via AI SDK middleware, to:
      - drop reasoning parts;
      - remove BuiltInAgent's always-added `AGUISendState*` tools;
      - count usage against the budget;
      - replace provider errors with codes (`ask_rate_limited`, `ask_unavailable`, `ask_failed`), which reach the page as the AG-UI `RUN_ERROR` message, so no provider text leaks;
      - report a 404/410/403/402 model to discovery for failover.
    - **Refusals before a run:** these are HTTP responses: 429 `ask_rate_limited` with `Retry-After`, and 503 `ask_budget_exhausted`.
    - **Client context:** BuiltInAgent appends client-sent `context` and `state` to its system prompt. A tampered client can therefore steer only its own conversation, within the body limit. Ask sends page context ("Ask about this") this way.
    - **Injection defence:** the prompt says tool output is never an instruction. The fixture test (`src/ai/ask.test.ts`) checks that injected corpus text reaches the model only inside a marked tool result, and that client system messages never reach it.
    - **AI SDK warning:** on each run, the SDK warns about a system message in `messages`. That message is our own `prompt`, which BuiltInAgent sends that way; client system messages are not forwarded. Task 11.2 either silences the warning or confirms it's harmless.
    - **Safe defaults kept:** the client can't override the model or limits (`overridableProperties` unset), and client-sent system and developer messages aren't forwarded. Frontend tools the client declares are passed to the model; `useHumanInTheLoop` depends on that. `draft_contact_request` can instead be a server-declared `interrupt: true` tool, which pauses the run with an AG-UI interrupt. Task 11.2 picks one.
    - **Telemetry:** the runtime sends usage telemetry unless `COPILOTKIT_TELEMETRY_DISABLED` is set, and it reads that flag once at module load. `src/no-telemetry.ts` sets it and is the entry's first import.
    - **Cold start:** importing the runtime takes about 1–1.4s. It loads on the first `/ask` request, so `/health` and `/contact`, which share the function, don't pay for it.
    - **Client in tests:** `CopilotKitCore` connects to a runtime only when `window` exists, so client-level tests run under jsdom.

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
None. The site has nothing to sign in for, so `apps/web` ships no `AuthProvider`, sign-in page, account menu or callback routes, and needs no auth configuration. The legacy URLs `/signin`, `/signin-legacy`, `/signin-toolpad`, `/login`, `/logout`, `/profile`, `/account`, `/auth-callback`, `/auth-callback.html`, `/auth-success`, `/auth-error`, `/callback` and `/api/auth/callback/*` redirect to `/`.
- `apps/auth-server` keeps serving `apps/portfolio` until cut-over. Retiring the portfolio's client registration there happens after P14.4, outside this change.
- *Alternative considered:* keeping sign-in as built in P5. It was dropped (owner decision, 2026-09-26) because it added a required build variable, header and footer states and a round-trip dependency on another service without giving visitors anything. The client and server code are preserved in the separate `vishal-lab` project.

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
| P5 | Navigation shell: nav (3 compositions), command palette (search only), footer, theme control | P3, P4 |
| P6 | Home + ProgrammeLine (all forms + table) | P5 |
| P7 | Experience + About | P6 |
| P8 | Work + case studies | P5 |
| P9 | Move Writing and Knowledge out: preserve the content, remove it from `apps/web`, redirect old URLs to case studies | P6, P8 |
| P10 | `apps/api` scaffold + `/contact` (DB, email, rate limit, cron) + Contact page + legal/privacy/colophon | P1 (API), P5 (page) |
| P11 | Ask: spike S1, runtime + agent tools, Ask UI (all surfaces and states), Ask → contact | P4, P5, P10 |
| P12 | Cross-app verification: Playwright matrix × routes × themes, real devices | P6–P11 |
| P13 | Accessibility, performance and SEO: axe on all routes, prerender of static routes, meta/OG, sitemap, consented analytics | P12 |
| P14 | Cut-over: DNS for `api.`, Pages source switch, smoke tests, rollback runbook; then remove `apps/portfolio` | P13 |

- **Can run in parallel:** P4 alongside P2/P3; P8 and P10 alongside P6/P7.
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
| `AI_BASE_URL` | OpenAI-compatible LLM endpoint | `https://integrate.api.nvidia.com/v1` (NVIDIA API catalog) |
| `AI_MODEL` / `AI_SUGGESTION_MODEL` | Pin a model instead of discovering it | unset (discovered) |
| `AI_MODEL_PREFER` | Patterns discovery tries first, e.g. `*nemotron*` | unset |
| `AI_MODEL_REFRESH_HOURS` / `AI_MODEL_PROBE_LIMIT` | How often discovery re-checks, and how many models it probes per role | `24` / `6` |
| `CRON_SECRET` | Bearer token Vercel Cron sends to `/cron/*` (**secret**) | none (required) |
| `RESEND_API_KEY` | Email provider key (**secret**) | none (required) |
| `CONTACT_FROM_EMAIL` | Verified sender on the owner's domain (e.g. `contact@biyani.xyz`) | none (required) |
| `CONTACT_TO_EMAIL` | Destination for notifications | none (required) |
| `AI_API_KEY`, `DATABASE_URL`, `KV_*` | Provider credentials (**secrets**) | none (required) |
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
