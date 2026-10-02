# vishal-portfolio

Monorepo for [vishal.biyani.xyz](https://vishal.biyani.xyz): the portfolio site and its API.

## Apps

- `apps/web` — Vite + React site, deployed to **GitHub Pages** (`vishal.biyani.xyz`) by
  `.github/workflows/web-ci.yml`. Runbook: [`apps/web/DEPLOY.md`](apps/web/DEPLOY.md).
- `apps/api` — Hono API (contact form, Ask), deployed to **Vercel** (`api.vishal.biyani.xyz`). Setup:
  [`apps/api/SETUP.md`](apps/api/SETUP.md).

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
