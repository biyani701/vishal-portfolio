# apps/api: one-time setup

Owner steps for beads `vishal-portfolio-9cm.10.8`. They create the Vercel project for `apps/api`, connect its
database and rate-limit store, enter the secrets, and point `api.vishal.biyani.xyz` at it. Allow about 45 minutes,
most of it waiting for DNS.

When you're done, the checks in [Verify](#6-verify) pass, and tasks 10.1 (preview checks) and 10.2 (migrations on
a preview database) can be finished.

**You'll need:** admin access to the Vercel team `vishals-projects-d59fa5fe` (the same team as the apps/web
previews), your Resend and NVIDIA (build.nvidia.com) accounts, and Namecheap access to `biyani.xyz`.

**Order matters:** the service refuses to start until every required variable is set (it names any that are
missing). So the first deployment in step 1 is expected to fail; it goes green after step 4.

---

## 1. Create the Vercel project

1. Go to [vercel.com/new](https://vercel.com/new) and choose the team **vishals-projects-d59fa5fe**.
2. Import the GitHub repository **biyani701/vishal-portfolio**.
3. **Project name:** `portfolio-api`.
   - Don't use a name starting with `vishal-portfolio-`. Its preview URLs would then match the apps/web preview
     pattern used for CORS in step 4.
4. **Root Directory:** click *Edit* and choose `apps/api`.
5. **Framework Preset:** Vercel should detect **Hono**. If it shows *Other*, choose Hono.
6. Leave **Build and Output Settings** at their defaults. The `build` script type-checks, and Vercel bundles
   `src/index.ts` itself.
7. Don't add environment variables yet. Click **Deploy**.
   - The build succeeds, but requests fail with a `ConfigError` listing the missing variables. That's expected.

Then, in the new project:

8. **Settings → General → Node.js Version:** confirm **24.x** (it's taken from `engines` in
   `apps/api/package.json`).
9. **Settings → Functions → Function Region:** pick one region and remember it, because the database should be
   in the same place.
   - Suggested: **Mumbai, India (bom1)**, next to you and most likely visitors.
   - Any region works. Keeping the function and the database together matters more than which one you pick.
10. **Settings → Git:**
    - **Production Branch:** `main`.
    - Turn on **Skip deployments when there are no changes to the root directory or its dependencies**, so that
      apps/web-only commits don't rebuild the API.

> **Deployment Protection.** New projects protect preview URLs with Vercel Authentication (Settings →
> Deployment Protection). Leave it on. It means a plain `curl` to a preview URL gets a Vercel login page (401).
> The [Verify](#6-verify) section shows how to check previews anyway. Production (`api.vishal.biyani.xyz`) is
> not protected by default, which is what the public site needs.

## 2. Connect Neon Postgres (contact messages)

1. In the project, open the **Storage** tab → **Create Database** → **Neon** (Serverless Postgres) → **Continue**.
2. Accept the Neon terms if asked. A free plan is enough (one small table).
3. **Region:** choose the Neon region closest to the function region from step 1.9.
   - For bom1, pick Mumbai if it's in the list; otherwise the nearest Asia-Pacific region.
4. **Database name:** `portfolio`.
5. **Connect to project:** `portfolio-api`, for **all three environments** (Development, Preview, Production).
6. Leave the **environment variable prefix** empty, so that the main variable is called `DATABASE_URL`.
7. Optional but recommended: in the Neon integration settings, turn on **preview branches**, so each preview
   deployment gets its own copy of the database. Task 10.2 verifies its migration on such a preview database.

Check: **Settings → Environment Variables** now lists `DATABASE_URL` (plus Neon extras such as
`DATABASE_URL_UNPOOLED` and `PGHOST`; those are fine).

## 3. Connect Upstash Redis (rate limits)

This holds the per-IP counters for Contact and Ask, and the daily AI spend. (Vercel KV itself is no longer
offered; the Upstash integration replaces it.)

1. **Storage** tab → **Create Database** → **Upstash** → **Upstash for Redis** → **Continue**.
2. Free plan. **Primary region:** the one nearest the function region from step 1.9. Leave eviction off.
3. Name it `portfolio-ratelimit`.
4. Connect it to `portfolio-api` for **all three environments**, and leave the prefix at its default.

Check: **Settings → Environment Variables** now lists **`KV_REST_API_URL`** and **`KV_REST_API_TOKEN`** (plus
`KV_URL`, `REDIS_URL` and a read-only token, which aren't used).

> If the names differ, for example `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`, don't rename them in
> Vercel. Tell me instead, and I'll make the config accept them.

## 4. Enter the secrets and settings

**Settings → Environment Variables → Add New.** Mark the three keys as **Sensitive** (Vercel then never shows
the value again). For each row, tick the environments shown.

| Key | Value | Production | Preview | Development |
|---|---|:-:|:-:|:-:|
| `RESEND_API_KEY` | A new Resend key (below) | ✓ | ✓ | ✓ |
| `AI_API_KEY` | A new NVIDIA API key (below) | ✓ | ✓ | ✓ |
| `CONTACT_FROM_EMAIL` | `contact@biyani.xyz` (or another address on the domain you verify in Resend, task 10.2b) | ✓ | ✓ | ✓ |
| `CONTACT_TO_EMAIL` | The inbox that should receive contact messages | ✓ | ✓ | ✓ |
| `ALLOWED_ORIGINS` | `https://vishal.biyani.xyz,https://vishal-portfolio-*-vishals-projects-d59fa5fe.vercel.app` | – | ✓ | – |

Notes:

- **`ALLOWED_ORIGINS` is for Preview only.** Production defaults to `https://vishal.biyani.xyz` and ignores
  wildcards even if one is set there. The pattern matches the apps/web preview URLs (for example
  `https://vishal-portfolio-bqn4ree2a-vishals-projects-d59fa5fe.vercel.app`).
- **Limits and retention** (`CONTACT_RETENTION_DAYS`, `AI_DAILY_BUDGET_USD`, …) have defaults (design.md A9).
  Add them only to change a value. `CONTACT_RETENTION_DAYS` must match the privacy policy (task 10.5).

**Resend API key**

1. [resend.com](https://resend.com) → **API Keys** → **Create API Key**.
2. Name: `portfolio-api`. Permission: **Sending access**. Domain: `biyani.xyz` once it's verified; *All domains*
   until then.
3. Copy the key (starts with `re_`) straight into Vercel. Don't paste it anywhere else.

**NVIDIA API key** (the LLM for Ask; task 11 uses it)

1. Sign in at [build.nvidia.com](https://build.nvidia.com) with the NVIDIA account you want to use.
2. Open any model page (for example `meta/llama-3.3-70b-instruct`) → **Get API Key** → **Generate Key**. Keys start with `nvapi-`.
3. Copy it straight into Vercel as `AI_API_KEY`.
4. Check the free tier's current terms and limits on your account page. They cap requests per minute, and free
   access may be meant for evaluation rather than a public site. When the limit is hit, Ask shows that answers are
   unavailable and offers search and Contact (specs/api-service "Cost and abuse limits"); the rest of the site is
   unaffected.

The endpoint (`AI_BASE_URL`, default `https://integrate.api.nvidia.com/v1`) and the models (`AI_MODEL`, default `meta/llama-3.3-70b-instruct`;
`AI_SUGGESTION_MODEL`, default `meta/llama-3.1-8b-instruct`) have defaults, so you don't need to set them. To switch provider
later, set `AI_BASE_URL`, `AI_API_KEY` and the model ids for any OpenAI-compatible API; no code changes.

**Then redeploy:** **Deployments** → the latest deployment → **⋯ → Redeploy**. Environment changes apply only to
new deployments.

## 5. Point `api.vishal.biyani.xyz` at the project

1. **Settings → Domains → Add Domain** → `api.vishal.biyani.xyz` → Production. Vercel then shows the DNS
   record it wants. Use the **CNAME value Vercel displays**. It's either `cname.vercel-dns.com` or a
   project-specific `…vercel-dns-….com` host.
2. In Namecheap: **Domain List** → `biyani.xyz` → **Manage** → **Advanced DNS** → **Add New Record**:

   | Type | Host | Value | TTL |
   |---|---|---|---|
   | CNAME Record | `api.vishal` | the value from Vercel, e.g. `cname.vercel-dns.com.` | Automatic |

   - The host is `api.vishal`, not `api`, because the domain is `biyani.xyz`.
   - **Don't change the existing `vishal` records.** They serve the current site from GitHub Pages.
3. Back in Vercel, the domain turns **Valid Configuration** once DNS propagates (usually minutes, up to an
   hour). Vercel then issues the TLS certificate automatically.

### While you're in Namecheap: the Resend sender domain (task 10.2b)

`CONTACT_FROM_EMAIL` has to be on a domain verified in Resend, or notifications won't send. The address check
itself happens in task 10.3, so this can also wait.

1. Resend → **Domains → Add Domain** → `biyani.xyz` (or a sending subdomain such as `mail.biyani.xyz`, which keeps
   these records apart from anything else on the root). Region: the one nearest you.
2. Resend lists the records to add: an **MX** and a **TXT (SPF)** record on a `send…` host, and a **TXT (DKIM)**
   record on `resend._domainkey…`. Add each one in Namecheap **Advanced DNS** exactly as shown, using only the
   host part before `.biyani.xyz`.
   - Namecheap keeps MX records under **Mail Settings → Custom MX**. Switch that on if the MX row won't save.
3. Optional DMARC: TXT record, host `_dmarc`, value `v=DMARC1; p=none; rua=mailto:<your address>`.
4. Click **Verify** in Resend. The domain shows **Verified** once DNS propagates.

## 6. Verify

**Production** (after step 5):

```bash
curl -i https://api.vishal.biyani.xyz/health
# HTTP/2 200 … {"status":"ok","version":"<commit>"}

curl -i -X POST -H "Origin: https://evil.example" https://api.vishal.biyani.xyz/health
# HTTP/2 403 … {"error":"origin_not_allowed"}

curl -si -H "Origin: https://vishal.biyani.xyz" https://api.vishal.biyani.xyz/health | grep -i access-control-allow-origin
# access-control-allow-origin: https://vishal.biyani.xyz
```

**A preview** (for 10.1). Protected URLs need a login, so use one of these:

- **Browser:** while logged in to Vercel, open `https://<preview-url>/health`. It shows `{"status":"ok",…}`.
- **Vercel CLI:** `npm i -g vercel`, `vercel login`, then `vercel curl https://<preview-url>/health` and
  `vercel curl https://<preview-url>/health -- -X POST -H "Origin: https://evil.example"`, which should return 403.

**Logs:** **Deployments → a deployment → Logs** shows one JSON line per request, like
`{"level":"warn","msg":"request","method":"POST","route":"/*","status":403,"reason":"origin_not_allowed"}`.
If a deployment fails at start-up, the log shows `ConfigError: apps/api configuration: … is required` naming
exactly what's missing.

**Local development (optional):** `vercel link` in `apps/api` (choose `portfolio-api`), then
`vercel env pull .env` to get the Development values into the git-ignored `apps/api/.env`, and
`pnpm --filter api dev`.

## 7. Tell me when it's done

Send me:

- The production URL check result.
- One preview URL, so I can finish the 10.1 preview checks and run the 10.2 migration against its database.
- Whether the Upstash variable names matched (step 3).

You don't need to send any keys. Nothing in this setup should be pasted into chat, commits or issues.
