# vishal-portfolio

Monorepo for [vishal.biyani.xyz](https://vishal.biyani.xyz): the portfolio site, its API and the Auth.js
proof-of-concept backend.

## Apps

- `apps/web` — Vite + React site, deployed to **GitHub Pages** (`vishal.biyani.xyz`) by
  `.github/workflows/web-ci.yml`. Runbook: [`apps/web/DEPLOY.md`](apps/web/DEPLOY.md).
- `apps/api` — Hono API (contact form, Ask), deployed to **Vercel** (`api.vishal.biyani.xyz`). Setup:
  [`apps/api/SETUP.md`](apps/api/SETUP.md).
- `apps/auth-server` — Next.js + Auth.js v5 backend, deployed to **Vercel** (`my-oauth-proxy.vercel.app`). The site
  no longer signs in; its portfolio client registration is retired separately.

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
owners' licences, and `apps/auth-server` has its own licence. The Scope section
of [LICENSE](LICENSE) lists exactly what is excluded.
