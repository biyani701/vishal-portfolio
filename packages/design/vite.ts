import { readdirSync, readFileSync } from 'node:fs'
import { extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'

// Serves this package's fonts at /fonts/ in dev and copies them to dist/fonts/ at build (openspec add-biyani-hub,
// D2), so every app keeps stable, preloadable font URLs (/fonts/<name>.woff2) without a copy in its own public/.

export const FONTS_DIR = fileURLToPath(new URL('./fonts/', import.meta.url))

const TYPES: Record<string, string> = { '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8' }

/** The font files and licence texts this package ships, by file name. */
export const fontFiles = () => readdirSync(FONTS_DIR).filter((name) => extname(name) in TYPES).sort()

export function designAssets(): Plugin {
  return {
    name: 'vishal-design-assets',
    // Client builds and dev only: a server (SSR) bundle never serves fonts.
    apply: (_config, env) => env.command === 'serve' || !env.isSsrBuild,
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const match = /^\/fonts\/([^/?#]+)/.exec(req.url ?? '')
        const name = match?.[1]
        if (!name || !fontFiles().includes(name)) return next()
        res.setHeader('Content-Type', TYPES[extname(name)]!)
        res.end(readFileSync(FONTS_DIR + name))
      })
    },
    generateBundle() {
      for (const name of fontFiles()) {
        this.emitFile({ type: 'asset', fileName: `fonts/${name}`, source: readFileSync(FONTS_DIR + name) })
      }
    },
  }
}
