## Context

See proposal.md for the motivation. These are the facts the design rests on, checked on 2026-10-03:

- **What `www` serves.** `www.biyani.xyz` is a CNAME to `biyani701.github.io`. The `biyani701/biyani701.github.io` repo publishes Pages from its `gh-pages` branch (legacy build) with custom domain `www.biyani.xyz`. Its `main` branch holds the old React site's source, last changed in April 2025.
- **Project pages.** Every other repo of the account that has Pages and no custom domain is served at `www.biyani.xyz/<repo>/`. On 2026-10-03:
  - These respond with 200: `click-tracker`, `jira-transition-runner`, `shortfall`, `my-next-auth-app`, `portfolio` (the old portfolio).
  - `my-oauth-proxy` returns 404.
- **Apex.** `biyani.xyz` has no A record.
- **Portfolio.** `apps/web` is Vite + React + Tailwind v4. It deploys to Pages through `actions/deploy-pages` in its own repo. Tokens live in `src/design/tokens.css` and fonts in `public/fonts` with stable names. `fonts.css` uses absolute `/fonts/...` URLs, and `index.html` preloads three of them. `tokens.test.ts` and `ui-classes.test.ts` read `tokens.css` by relative path.
- **Workspace.** `pnpm-workspace.yaml` lists only `apps/*`. CI workflows are path-filtered per app.

## Goals / Non-Goals

**Goals:**
- One small, fast, static hub, in the portfolio's visual language, published from the monorepo.
- One source for tokens, fonts and the confidentiality guard.
- No change to the portfolio's look, URLs or tests beyond file paths.

**Non-Goals:**
- No client-side app, search or Ask on the hub.
- No change to the other repos' project pages, beyond listing them.
- Rewriting the history of `biyani701.github.io` (the old commits stay reachable) or of `biyani701/portfolio`. Those are tracked separately with the codename clean-up.
- Building the blog or knowledge base sites.

## Decisions

### D1. Hub stack: React rendered to static HTML at build time
`apps/hub` uses Vite, React 19 and Tailwind v4, matching `apps/web`. A small build step renders the page component with `renderToStaticMarkup` into `index.html`, and no React is shipped to the browser. The only scripts handle the theme. An inline one in `<head>` sets `data-theme` before first paint, from a saved choice or else `prefers-color-scheme`, the same way the portfolio does. A small module adds a light/dark toggle, which is rendered hidden and shown only once the module runs, so the page is complete without JavaScript.

Content is a typed, zod-validated `apps/hub/content/sites.ts`.

*Alternatives:*
- Hand-written HTML: no data validation, and the components can't be tested.
- Reusing `apps/web` with a second entry: it couples the hub to the router, Ask and the API configuration it doesn't need.

### D2. `packages/design`: tokens, fonts and a Vite plugin
`packages/design` (`@vishal/design`) contains:
- `tokens.css`, moved from `apps/web/src/design/tokens.css`, unchanged
- `fonts.css`, moved unchanged, still using `/fonts/...` URLs
- `fonts/`: the woff2 files and the OFL licence texts, moved from `apps/web/public/fonts`
- `vite.ts`: a `designAssets()` Vite plugin that serves `fonts/` at `/fonts/` in dev and copies it to `dist/fonts/` at build

`apps/web/src/design/index.css` imports `@vishal/design/fonts.css` and `@vishal/design/tokens.css` in the same order as today. `tokens.test.ts` and `ui-classes.test.ts` read the package file instead. The `/fonts/` URLs and preloads don't change. `markdown.css` and `modes.ts` stay in `apps/web`, because they are portfolio-specific.

*Alternative:* letting Vite bundle the fonts with hashed names. Rejected, because it breaks the preload links and the fonts e2e tests.

`rebuild-portfolio-app`'s `design-system` spec describes the tokens, not where they're stored, so it needs no edit.

### D3. `packages/content-guard`
`apps/web/scripts/content/guard.ts` moves to `packages/content-guard` (`@vishal/content-guard`) unchanged, with its tests. `apps/web/scripts/content` imports it from there. The hub runs `checkConfidential` over its content and over the rendered `index.html` at build time.

Changing how the guard stores its terms (they are currently readable in source) is a separate change. This one only moves it.

### D4. Status consistency
`apps/hub/content/sites.ts` holds each site's `live` flag. A hub test reads the frontmatter of `apps/web/content/projects/blog-platform.md` and `knowledge-base.md` and fails if the flags differ. This is a test, not a runtime import, so the hub doesn't depend on the portfolio's content loader.

