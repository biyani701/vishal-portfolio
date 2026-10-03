## Why

`www.biyani.xyz` currently serves the old React portfolio from `biyani701/biyani701.github.io`. It shows the old positioning next to the new site at `vishal.biyani.xyz`, and its bundle still publishes internal client codenames. The domain has no front door that explains what lives under it: the portfolio, the blog and knowledge base being built, and the older experiments served at `www.biyani.xyz/<repo>`.

The monorepo already holds the design system, tooling, CI and planning workflow, so the hub should be built here and published to the user-site repo, rather than in a second repository that drifts.

## What Changes

- **New `apps/hub`.** A small static site for `www.biyani.xyz`, prerendered to HTML with no client-side app. It has three parts:
  - a short identity line, with the portfolio as the primary link
  - the sites under the domain (portfolio, blog, knowledge base), each with its purpose and a live or in-progress status
  - a quieter "Labs" section linking the older experiments that GitHub Pages serves at `www.biyani.xyz/<repo>`
- **New `packages/design`.** The single source for the Programme design tokens, the self-hosted fonts and their licences, shared by `apps/web` and `apps/hub`. `apps/web` switches to it with no visible change: the font URLs, preloads and token values stay the same.
- **New `packages/content-guard`.** The confidentiality guard moves out of `apps/web/scripts/content`, so both apps run the same check. Behaviour is unchanged.
- **Hub deployment.** A hub CI workflow builds and tests the hub. On `main`, it publishes the build to the `gh-pages` branch of `biyani701/biyani701.github.io` using a deploy key, as a single commit with no history, with `CNAME` set to `www.biyani.xyz`. The other repos' `/<repo>` project pages keep working.
- **BREAKING (public site).** The old portfolio at `www.biyani.xyz` is replaced, and the old source on that repo's `main` branch is replaced by a README that points here.
- **Apex domain (owner action).** `biyani.xyz` gets GitHub Pages A/AAAA records, so it redirects to `www.biyani.xyz`.

## Capabilities

### New Capabilities

- `domain-hub`: What `www.biyani.xyz` presents, where it is published from, how it stays consistent with the portfolio, and the confidentiality rules it shares with the portfolio.
- `shared-design`: The design tokens and fonts as one workspace package, used by every site in the monorepo without changing how the portfolio looks or loads.

### Modified Capabilities

None in `openspec/specs/`, which is empty. The portfolio's behaviour does not change. `rebuild-portfolio-app`'s `design-system` spec still describes the tokens. This change moves where they live, not what they are (see design.md D2).

## Impact

- **New:**
  - `apps/hub/` (Vite, React rendered to static HTML at build time, Tailwind v4, Vitest, Playwright)
  - `packages/design/` and `packages/content-guard/`
  - `.github/workflows/hub-ci.yml`
- **Changed:**
  - `pnpm-workspace.yaml`, which adds `packages/*`
  - `apps/web/src/design/index.css`, and the tests that read `tokens.css` by path
  - `apps/web/public/fonts`, now copied from the package at build time
  - `apps/web/scripts/content`, which imports the guard package
  - `web-ci.yml` and `api-ci.yml` path filters, if they exist, so changes in `packages/` trigger both
- **External:**
  - a deploy key with write access on `biyani701/biyani701.github.io`, and its private key as a repository secret here
  - Namecheap apex records
  - the old site's source on `main` is replaced
