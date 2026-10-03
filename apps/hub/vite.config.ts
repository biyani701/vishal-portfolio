import tailwindcss from '@tailwindcss/vite'
import { designAssets } from '@vishal/design/vite'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

// www.biyani.xyz (openspec add-biyani-hub). The production build renders the page in scripts/render.ts; in dev this
// plugin renders it on every request, so `pnpm --filter hub dev` shows the real page.
function devRender(): Plugin {
  return {
    name: 'hub-dev-render',
    apply: 'serve',
    transformIndexHtml: {
      order: 'pre',
      async handler(html, ctx) {
        const { render } = (await ctx.server!.ssrLoadModule('/src/entry-server.tsx')) as { render: (year: number) => string }
        return html.replace('<!--hub-->', render(new Date().getFullYear())).replace('%HUB_BUILD%', 'dev')
      },
    },
  }
}

export default defineConfig({
  plugins: [tailwindcss(), designAssets(), devRender()],
  oxc: { jsx: { runtime: 'automatic' } },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}', 'content/**/*.test.ts', 'scripts/**/*.test.ts'],
    setupFiles: ['./src/test-setup.ts'],
  },
})
