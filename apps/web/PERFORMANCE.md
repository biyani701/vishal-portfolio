# apps/web performance record

Measurement record for task 13.3 (openspec `rebuild-portfolio-app`, beads `vishal-portfolio-9cm.13.3`): *mobile
Lighthouse ≥ 90 on Home, Work and a case study.* Closed on 2026-09-27 against the **applied-throttling** results
below, by owner decision. The default-mode (simulated) results are recorded separately as a baseline; they are
not acceptance results.

## Acceptance results: applied (DevTools) throttling

Performance score, two consecutive runs per page.

| Page | URL path | Run 1 | Run 2 | FCP | LCP | TBT | CLS | Speed Index |
|---|---|---|---|---|---|---|---|---|
| Home | `/` | **93** | **97** | 2.1 s / 1.3 s | 2.1 s / 1.3 s | 230 / 190 ms | 0 / 0 | 2.2 s / 1.5 s |
| Work | `/work` | **99** | **99** | 1.3 s / 1.5 s | 1.3 s / 1.5 s | 100 / 110 ms | 0.021 / 0.021 | 1.4 s / 1.6 s |
| Case study | `/work/fast-jiraql` | **99** | **100** | 1.4 s / 1.3 s | 1.4 s / 1.3 s | 110 / 90 ms | 0 / 0 | 1.5 s / 1.3 s |

Metric cells read *run 1 / run 2*. In the same measurement round, Accessibility and Best Practices scored 100 on
all three pages.

## Baseline (reference only): default simulated throttling

Same build, same pages, same session, Lighthouse's default `--throttling-method=simulate` (what PageSpeed Insights
reports).

| Page | Run 1 | Run 2 | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|
| Home | 86 | 82 | 1.7 s / 1.8 s | 4.0 s / 4.7 s | 30 / 50 ms | 0 / 0 |
| Work | 86 | 86 | 1.7 s / 1.7 s | 4.1 s / 4.0 s | 70 / 50 ms | 0 / 0.056 |
| Case study | 87 | 87 | 1.6 s / 1.6 s | 3.9 s / 4.0 s | 10 / 10 ms | 0 / 0 |

Why the two modes differ: the pages are prerendered (`scripts/prerender.mjs`), so their largest element paints
from the HTML before the app's JavaScript runs. Simulated throttling records an unthrottled load and models the
slow network from it, and in that model LCP depends on the app's script chain, giving about 4 s. Under applied
throttling, LCP equals FCP (1.3–2.1 s). The browser's own `largest-contentful-paint` entries agree with applied
throttling: on Home under slow-4G and 4× CPU throttling, LCP was the prerendered hero heading at 580 ms, before the
app started at 1,268 ms. SEO scored 66–69 on the preview only because Vercel sends `X-Robots-Tag: noindex` on
preview deployments; it is not part of this record.

Raising the simulated score to 90 or above (for example by server-rendering and hydrating instead of prerendering
browser snapshots) is out of scope for 13.3. It is tracked as its own work item with its own acceptance criteria
(beads `vishal-portfolio-9cm.13.6`).

## Configuration (for reproducing the acceptance results)

| Setting | Value |
|---|---|
| Build measured | commit `6a10d00` ("perf(web): first render as a transition; mark the app started at commit"), merged to `main` in PR #23 (`1a17173`) |
| Target | that build's Vercel preview deployment (`https://vishal-portfolio-acxssinx3-vishals-projects-d59fa5fe.vercel.app`), served by Vercel's CDN over HTTP/2 with compression |
| When | 2026-09-27, 14:14–14:19 UTC; both runs of all three pages back to back |
| Lighthouse | 12.8.2 (CLI, `npx lighthouse@12.8.2`) |
| Browser | Headless Chromium 153 (`HeadlessChrome/153.0.0.0`), Playwright 1.63.0's build `chromium-1243`, launched with `--headless=new --no-sandbox` |
| Host | Windows 11 Pro, Lighthouse `benchmarkIndex` 2353.5 |
| Form factor | `mobile`; screen emulation 412 × 823, device scale factor 1.75 |
| Throttling method | `devtools` (applied throttling) |
| Throttling profile | Lighthouse's default mobile slow 4G: `rttMs` 150, `throughputKbps` 1638.4, `requestLatencyMs` 562.5, `downloadThroughputKbps` 1474.56, `uploadThroughputKbps` 675, `cpuSlowdownMultiplier` 4 |
| Categories | Performance (run alone for these figures) |
| Cache | Cold: each run is a fresh Lighthouse launch with its own profile |

The baseline used the same settings with `--throttling-method=simulate` and the same throttling profile.

### Command

From `apps/web` (Git Bash), with `BASE` set to the deployment under test:

```bash
CHROME="$(node -e "console.log(require('playwright').chromium.executablePath())")"
for page in / /work /work/fast-jiraql; do
  CHROME_PATH="$CHROME" npx --yes lighthouse@12.8.2 "$BASE$page" \
    --throttling-method=devtools \
    --only-categories=performance \
    --chrome-flags="--headless=new --no-sandbox" \
    --output=json --output-path="lighthouse${page//\//_}.json" --quiet
done
```

For the baseline, run the same loop with `--throttling-method=simulate`. Each report's `configSettings`,
`lighthouseVersion` and `environment` fields record the settings above.

Results vary between runs and machines (the two runs above differ by up to 4 points on Home). Measure against a
deployed build, not `vite preview`: the preview server is HTTP/1.1, and its connection limit distorts the timings.
