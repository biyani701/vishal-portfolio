import { defineConfig, devices } from '@playwright/test'
import { viewportName, viewports } from './e2e/viewports.ts'

const port = 4173
const siteWide = /(theme|fonts)\.spec\.ts/

// Runs against the production build (`vite preview`), one project per matrix viewport.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'retain-on-failure',
  },
  projects: [
    ...viewports.map((viewport) => ({
      name: viewportName(viewport),
      testIgnore: siteWide,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: viewport.width, height: viewport.height },
        isMobile: viewport.touch,
        hasTouch: viewport.touch,
      },
    })),
    // Viewport-independent checks (theme, fonts) run once.
    { name: 'site-wide', testMatch: siteWide, use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: `pnpm preview --port ${port} --strictPort`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
  },
})
