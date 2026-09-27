import { useSearchParams } from 'react-router'
import { ContactForm } from '@/features/contact/ContactForm.tsx'
import { INTENTS, LIMITS, type ContactFields } from '@/features/contact/contact.ts'
import { PageMeta } from '@/layout/PageMeta.tsx'
import { PageShell } from '@/layout/PageShell.tsx'

// /contact (specs/contact; task 10.4): the application-owned form that replaced the Tally embed. No contact
// details are published (owner decision 2026-09-27): every message goes through the form, which stores a copy
// and emails Vishal. ?intent= and ?message= prefill it, e.g. from Ask's "Open the contact form instead".

function prefill(params: URLSearchParams): Partial<ContactFields> {
  const intent = params.get('intent')
  const message = params.get('message')
  return {
    ...(INTENTS.some(([value]) => value === intent) && { intent: intent as ContactFields['intent'] }),
    ...(message && { message: message.slice(0, LIMITS.message) }),
  }
}

export function Component() {
  const [params] = useSearchParams()
  return (
    <PageShell className="flex flex-col gap-8">
      <PageMeta title="Contact" description="Send Vishal Biyani a message about a role, a programme or engagement, or something else." path="/contact" />
      <div className="flex max-w-195 flex-col gap-3">
        <h1 className="font-sans text-h1 font-semibold">Contact</h1>
        <p className="font-serif text-lede text-ink-2">
          Hiring for a role, planning a programme, or something else? Send a message and Vishal will reply by email.
        </p>
      </div>
      <ContactForm initial={prefill(params)} />
    </PageShell>
  )
}
