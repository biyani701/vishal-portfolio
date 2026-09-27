import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { Button } from '@/ui/button.tsx'
import { Field, FieldError, FieldLabel } from '@/ui/field.tsx'
import { Input } from '@/ui/input.tsx'
import { RadioGroup, RadioGroupItem } from '@/ui/radio-group.tsx'
import { Textarea } from '@/ui/textarea.tsx'
import { firstError, INTENTS, LIMITS, sendContact, validate, waitText, type ContactFields, type FieldErrors, type FieldName, type SendResult } from './contact.ts'

// The Contact form (specs/contact; design package §9 "IntentPicker"). Intent first, then name, email and message,
// with labels above and errors below. A confirmation replaces the form only once the service has stored the
// message. On failure every value stays and an inline alert (announced assertively, never a toast) offers Try
// again; a rate limit says when to come back. The honeypot is hidden from people and assistive technology.

type Status = { kind: 'editing' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'failed'; result: Exclude<SendResult, { ok: true }> }

export function ContactForm({ initial = {}, send = sendContact }: { initial?: Partial<ContactFields>; send?: typeof sendContact }) {
  const id = useId()
  const [fields, setFields] = useState<ContactFields>({ intent: '', name: '', email: '', message: '', ...initial })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<Status>({ kind: 'editing' })
  const honeypot = useRef<HTMLInputElement>(null)
  const confirmation = useRef<HTMLHeadingElement>(null)
  const fieldId = (field: FieldName) => `${id}-${field}`

  useEffect(() => {
    if (status.kind === 'sent') confirmation.current?.focus()
  }, [status.kind])

  const focus = (field: FieldName) => {
    const target = field === 'intent' ? document.querySelector<HTMLElement>(`#${CSS.escape(fieldId('intent'))} [role="radio"]`) : document.getElementById(fieldId(field))
    target?.focus()
  }

  const set = (field: FieldName, value: string) => {
    setFields((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (status.kind === 'sending') return
    const found = validate(fields)
    setErrors(found)
    const first = firstError(found)
    if (first) {
      focus(first)
      return
    }
    setStatus({ kind: 'sending' })
    const result = await send(fields, { source: 'page', website: honeypot.current?.value ?? '' })
    if (result.ok) setStatus({ kind: 'sent' })
    else if (result.kind === 'invalid') {
      setErrors(result.errors)
      setStatus({ kind: 'editing' })
      const firstServer = firstError(result.errors)
      if (firstServer) focus(firstServer)
    } else setStatus({ kind: 'failed', result })
  }

  if (status.kind === 'sent') {
    return (
      <div role="status" className="flex max-w-195 flex-col gap-3 rounded-lg border border-border bg-surface p-6">
        <h2 ref={confirmation} tabIndex={-1} className="font-sans text-h2 font-semibold">
          Message sent
        </h2>
        <p className="font-serif text-lede text-ink-2">
          It has been received, and Vishal will reply to {fields.email.trim()}. You don’t need to send it again.
        </p>
      </div>
    )
  }

  const sending = status.kind === 'sending'
  const failure = status.kind === 'failed' ? status.result : undefined
  const invalid = (field: FieldName) => (errors[field] ? { 'aria-invalid': true, 'aria-describedby': `${fieldId(field)}-error` } : {})

  return (
    <form onSubmit={submit} noValidate aria-labelledby={`${id}-title`} className="flex max-w-195 flex-col gap-6">
      <h2 id={`${id}-title`} className="sr-only">
        Send a message
      </h2>

      <fieldset className="flex flex-col gap-2" aria-describedby={errors.intent ? `${fieldId('intent')}-error` : undefined}>
        <legend className="mb-2 text-body font-medium text-ink">What is this about?</legend>
        <RadioGroup
          id={fieldId('intent')}
          value={fields.intent}
          onValueChange={(value) => set('intent', String(value))}
          aria-invalid={errors.intent ? true : undefined}
          className="flex flex-col gap-1 tablet:flex-row tablet:flex-wrap tablet:gap-x-6 desktop:flex-row desktop:flex-wrap desktop:gap-x-6"
        >
          {INTENTS.map(([value, label]) => (
            <FieldLabel key={value} className="inline-flex min-h-target items-center gap-2 text-body">
              <RadioGroupItem value={value} />
              {label}
            </FieldLabel>
          ))}
        </RadioGroup>
        {errors.intent && <FieldError id={`${fieldId('intent')}-error`}>{errors.intent}</FieldError>}
      </fieldset>

      <div className="grid gap-6 tablet:grid-cols-2 desktop:grid-cols-2">
        <Field>
          <FieldLabel htmlFor={fieldId('name')}>Your name</FieldLabel>
          <Input id={fieldId('name')} name="name" value={fields.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" maxLength={LIMITS.name} {...invalid('name')} />
          {errors.name && <FieldError id={`${fieldId('name')}-error`}>{errors.name}</FieldError>}
        </Field>
        <Field>
          <FieldLabel htmlFor={fieldId('email')}>Your email</FieldLabel>
          <Input id={fieldId('email')} name="email" type="email" value={fields.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" maxLength={LIMITS.email} {...invalid('email')} />
          {errors.email && <FieldError id={`${fieldId('email')}-error`}>{errors.email}</FieldError>}
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor={fieldId('message')}>Message</FieldLabel>
        <Textarea id={fieldId('message')} name="message" rows={6} value={fields.message} onChange={(e) => set('message', e.target.value)} maxLength={LIMITS.message} className="min-h-40" {...invalid('message')} />
        {errors.message && <FieldError id={`${fieldId('message')}-error`}>{errors.message}</FieldError>}
      </Field>

      {/* Honeypot (specs/contact "Abuse protection"): off-screen and out of the accessibility tree and tab order. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor={`${id}-website`}>Website</label>
        <input ref={honeypot} id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {failure && (
        <div role="alert" className="flex flex-col gap-1 rounded-md border border-error-border bg-error-bg px-4 py-3 text-body text-error">
          {failure.kind === 'rate_limited' ? (
            <p>Too many messages from here recently, so this one wasn’t sent. Try again in {waitText(failure.retryAfterSeconds)}. Your message is kept.</p>
          ) : (
            <p>Couldn’t send your message. Nothing was sent, and everything you wrote is kept.</p>
          )}
        </div>
      )}

      <div>
        <Button type="submit" size="lg" disabled={sending}>
          {sending ? 'Sending…' : failure ? 'Try again' : 'Send message'}
        </Button>
      </div>
    </form>
  )
}
