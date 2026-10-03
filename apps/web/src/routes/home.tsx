import { Hero } from '@/components/home/Hero.tsx'
import { AskPrompt, ContactBand, DeliveryTools, ProgrammesLed, ProofLedger } from '@/components/home/Sections.tsx'
import { Reveal } from '@/components/motion/Reveal.tsx'
import { ProgrammeLine } from '@/components/programme/ProgrammeLine.tsx'
import { PageMeta } from '@/layout/PageMeta.tsx'
import { profile } from '@/content/index.ts'
import { PageShell } from '@/layout/PageShell.tsx'

// Home (specs/portfolio-narrative "Home story order"): hero, Programme Line under the hero (§6.7), proof ledger,
// the programmes led, the delivery tools, the Ask question input and the contact band. Leadership first; the tools
// are supporting evidence, and independent projects live on /work.
// Sections below the fold rise in once as they scroll into view (§4.5).
export function Component() {
  return (
    <PageShell className="flex flex-col gap-section">
      <PageMeta description={profile.lede} path="/" />
      <Hero />
      <ProgrammeLine />
      <ProofLedger />
      <Reveal>
        <ProgrammesLed />
      </Reveal>
      <Reveal>
        <DeliveryTools />
      </Reveal>
      <Reveal>
        <AskPrompt />
      </Reveal>
      <Reveal>
        <ContactBand />
      </Reveal>
    </PageShell>
  )
}
