## Why

The current portfolio (CRA 5 + MUI 7) has structural problems that can't be patched:
- width-only responsive logic that breaks compact landscape
- silently broken MUI Grid layouts
- three navigation implementations
- an AI assistant with no knowledge of the site
- deprecated tooling

A complete rewrite and redesign has been decided, and the design is frozen in `design/exploration/11-final-design-package.md`. This change replaces the earlier migration plan (`modernize-react19-stack-and-responsive-layout`, removed) with a **new application** built on the accepted foundation.

## What Changes

**New front end: `apps/web`.** Built alongside the current app; the current app is retired at cut-over.
- Stack: React 19, Vite, React Router, Tailwind CSS v4, shadcn/ui with **Base UI** primitives (UF-1/2/3), Lucide, `motion`, Vitest, ESLint 9, Playwright.
- The **Programme** visual system: tokens, light/dark themes, typography, status language, motion.
- Four mutually exclusive layout modes: compact-landscape, mobile, tablet, desktop.
- The **Programme Line** as a signature component in four forms (lanes, strip, span rows, table).
- A new information architecture: Home, Experience, Work, Writing, Knowledge (domains, glossary, 3-D Secure flow), About, Ask, Contact, Colophon, Legal, plus redirects for every old URL.
- A typed **content layer** (Markdown/TS) that feeds pages, ⌘K search and the AI agent. The in-browser blog editor is removed (D-3).
- **Ask:** CopilotKit v2 headless + AG-UI, following the accepted Ask interaction model (questions as headings, serif answers, activity lines, grouped sources, confirmation cards, live announcements).
- An **application-owned Contact form**. The Tally embed is retired (C-1).

**New backend: `apps/api` on Vercel (D-9, C-2).** This is a **BREAKING backend addition.**
- Hosts the CopilotKit/AG-UI runtime and the portfolio agent (read-only tools over the published content index).
- Exposes `POST /contact` (external URL `https://api.vishal.biyani.xyz/contact`): validates, rate-limits, **stores a copy**, and emails the owner.

**Unchanged:**
- GitHub Pages hosting for the site. Runtime configuration via `runtime-config.js`.

**No sign-in (amended 2026-09-26):** `apps/web` has no authentication, account page or Auth.js callback routes. Old sign-in, account and callback URLs redirect to `/`. `apps/auth-server` is not changed by this change and keeps serving `apps/portfolio` until cut-over. The auth proof of concept continues as a separate project (`vishal-lab`).

**Removed at cut-over:**
- `apps/portfolio` (CRA/MUI app).
- The Tally embed, AOS, Bootstrap, FontAwesome, react-icons, Toolpad, the palette picker, and the debug routes (moved to a dev-only `/_dev`).

## Capabilities

### New Capabilities
- `web-platform`: build, dependency guardrails, browser floor, configuration, CI and deployment of `apps/web`.
- `design-system`: Programme tokens, themes, typography, status language, motion, iconography, portrait rules and primitive ownership.
- `responsive-layout`: the four layout modes, application shell, safe areas, overflow and touch-target guarantees.
- `programme-line`: the career timeline component, its responsive forms, clustering and accessible alternatives.
- `site-navigation`: primary navigation, command palette, footer, theme control, redirects and 404.
- `content-pages`: the content layer and every content route (Home, Experience, Work, Writing, Knowledge, Glossary, 3-D Secure, About, Colophon, Legal).
- `ask-experience`: the AI surfaces, activity/states, sources, confirmation and accessibility behaviour.
- `contact`: the application-owned contact form and its submission behaviour.
- `api-service`: the `apps/api` Vercel service (AG-UI runtime, agent tools, contact endpoint, security limits).

### Modified Capabilities
<!-- None: openspec/specs/ is empty. -->

## Impact

- **Repo:** new `apps/web` and `apps/api`; `apps/portfolio` deleted at cut-over; `pnpm-workspace.yaml` and `turbo.json` updated; `CLAUDE.md`/`AGENTS.md` gain the UI rule block.
- **Infrastructure:**
  - A new Vercel project for `apps/api`, on a proposed subdomain (`api.vishal.biyani.xyz`).
  - A Postgres database for contact messages.
  - A transactional email provider account.
  - An LLM provider key for the agent.
  - GitHub Actions deploys `apps/web` to Pages.
- **Secrets:** production secrets (LLM API key, email provider key, database URL) exist only in the Vercel project environment. Local development may use git-ignored `apps/api/.env`; no secrets are committed or exposed to the web bundle.
- **Privacy:** the privacy policy must describe contact-message storage and retention, and AI conversation handling.
- **Out of scope:** `apps/auth-server` changes, `docs-site`, and new content writing (placeholders ship until supplied).
