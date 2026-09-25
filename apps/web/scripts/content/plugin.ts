import { relative, sep } from 'node:path'
import type { Plugin } from 'vite'
import { buildAiContext, buildSearchIndex } from './indexes.ts'
import { CONTENT_DIR, collectionOf, ContentError, loadContent, loadMarkdown } from './load.ts'

const ARTEFACTS = {
  '/search-index.json': buildSearchIndex,
  '/ai-context.json': buildAiContext,
} as const

/**
 * The content layer in the build (design.md A2):
 * - `import … from '/content/…/x.md'` yields `{ meta, html, headings, words }`, validated and rendered here.
 * - The build validates every record first and fails naming the file and field.
 * - search-index.json and ai-context.json are emitted with the bundle, and served live by the dev server.
 */
export function contentPlugin(): Plugin {
  let serving = false

  return {
    name: 'portfolio-content',
    configResolved(config) {
      serving = config.command === 'serve'
    },

    async buildStart() {
      if (serving) return
      try {
        await loadContent()
      } catch (error) {
        this.error(error instanceof ContentError ? error.message : (error as Error))
      }
    },

    async transform(source, id) {
      const path = id.split('?')[0]!
      if (!path.endsWith('.md')) return
      const file = ['content', ...relative(CONTENT_DIR, path).split(sep)].join('/')
      if (file.includes('..') || !collectionOf(file)) return
      try {
        const { meta, html, headings, words } = await loadMarkdown(file, source)
        const json = JSON.stringify
        return {
          code: `export const meta = ${json(meta)};\nexport const html = ${json(html)};\nexport const headings = ${json(headings)};\nexport const words = ${words};\n`,
          map: null,
        }
      } catch (error) {
        this.error(error instanceof ContentError ? error.message : (error as Error))
      }
    },

    async generateBundle() {
      const content = await loadContent()
      for (const [path, build] of Object.entries(ARTEFACTS)) {
        this.emitFile({ type: 'asset', fileName: path.slice(1), source: `${JSON.stringify(build(content))}\n` })
      }
    },

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const build = ARTEFACTS[req.url?.split('?')[0] as keyof typeof ARTEFACTS]
        if (!build) return next()
        try {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(build(await loadContent())))
        } catch (error) {
          next(error)
        }
      })
    },
  }
}
