import { describe, expect, it } from 'vitest'
import { renderMarkdown } from '../../scripts/content/markdown.ts'
import { splitCodeBlocks } from './markdown-segments.ts'

describe('splitCodeBlocks', () => {
  it('lifts highlighted and plain code blocks out of the prose, keeping their language', async () => {
    const { html } = await renderMarkdown('Intro.\n\n```bash\npip install foo\n```\n\nBetween.\n\n```\nplain\n```\n\nEnd.')
    const segments = splitCodeBlocks(html)
    expect(segments.map((s) => s.kind)).toEqual(['html', 'code', 'html', 'code', 'html'])
    expect(segments[1]).toMatchObject({ kind: 'code', language: 'bash' })
    expect(segments[1]!.html).toContain('--code-token-')
    expect(segments[3]).toEqual({ kind: 'code', html: 'plain' })
  })

  it('leaves Markdown without code as one prose segment', async () => {
    const { html } = await renderMarkdown('## Heading\n\nText with `inline` code.')
    expect(splitCodeBlocks(html)).toEqual([{ kind: 'html', html }])
  })
})
