import { ProgrammeLine } from '@/components/programme/ProgrammeLine.tsx'
import { PageShell } from '@/layout/PageShell.tsx'

// Placeholder hero until P6.3 builds the Home sections; the Programme Line sits under the hero (§6.7).
export function Component() {
  return (
    <PageShell className="flex flex-col gap-section">
      <div>
        <h1 className="font-sans text-h1 font-semibold">Vishal Biyani</h1>
        <p className="text-lede text-ink-2">Portfolio rebuild in progress.</p>
      </div>
      <ProgrammeLine />
    </PageShell>
  )
}
