# vishal-portfolio

Monorepo for [vishal.biyani.xyz](https://vishal.biyani.xyz): the portfolio site and its API.

## Apps

- `apps/web` — Vite + React site, deployed to **GitHub Pages** (`vishal.biyani.xyz`) by
  `.github/workflows/web-ci.yml`. Runbook: [`apps/web/DEPLOY.md`](apps/web/DEPLOY.md).
- `apps/api` — Hono API (contact form, Ask), deployed to **Vercel** (`api.vishal.biyani.xyz`). Setup:
  [`apps/api/SETUP.md`](apps/api/SETUP.md).
- `apps/hub` — the front door at `www.biyani.xyz`: static HTML listing the sites and Labs under the domain,
  published to the `gh-pages` branch of `biyani701/biyani701.github.io` by `.github/workflows/hub-ci.yml`
  (needs the `HUB_DEPLOY_KEY` secret).

## Packages

- `packages/design` (`@vishal/design`) — the design tokens, self-hosted fonts and the Vite plugin that serves them
  at `/fonts/`, shared by `apps/web` and `apps/hub`.
- `packages/content-guard` (`@vishal/content-guard`) — the confidentiality guard both sites run over their content.

## Development

```
pnpm install
pnpm dev      # runs every app via turbo
```

`pnpm build`, `pnpm lint`, `pnpm typecheck` and `pnpm test` run the same task across the workspace.

## Licence

The source code is open source under the [MIT License](LICENSE). The licence
covers the code only: Vishal Biyani's writing, photographs, name and personal
branding keep their copyright, third-party fonts, logos and images keep their
owners' licences, and the earlier `apps/auth-server` (in the history) has its own licence. The Scope section
of [LICENSE](LICENSE) lists exactly what is excluded.
