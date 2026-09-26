# apps/api

The portfolio's backend (design.md A6): Hono on Vercel Node functions (Fluid compute, Node 24), served at
`api.vishal.biyani.xyz`. It exposes only `GET /health` now; `POST /contact` (task 10.3) and the Ask runtime
(task 11.2) follow.

```bash
cp .env.example .env         # then fill in values (git-ignored)
pnpm --filter api dev        # http://localhost:8787
pnpm --filter api test       # Vitest
pnpm --filter api lint
pnpm --filter api typecheck
```

- **CORS:** browser requests are accepted only from `ALLOWED_ORIGINS` (default `https://vishal.biyani.xyz`);
  any other origin gets a 403 before a handler runs. Outside production, `http://localhost:5173` and `:4173` are
  added, and patterns may use `*` within a label (for example `https://web-*-<team>.vercel.app`). Production
  ignores wildcard and plain-`http` entries.
- **Logs:** one JSON line per request (method, route pattern, status, latency, Vercel request id, reason). Bodies,
  query strings, IPs, origins and email addresses are never logged (`src/log.ts`).

## One-time setup (owner)

See [SETUP.md](SETUP.md): the Vercel project (root `apps/api`), Neon and Upstash from the Marketplace, the
secrets, `ALLOWED_ORIGINS` for previews, the `api.vishal.biyani.xyz` CNAME, and how to verify it all.
