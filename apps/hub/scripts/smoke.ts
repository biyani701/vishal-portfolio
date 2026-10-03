import { hub, labUrl } from '../content/sites.ts'

// Production smoke test (specs/domain-hub "Publishing"): wait until https://www.biyani.xyz serves this build (its
// hub-build meta tag), then check that every Labs page still responds.
const base = process.env.SMOKE_BASE_URL ?? 'https://www.biyani.xyz'
const expected = process.env.EXPECTED_BUILD
const deadline = Date.now() + 10 * 60_000

for (;;) {
  const html = await (await fetch(`${base}/`, { headers: { 'Cache-Control': 'no-cache' } })).text()
  const build = /<meta name="hub-build" content="([^"]+)"/.exec(html)?.[1]
  if (!expected || build === expected) {
    console.log(`${base} serves build ${build}`)
    break
  }
  if (Date.now() > deadline) throw new Error(`${base} still serves build ${build}, expected ${expected}`)
  console.log(`waiting: ${base} serves ${build}, expected ${expected}`)
  await new Promise((resolve) => setTimeout(resolve, 15_000))
}

let failed = 0
for (const lab of hub.labs.entries) {
  const res = await fetch(labUrl(lab))
  console.log(`${res.status} ${labUrl(lab)}`)
  if (res.status !== 200) failed++
}
if (failed) throw new Error(`${failed} Labs page(s) did not respond with 200`)
