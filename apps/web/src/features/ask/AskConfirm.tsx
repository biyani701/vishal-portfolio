import { useId, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { Button } from '@/ui/button.tsx'
import { Field, FieldLabel } from '@/ui/field.tsx'
import { Input } from '@/ui/input.tsx'
import { RadioGroup, RadioGroupItem } from '@/ui/radio-group.tsx'
import { Textarea } from '@/ui/textarea.tsx'
import { leftOut } from './copy.ts'
import type { Draft, Intent, Step } from './model.ts'
import type { ContactPayload } from './store.ts'

// The confirmation card for an outward action (specs/ask-experience "Outward actions need confirmation";
// design package §8). The agent only proposes; the visitor sees exactly what will be sent, can edit it, and must
// choose "Send request". If an earlier lookup failed, a notice says what the draft leaves out, and the form stays
// usable. If sending fails, the values stay and an inline alert offers Try again or the contact form; never a toast.

const INTENTS: [Intent, string][] = [
  ['role', 'A role'],
  ['engagement', 'An engagement'],
  ['other', 'Something else'],
]

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function AskConfirm({
  draft,
  failedSteps,
  onSend,
  onDismiss,
}: {
  draft: Draft
  failedSteps: readonly Step[]
  onSend: (payload: ContactPayload) => void
  onDismiss: () => void
}) {
  const id = useId()
  const [intent, setIntent] = useState<Intent>(draft.args.intent)
  const [name, setName] = useState(draft.args.name ?? '')
  const [email, setEmail] = useState(draft.args.email ?? '')
  const [message, setMessage] = useState(draft.args.message)
  const [invalid, setInvalid] = useState<Record<string, boolean>>({})

  if (draft.state === 'dismissed') return <p className="text-body text-muted">Contact request not sent.</p>
  if (draft.state === 'sent') {
    return (
      <p role="status" className="rounded-lg border border-border bg-surface p-4 text-body text-ink">
        Request sent. Vishal will reply to {email || 'you'} by email.
      </p>
    )
  }

  const omitted = [draft.args.omitted, ...new Set(failedSteps.map(leftOut))].filter(Boolean)
  const sending = draft.state === 'sending'
  const contactHref = `/contact?${new URLSearchParams({ intent, message })}`

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const errors = { name: !name.trim(), email: !EMAIL.test(email.trim()), message: !message.trim() }
    setInvalid(errors)
    if (Object.values(errors).some(Boolean)) {
      document.getElementById(`${id}-${Object.entries(errors).find(([, bad]) => bad)![0]}`)?.focus()
      return
    }
    onSend({ intent, name: name.trim(), email: email.trim(), message: message.trim() })
  }

  return (
    <form onSubmit={submit} noValidate aria-labelledby={`${id}-title`} className="flex flex-col gap-4 rounded-lg border border-border-strong bg-surface p-5">
      <div className="flex flex-col gap-1">
        <h3 id={`${id}-title`} className="font-sans text-h3 font-semibold">
          Send a request to Vishal?
        </h3>
        <p className="text-body text-muted">This sends the reason, your name, your email and the note below. Nothing is sent until you choose Send request.</p>
      </div>

      {omitted.length > 0 && (
        <p role="note" className="rounded-md border border-flight-border bg-flight-bg px-3 py-2 text-body text-flight-fg">
          This draft leaves out {omitted.join(' and ')}, because {omitted.length === 1 ? 'that lookup' : 'those lookups'} didn’t complete. Only checked
          details are included.
        </p>
      )}

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-label font-medium text-ink">Reason</legend>
        <RadioGroup value={intent} onValueChange={(value) => setIntent(value as Intent)} className="flex flex-wrap gap-x-5 gap-y-1">
          {INTENTS.map(([value, label]) => (
            <FieldLabel key={value} className="inline-flex min-h-target items-center gap-2 text-body">
              <RadioGroupItem value={value} />
              {label}
            </FieldLabel>
          ))}
        </RadioGroup>
      </fieldset>

      <div className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-2">
        <Field>
          <FieldLabel htmlFor={`${id}-name`}>Your name</FieldLabel>
          <Input id={`${id}-name`} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" aria-invalid={invalid.name || undefined} required />
        </Field>
        <Field>
          <FieldLabel htmlFor={`${id}-email`}>Your email</FieldLabel>
          <Input id={`${id}-email`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" aria-invalid={invalid.email || undefined} required />
        </Field>
      </div>
      <Field>
        <FieldLabel htmlFor={`${id}-message`}>Note</FieldLabel>
        <Textarea id={`${id}-message`} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={5000} aria-invalid={invalid.message || undefined} required />
      </Field>
      {Object.values(invalid).some(Boolean) && <p className="text-body text-error">Add your name, a valid email and a note.</p>}

      {draft.sendFailed && (
        <div role="alert" className="flex flex-col gap-2 rounded-md border border-error-border bg-error-bg px-3 py-2 text-body text-error">
          <p>Couldn’t send your request. Your note is kept. Nothing was sent.</p>
          <p>
            <Link to={contactHref} className="font-semibold underline underline-offset-4">
              Open the contact form instead
            </Link>
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={sending}>
          {sending ? 'Sending…' : draft.sendFailed ? 'Try again' : 'Send request'}
        </Button>
        <Button type="button" variant="ghost" onClick={onDismiss} disabled={sending}>
          Not now
        </Button>
      </div>
    </form>
  )
}
