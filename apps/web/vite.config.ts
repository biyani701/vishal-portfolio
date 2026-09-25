import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { playwright } from '@vitest/browser-playwright'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { envCheck } from './scripts/env-check.ts'

// Pre-bundle everything the browser tests import, so Vite never re-optimises mid-run (which reloads the page
// and loads a second copy of React). Base UI entry points are collected from src/ui.
const uiDir = fileURLToPath(new URL('./src/ui', import.meta.url))
const baseUiEntries = [
  ...new Set(
    readdirSync(uiDir).flatMap((file) =>
      [...readFileSync(`${uiDir}/${file}`, 'utf8').matchAll(/from ['"](@base-ui\/react[^'"]*)['"]/g)].map((m) => m[1]!),
    ),
  ),
]

export default defineConfig({
  plugins: [react(), tailwindcss(), envCheck()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          setupFiles: ['./src/test/setup.ts'],
          include: ['src/**/*.test.{ts,tsx}', 'eslint/**/*.test.ts', 'scripts/**/*.test.ts'],
          exclude: ['src/**/*.contract.test.tsx'],
        },
      },
      {
        // src/ui contract tests (design.md A2, task 2.4) need real layout, focus and pointer events.
        extends: true,
        optimizeDeps: {
          include: [
            'react',
            'react-dom',
            'react-dom/client',
            'react/jsx-dev-runtime',
            'vitest-browser-react',
            'lucide-react',
            'cn/config',
            'class-variance-authority',
            ...baseUiEntries,
          ],
        },
        test: {
          name: 'ui-contract',
          include: ['src/ui/**/*.contract.test.tsx'],
          setupFiles: ['./src/test/browser-setup.ts'],
          browser: {
            enabled: true,
            headless: true,
            screenshotFailures: false,
            instances: [
              { browser: 'chromium', name: 'desktop', viewport: { width: 1280, height: 800 } },
              {
                browser: 'chromium',
                name: 'touch',
                viewport: { width: 390, height: 844 },
                provider: playwright({ contextOptions: { hasTouch: true, isMobile: true } }),
              },
            ],
            provider: playwright(),
          },
        },
      },
    ],
  },
})
