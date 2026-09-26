import type { ReactNode } from 'react'
import { periodLabel } from '@content/derive.ts'
import type { Credentials } from '@content/schema.ts'
import { credentials as allCredentials } from '@/content/index.ts'
import { cn } from '@/lib/utils'

// Education, certification and recognition as one ledger (design package §9 "CredentialsLedger"), shared by
// Experience and About. The column ids are the targets of the legacy #education and #certifications anchors
// (src/layout/redirects.ts).

const kicker = 'font-mono text-mono-s text-muted uppercase'

function Column({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="flex flex-col gap-3">
      <h3 id={`${id}-heading`} className={kicker}>
        {title}
      </h3>
      <ul className="flex flex-col">{children}</ul>
    </section>
  )
}

function Entry({ title, detail, when }: { title: string; detail?: string; when: string }) {
  return (
    <li className="flex flex-col gap-0.5 border-t border-border py-3">
      <span className="font-mono text-mono-s text-muted tabular-nums">{when}</span>
      <span className="text-body font-semibold text-ink">{title}</span>
      {detail && <span className="text-label text-ink-2">{detail}</span>}
    </li>
  )
}

export function CredentialsLedger({ credentials = allCredentials, className }: { credentials?: Credentials; className?: string }) {
  return (
    <div className={cn('grid gap-8 tablet:grid-cols-3 desktop:grid-cols-3 compact-landscape:grid-cols-3', className)}>
      <Column id="education" title="Education">
        {credentials.education.map((item) => (
          <Entry key={item.id} title={item.degree} detail={item.institution} when={`${item.start} – ${item.end}`} />
        ))}
      </Column>
      <Column id="certifications" title="Certification">
        {credentials.certifications.map((item) => (
          <Entry key={item.id} title={item.title} detail={item.issuer} when={periodLabel(item.date)} />
        ))}
      </Column>
      <Column id="recognition" title="Recognition">
        {credentials.recognition.map((item) => (
          <Entry key={item.id} title={item.title} when={periodLabel(item.date)} />
        ))}
      </Column>
    </div>
  )
}
