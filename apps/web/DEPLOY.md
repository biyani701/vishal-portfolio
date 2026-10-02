# Deploying apps/web (cut-over, smoke test, rollback)

Tasks 14.1–14.3 of `openspec/changes/rebuild-portfolio-app`. The site is a static build (`pnpm --filter web build` →
`apps/web/dist`) served by GitHub Pages at `https://vishal.biyani.xyz`. It calls `apps/api` at
`https://api.vishal.biyani.xyz` (Vercel).

## State at cut-over (checked 2026-09-30)

- `api.vishal.biyani.xyz`: CNAME to Vercel, TLS valid, `GET /health` → `{"status":"ok"}`, CORS preflight allows
  `https://vishal.biyani.xyz` and refuses other origins with 403.
- `vishal.biyani.xyz`: **no DNS record**, GitHub Pages **not enabled** on `biyani701/vishal-portfolio`, and no
  `gh-pages` branch. The old `deploy-portfolio.yml` last ran on 2026-09-25 and failed (CRA treats lint warnings as
  errors under `CI=true`). `apps/portfolio` was not live, so the cut-over is a first publish of `apps/web`, and
  rolling back to `apps/portfolio` isn't an option (see [Rollback](#rollback)).

## Cut-over

Owner actions are marked **(owner)**.

1. **(owner)** GitHub → repo Settings → Pages → Source: **GitHub Actions**. Custom domain: `vishal.biyani.xyz`.
   Tick *Enforce HTTPS* once the certificate is issued (can take up to an hour after DNS resolves).
2. **(owner)** Namecheap → `biyani.xyz` → Advanced DNS: add `CNAME vishal → biyani701.github.io.`. Leave the
   `api` record alone.
3. **(owner)** Merge the cut-over PR. Every push to `main` touching `apps/web` then runs the gates, deploys the
   tested `dist/` and runs the smoke test ([Deploy workflow](#deploy-workflow)).
4. `apps/api` Vercel env (production): `ALLOWED_ORIGINS` unset (it defaults to `https://vishal.biyani.xyz`),
   `CONTACT_RETENTION_DAYS=365` and `AI_BASE_URL` unset or `https://integrate.api.nvidia.com/v1`
   (`/legal/privacy` states both). Remove any `AI_CONTEXT_URL` override (bead 11.9): the default
   `https://vishal.biyani.xyz/ai-context.json` exists from now on.
5. `runtime-config.js` stays `window.runtimeConfig = {}`. The build already points at the production API
   (`VITE_API_BASE_URL`), so it only needs changing to repoint a live site without a rebuild.

## Smoke test

Automated (read-only), after every deploy and on demand:

```bash
cd apps/web
SMOKE_BASE_URL=https://vishal.biyani.xyz pnpm smoke
```

`e2e/smoke/production.spec.ts` checks every page (200, 404 for an unknown path) and that it renders, the sitemap,
robots, `ai-context.json`, the search index and `runtime-config.js`, one legacy redirect of each kind, that the
contact form is ready, that the API is healthy, and that the page can call the API across origins (CORS).

Manual, once at cut-over (these send real mail or spend the AI budget):

- [ ] Send a message on `/contact`: the confirmation shows and the email arrives at the owner's inbox.
- [ ] Ask one question on `/ask`: an answer streams in and cites a page.
- [ ] Open a deep link cold in a private window (e.g. `/work/fast-jiraql`) and an old link (`/blogs/ai-agents`).
- [ ] `https://vishal.biyani.xyz` shows a valid certificate and `http://` redirects to `https://`.

## Rollback

Pages keeps serving the last successful deploy, so a failed gate or deploy never takes the site down.

To go back to an earlier good version:

1. Actions → *Web CI* → the last good run on `main` → **Re-run all jobs** (or
   `gh run rerun <run-id>`). A re-run builds and deploys that run's commit.
2. Then revert the bad commit on `main`, or the next push will deploy it again.

Tested 2026-10-02 (task 14.3): re-running Web CI run 36971368984 (`1b10239`) deployed that commit to Pages in
13 minutes with the smoke test green; re-running the latest run 36978402734 restored `2022cf9` the same way. Check
which commit is live with
`gh api "repos/biyani701/vishal-portfolio/deployments?environment=github-pages&per_page=1" -q '.[0].sha'`.

To take the site offline instead: Settings → Pages → *Unpublish site* (the API is unaffected).

### API (Vercel)

The site and the API roll back independently. To put an earlier `apps/api` production deployment back:

```bash
vercel ls portfolio-api --prod                  # pick the last good Ready deployment
vercel rollback <deployment-url> --yes          # it serves api.vishal.biyani.xyz within seconds
curl https://api.vishal.biyani.xyz/health       # "version" is the commit now serving
```

Run these where the project is linked (`vercel link --project portfolio-api`). A rolled-back deployment keeps the
environment values it was built with, so an older one can send contact mail to an older `CONTACT_TO_EMAIL`. After a
rollback, Vercel stops assigning new production builds to the domain until you run
`vercel promote <deployment-url>` (or *Undo rollback* in the dashboard) once the fix is deployed.

`apps/portfolio` was never live, and it was removed in 14.4, so "republish `apps/portfolio`" from the original plan
does not apply.

## Deploy workflow

`.github/workflows/web-ci.yml` on a push to `main` that touches `apps/web`:

1. `checks`: lint, typecheck, unit/contract tests, build, the Playwright matrix; uploads the tested `dist/` as the
   Pages artifact (kept 90 days for rollback re-runs).
2. `deploy`: `actions/deploy-pages` to the `github-pages` environment. Runs on `main` queue rather than cancel, so a
   deploy is never cut off.
3. `smoke`: `pnpm smoke` against `https://vishal.biyani.xyz`.

`deploy-portfolio.yml` was deleted with `apps/portfolio` in 14.4.
