import { Fragment, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { blocks, wordCount } from './answer-blocks.ts'
import { segments, type NumberedSource } from './model.ts'

// The answer as serif prose (specs/ask-experience "Answer structure"): paragraphs, "###" sub-headings and lists
// from the model's Markdown, and superscript citation numbers. Built as React elements, never as HTML, so
// nothing the model writes can inject markup. Answers over ~150 words open with their summary at lede size.

export interface CitationHandlers {
  /** Called with a source's number while its citation is hovered or focused (the rail highlights it). */
  onHighlight?: (n: number | undefined) => void
  /** The element id prefix of this turn's source entries. */
  sourceId: (n: number) => string
}

/** **bold** and *italic*, the only inline Markdown answers use. */
function emphasis(text: string, key: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={`${key}-${i}`} className="font-semibold text-ink">
        {part.slice(2, -2)}
      </strong>
    ) : part.startsWith('*') && part.endsWith('*') && part.length > 2 ? (
      <em key={`${key}-${i}`}>{part.slice(1, -1)}</em>
    ) : (
      <Fragment key={`${key}-${i}`}>{part}</Fragment>
    ),
  )
}

function Inline({ text, sources, handlers }: { text: string; sources: readonly NumberedSource[]; handlers: CitationHandlers }) {
  return (
    <>
      {segments(text, sources).map((segment, i) =>
        'cite' in segment ? (
          <sup key={i} className="ml-0.5 font-sans text-mono-s">
            <a
              href={`#${handlers.sourceId(segment.cite)}`}
              aria-label={`Source ${segment.cite}`}
              onMouseEnter={() => handlers.onHighlight?.(segment.cite)}
              onMouseLeave={() => handlers.onHighlight?.(undefined)}
              onFocus={() => handlers.onHighlight?.(segment.cite)}
              onBlur={() => handlers.onHighlight?.(undefined)}
              className="hit-target relative font-semibold text-accent no-underline hover:underline"
            >
              {segment.cite}
            </a>
          </sup>
        ) : (
          <Fragment key={i}>{emphasis(segment.text, String(i))}</Fragment>
        ),
      )}
    </>
  )
}

export function Answer({ text, sources, handlers, className }: { text: string; sources: readonly NumberedSource[]; handlers: CitationHandlers; className?: string }) {
  const parsed = blocks(text)
  const long = wordCount(text) > 150
  return (
    <div className={cn('flex flex-col gap-4 font-serif text-prose text-ink-2', className)}>
      {parsed.map((block, i) => {
        const inline = (value: string) => <Inline text={value} sources={sources} handlers={handlers} />
        switch (block.kind) {
          case 'h3':
            return (
              <h3 key={i} className="mt-2 font-sans text-h3 font-semibold text-ink">
                {inline(block.text)}
              </h3>
            )
          case 'ul':
          case 'ol': {
            const List = block.kind
            return (
              <List key={i} className={cn('flex flex-col gap-2 pl-6', block.kind === 'ul' ? 'list-disc' : 'list-decimal')}>
                {block.items.map((item, j) => (
                  <li key={j}>{inline(item)}</li>
                ))}
              </List>
            )
          }
          default:
            return (
              <p key={i} className={cn(long && i === 0 && 'text-lede text-ink')}>
                {inline(block.text)}
              </p>
            )
        }
      })}
    </div>
  )
}
