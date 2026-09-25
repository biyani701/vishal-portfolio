import rehypeShiki from '@shikijs/rehype'
import type { Element, Root } from 'hast'
import { toString } from 'hast-util-to-string'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { createCssVariablesTheme, type BuiltinLanguage } from 'shiki'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import type { Heading } from '../../content/schema.ts'

// Build-time Markdown for content/ (design.md A2): GFM, sanitised HTML, heading ids for tables of contents,
// and code highlighted by Shiki. Highlighting uses CSS variables (--code-token-*), which tokens.css maps to the
// Programme code colours, so no colour is baked into the HTML.
const theme = createCssVariablesTheme({ name: 'programme', variablePrefix: '--code-' })
const LANGS: BuiltinLanguage[] = ['bash', 'shell', 'python', 'typescript', 'javascript', 'json', 'sql', 'yaml', 'html', 'css']

export interface RenderedMarkdown {
  html: string
  headings: Heading[]
  words: number
}

function collectHeadings(headings: Heading[]) {
  return () => (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if ((node.tagName === 'h2' || node.tagName === 'h3') && typeof node.properties.id === 'string') {
        headings.push({ id: node.properties.id, text: toString(node), depth: node.tagName === 'h2' ? 2 : 3 })
      }
    })
  }
}

/** Renders trusted-author Markdown to sanitised HTML. Raw HTML in the source is dropped, not passed through. */
export async function renderMarkdown(source: string): Promise<RenderedMarkdown> {
  const headings: Heading[] = []
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    // Sanitise before adding ids and highlighting: both produce markup that the default schema would strip.
    .use(rehypeSanitize, defaultSchema)
    .use(rehypeSlug)
    .use(collectHeadings(headings))
    .use(rehypeShiki, { theme, langs: LANGS, fallbackLanguage: 'text', addLanguageClass: true })
    .use(rehypeStringify)
    .process(source)

  const words = source.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length
  return { html: String(file), headings, words }
}
