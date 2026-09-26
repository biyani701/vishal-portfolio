import { Hero } from '@/components/home/Hero.tsx'
import { AskPrompt, ContactBand, HighlightedProjects, ProofLedger, SelectedWork } from '@/components/home/Sections.tsx'
import { Reveal } from '@/components/motion/Reveal.tsx'
import { ProgrammeLine } from '@/components/programme/ProgrammeLine.tsx'
import { PageShell } from '@/layout/PageShell.tsx'

// Home (specs/content-pages "Home"; task 6.3): hero, Programme Line under the hero (§6.7), proof ledger,
// three selected projects, the Ask question input, writing and knowledge teasers, and the contact band.
// Sections below the fold rise in once as they scroll into view (§4.5).
export function Component() {
  return (
    <PageShell className="flex flex-col gap-section">
      <Hero />
      <ProgrammeLine />
      <ProofLedger />
      <Reveal>
        <SelectedWork />
      </Reveal>
      <Reveal>
        <AskPrompt />
      </Reveal>
      <Reveal>
        <HighlightedProjects />
      </Reveal>
      <Reveal>
        <ContactBand />
      </Reveal>
    </PageShell>
  )
}
