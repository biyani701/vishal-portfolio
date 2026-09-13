# vishal-portfolio

Monorepo for [vishal.biyani.xyz](https://vishal.biyani.xyz): the portfolio site and
its Auth.js backend.

## Apps

- `apps/portfolio` — Create React App site, deployed to **GitHub Pages**
  (`vishal.biyani.xyz`).
- `apps/auth-server` — Next.js + Auth.js v5 backend, deployed to **Vercel**
  (`my-oauth-proxy.vercel.app`). Handles Google and GitHub sign-in for the
  portfolio (and other registered clients) via `identifyClient(origin)` in
  `auth.config.ts`.

## Contract between the two apps

There's no shared package — the coupling is a contract, not code:

- `apps/portfolio` talks to `apps/auth-server` only through standard Auth.js
  routes: `/api/auth/signin/:provider`, `/api/auth/session`, `/api/auth/signout`.
- `apps/auth-server`'s `identifyClient(origin)` must keep recognizing the
  portfolio's origins (`vishal.biyani.xyz`, `*.github.io`, `localhost:3000`) as
  `ClientId.PORTFOLIO` for CORS/credential selection to work.
- `apps/portfolio`'s `REACT_APP_AUTH_SERVER_URL` must point at wherever
  `apps/auth-server` is actually deployed.

## Development

```
pnpm install
pnpm dev      # runs both apps via turbo
```

## Deployment

- `apps/portfolio` deploys via `.github/workflows/deploy-portfolio.yml` to the
  `gh-pages` branch, triggered only on changes under `apps/portfolio/**`.
- `apps/auth-server` deploys via Vercel, with Root Directory set to
  `apps/auth-server` and an ignored-build-step (`npx turbo-ignore`) so
  portfolio-only pushes don't trigger a rebuild.
