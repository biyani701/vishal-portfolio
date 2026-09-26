import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/ui/button.tsx'
import { toast } from '@/ui/toast.tsx'
import { splitCodeBlocks } from './markdown-segments.ts'

// Build-time Markdown on the page (design package §9 "MarkdownContent, CodeBlock"). The HTML is sanitised and
// highlighted by scripts/content/markdown.ts; here each <pre> is lifted out into a CodeBlock with a Copy button,
// and the rest is set in the .markdown reading styles (src/design/markdown.css).

/** A code block on the dark code surface (both themes), with its language and a Copy button that confirms by toast. */
export function CodeBlock({ html, language }: { html: string; language?: string }) {
  const code = useRef<HTMLElement>(null)

  async function copy() {
    try {
      await navigator.clipboard.writeText(code.current?.textContent ?? '')
      toast.add({ title: 'Copied to clipboard' })
    } catch {
      toast.add({ title: "Couldn't copy", description: 'Select the code and copy it instead.', type: 'error' })
    }
  }

  return (
    <figure className="flex min-w-0 flex-col overflow-hidden rounded-md border border-border font-sans">
      <div className="flex items-center justify-between gap-4 bg-code-header py-1 pr-1 pl-4">
        <figcaption className="font-mono text-mono-s text-code-fg uppercase">{language ?? 'Code'}</figcaption>
        <Button
          variant="ghost"
          size="sm"
          onClick={copy}
          aria-label={language ? `Copy ${language} code` : 'Copy code'}
          className="text-code-fg hover:bg-code-bg hover:text-code-fg"
        >
          Copy
        </Button>
      </div>
      {/* Focusable so keyboard users can scroll long lines. */}
      <pre tabIndex={0} className="overflow-x-auto bg-code-bg p-4 font-mono text-label text-code-fg">
        <code ref={code} dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </figure>
  )
}

export function MarkdownContent({ html, className }: { html: string; className?: string }) {
  return (
    <div className={cn('markdown', className)}>
      {splitCodeBlocks(html).map((segment, i) =>
        segment.kind === 'code' ? (
          <CodeBlock key={i} html={segment.html} language={segment.language} />
        ) : (
          <div key={i} className="contents" dangerouslySetInnerHTML={{ __html: segment.html }} />
        ),
      )}
    </div>
  )
}
