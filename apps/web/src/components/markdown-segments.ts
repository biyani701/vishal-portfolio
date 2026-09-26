// Rendered Markdown split into prose and code blocks, so MarkdownContent can render each <pre> as a CodeBlock.

export type MarkdownSegment = { kind: 'html'; html: string } | { kind: 'code'; html: string; language?: string }

const PRE = /(<pre[\s>][\s\S]*?<\/pre>)/
const CODE = /^<pre[^>]*><code([^>]*)>([\s\S]*)<\/code><\/pre>$/

/** Splits rendered Markdown into prose and code blocks, keeping each block's highlighted inner HTML. */
export function splitCodeBlocks(html: string): MarkdownSegment[] {
  return html
    .split(PRE)
    .filter((part) => part.trim())
    .map((part) => {
      const code = CODE.exec(part)
      if (!code) return { kind: 'html', html: part }
      const language = /language-([\w-]+)/.exec(code[1]!)?.[1]
      return { kind: 'code', html: code[2]!.replace(/\n$/, ''), ...(language && language !== 'text' ? { language } : {}) }
    })
}
