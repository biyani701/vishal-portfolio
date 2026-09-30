import { defineConfig, devices } from '@playwright/test'

// Production smoke test (task 14.2; DEPLOY.md). Runs e2e/smoke against a deployed site, not a local build:
//   SMOKE_BASE_URL=https://vishal.biyani.xyz pnpm smoke
// It only reads: it sends no contact message and asks Ask nothing (DEPLOY.md lists those as manual checks).
export default defineConfig({
  testDir: './e2e/smoke',
  forbidOnly: !!process.env.CI,
  // A fresh Pages deploy can take a minute to reach every CDN edge.
  retries: 2,
  reporter: 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: process.env.SMOKE_BASE_URL ?? 'https://vishal.biyani.xyz',
    trace: 'retain-on-failure',
  },
})