### D5. Publishing with a deploy key
`.github/workflows/hub-ci.yml` runs on changes under these paths:
- `apps/hub/**`
- `packages/**`
- `apps/web/content/projects/{blog-platform,knowledge-base}.md`
- workspace files
- the workflow itself

`web-ci.yml` and `api-ci.yml` add `packages/**` to their path filters.

The workflow has three jobs:
1. **checks:** lint, typecheck, test, build, and Playwright (desktop and phone, both themes, axe).
2. **publish:** only on push to `main`. It runs `peaceiris/actions-gh-pages@v4` with:
   - `deploy_key: ${{ secrets.HUB_DEPLOY_KEY }}`
   - `external_repository: biyani701/biyani701.github.io`
   - `publish_branch: gh-pages`
   - `force_orphan: true`
   - `cname: www.biyani.xyz`

   The build includes `.nojekyll`.
3. **smoke:** fetches `https://www.biyani.xyz` until it serves the published build's marker (a build-id meta tag), then checks each Labs link for 200.

The deploy key is an ed25519 key. Its public half is added to `biyani701.github.io` with write access, and its private half is stored as the `HUB_DEPLOY_KEY` secret here.

*Alternative:* a fine-grained PAT. Rejected, because it is broader and expires.

### D6. Labs list and link health
The Labs entries are data in `sites.ts`. The Playwright suite requests each Labs URL and fails on any status other than 200, so a project whose Pages stop publishing is caught before the hub links to it. `my-oauth-proxy` (404), `portfolio` (the old site) and `shortfall` (a small test-file generator, removed at the owner's request) are not listed.

### D7. Retiring the old source
After the first successful publish, `main` of `biyani701.github.io` is replaced by a commit holding only a README that points to `apps/hub` here. The repo's Pages source stays `gh-pages`. This is done once, by hand, as a task, not by CI.

## Draft copy (for owner sign-off before merge)

### Identity
- **Name:** Vishal Biyani
- **Line:** Technology delivery and programme leadership in financial services.
- **Primary action:** Portfolio → `vishal.biyani.xyz`

### Sites
| Site | Purpose | Status |
|---|---|---|
| Portfolio · `vishal.biyani.xyz` | Programmes I’ve led, the tools built alongside them, and the story behind them. | Live |
| Blog · `blog.biyani.xyz` | Writing on delivery, payments and the tools in between. | In progress |
| Knowledge Base · `kb.biyani.xyz` | A payments and capital-markets knowledge base with a searchable glossary. | In progress |

### Labs
Heading: **Labs**. Intro: "Earlier experiments, kept online as they were."

| Entry | Description |
|---|---|
| Click Tracker API · `/click-tracker/` | Documentation for a small click-tracking API. |
| Jira Transition Runner · `/jira-transition-runner/` | Documentation for a Jira workflow-transition tool. The source is private. |
| Auth.js documentation · `/my-next-auth-app/` | Notes on running Auth.js across several front ends. |

### Footer
"Get in touch through the portfolio" → `https://vishal.biyani.xyz/contact`

## Risks / Trade-offs

- **[Risk]** The publish job wipes `gh-pages` (`force_orphan`). → That branch only ever holds the user site. Project pages are published from their own repos and are unaffected. The smoke test checks the Labs links after every publish.
- **[Risk]** Moving tokens and fonts could change the portfolio. → The portfolio's full unit, contract and e2e suites run in the same PR. A test compares `dist/fonts` byte for byte with the package's files.
- **[Risk]** The deploy key leaks. → It is scoped to a single repo, which holds only built static files. Rotate it by replacing the key and the secret.
- **[Trade-off]** The old site's commits stay reachable in `biyani701.github.io`'s history, and in the history of the `portfolio` repo, which is still public. This change removes them from what the site serves and from `main`, not from history.
- **[Risk]** `www.biyani.xyz/portfolio/` (the old portfolio repo's own Pages) stays online, because this change doesn't touch it. → It isn't listed on the hub. Turning off its Pages is part of the codename clean-up.

## Migration Plan

1. Merge with the `HUB_DEPLOY_KEY` secret in place. CI publishes the hub, and the smoke test confirms it.
2. Replace `main` of `biyani701.github.io` with the README (D7).
3. The owner adds the apex records for `biyani.xyz` at Namecheap: A records 185.199.108.153, .109, .110 and .111, and AAAA records 2606:50c0:8000::153 to 8003::153. GitHub then redirects the apex to `www`.

**Rollback:** re-run the previous successful hub-ci publish job. Or, in an emergency, push the old `gh-pages` content back from a local backup, which is taken as a task before the first publish.
