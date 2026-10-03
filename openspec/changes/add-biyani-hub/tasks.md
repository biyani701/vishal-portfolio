## 1. Shared packages

- [x] 1.1 Add `packages/*` to `pnpm-workspace.yaml`, then create `packages/design` (`@vishal/design`): move `tokens.css`, `fonts.css`, the woff2 files and the OFL texts unchanged, and add the `designAssets()` Vite plugin (design D2). Verify `pnpm install` succeeds and the package exports `./tokens.css`, `./fonts.css` and `./vite`
- [x] 1.2 Switch `apps/web` to `@vishal/design`: update `index.css`, register `designAssets()` in `vite.config.ts`, remove `public/fonts`, and repoint `tokens.test.ts` and `ui-classes.test.ts`. Verify that `pnpm --filter web test` passes, that `dist/fonts/` after `pnpm --filter web build` is byte-identical to the package's `fonts/` (new test), and that the fonts e2e spec passes
- [x] 1.3 Create `packages/content-guard` (`@vishal/content-guard`) by moving `guard.ts` unchanged, with its guard tests, and import it from `apps/web/scripts/content`. Verify the web content tests pass and `pnpm --filter web build` still fails on a denylisted term (existing test)
- [x] 1.4 Add `packages/**` to the path filters of `web-ci.yml` and `api-ci.yml`. Verify with `actionlint` (or a YAML parse) and a PR that touches only `packages/`, which triggers both

## 2. Hub app

- [x] 2.1 Scaffold `apps/hub`:
  - `package.json`, `vite.config.ts` with `designAssets()`, `tsconfig`, `eslint.config.js` (mirroring web's base rules, including no arbitrary values)
  - `index.css` importing `@vishal/design`
  - the inline theme script

  Verify that `pnpm --filter hub lint`, `typecheck` and `build` succeed on an empty page
- [x] 2.2 Add `content/sites.ts` with its zod schema: identity, sites with `live`, Labs entries and footer. Fill it with the approved copy from design.md. Verify the schema tests reject a site without a purpose and a Labs entry without a path
- [x] 2.3 Build the page components (Identity, Sites, Labs, Footer) with tokens only, 44px targets and the default focus outline, and render them to static HTML at build time with a build-id meta tag (D1). Verify component tests cover the order, "In progress" with no link, and Labs being secondary, and that the built `dist/index.html` contains every section with no `<script>` except the theme one
- [x] 2.4 Run `checkConfidential` over `content/sites.ts` and the built HTML during the build (D3). Verify that a fixture with a denylisted term fails the build, naming the file and term
- [x] 2.5 Add the consistency test against `apps/web/content/projects/{blog-platform,knowledge-base}.md` (D4). Verify it fails when a flag is flipped in a fixture copy

## 3. End-to-end

- [x] 3.1 Add Playwright for the hub (phone 390×844 and desktop 1440×900, light and dark themes):
  - portfolio link visible in the first screen
  - no horizontal scroll
  - touch targets of at least 44px
  - axe with no violations
  - the page renders with JavaScript disabled
  - each Labs URL on `www.biyani.xyz` returns 200

  Verify that `pnpm --filter hub e2e` passes against `vite preview`

## 4. Publishing

- [x] 4.1 Add `.github/workflows/hub-ci.yml` with the checks, publish and smoke jobs and the path filters (D5). Verify a PR runs only the checks job and publishes nothing
- [ ] 4.2 Owner: generate the ed25519 deploy key, add the public key to `biyani701/biyani701.github.io` with write access, and save the private key as the `HUB_DEPLOY_KEY` secret in this repo. Verify with `gh secret list` (name only) and the repo's deploy-key list
- [x] 4.3 Before the first publish, back up the current `gh-pages` of `biyani701.github.io` locally (`git clone --branch gh-pages`). Verify that the backup folder contains `index.html` and `CNAME`

## 5. Copy sign-off, merge and cut-over

- [ ] 5.1 Owner sign-off on the hub copy and look, after reviewing the built hub (owner asked to see the final product first). Verify approval in conversation and record any changes in `sites.ts`
- [x] 5.2 Run all quality gates for hub and web: lint, typecheck, unit tests, build and e2e. Verify they all pass. Note any suites that can't run locally, with the reason
- [ ] 5.3 Commit on a feature branch, push to GitHub and open a PR. After merge, confirm the publish and smoke jobs pass and that `https://www.biyani.xyz` serves the hub (build-id matches). Verify the PR link, the run link and a `curl` of the build-id
- [ ] 5.4 Replace `main` of `biyani701/biyani701.github.io` with the README pointing to `apps/hub` (D7). Verify that the GitHub repo page shows only the README and that Pages still serves the hub
- [ ] 5.5 Owner: add the apex A and AAAA records for `biyani.xyz` at Namecheap. Verify that `curl -I https://biyani.xyz` redirects to `https://www.biyani.xyz/`
