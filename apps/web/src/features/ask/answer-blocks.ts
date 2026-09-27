// Answer text as blocks (Answer.tsx): paragraphs, "###" sub-headings and lists from the model's Markdown.

export type Block = { kind: 'p'; text: string } | { kind: 'h3'; text: string } | { kind: 'ul' | 'ol'; items: string[] }

export function blocks(text: string): Block[] {
  const out: Block[] = []
  for (const chunk of text.replace(/\r\n/g, '\n').split(/\n{2,}/)) {
    const lines = chunk.split('\n').filter((line) => line.trim())
    if (!lines.length) continue
    let paragraph: string[] = []
    const flush = () => {
      if (paragraph.length) out.push({ kind: 'p', text: paragraph.join(' ') })
      paragraph = []
    }
    for (const line of lines) {
      const heading = /^#{1,6}\s+(.*)$/.exec(line)
      const bullet = /^\s*[-*•]\s+(.*)$/.exec(line)
      const numbered = /^\s*\d+[.)]\s+(.*)$/.exec(line)
      if (heading) {
        flush()
        out.push({ kind: 'h3', text: heading[1]! })
      } else if (bullet || numbered) {
        flush()
        const kind = bullet ? 'ul' : 'ol'
        const item = (bullet ?? numbered)![1]!
        const last = out.at(-1)
        if (last && last.kind === kind) last.items.push(item)
        else out.push({ kind, items: [item] })
      } else paragraph.push(line.trim())
    }
    flush()
  }
  return out
}

export const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length
