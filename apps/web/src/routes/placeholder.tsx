import { useMatches } from 'react-router'
import { PageShell } from '@/layout/PageShell.tsx'

export interface PlaceholderHandle {
  title: string
  /** Phase that replaces this placeholder with the real page. */
  phase: string
}

// Stand-in for a section until its phase builds it, so the shell, redirects and the viewport matrix have
// real destinations. The route's handle names the page.
export function Component() {
  const { title, phase } = useMatches().at(-1)!.handle as PlaceholderHandle
  return (
    <PageShell className="flex flex-col gap-3">
      <h1 className="font-sans text-h1 font-semibold">{title}</h1>
      <p className="text-lede text-ink-2">This page arrives in {phase} of the rebuild.</p>
    </PageShell>
  )
}
