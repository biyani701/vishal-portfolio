import { config } from '@/config/index.ts'

// Contact, shared by the /contact page and Ask's confirmation card (specs/contact "Shared with Ask"): the same
// intents, the same validation rules and wording, and the same endpoint, POST {VITE_API_BASE_URL}/contact
// (apps/api src/contact/schema.ts holds the server's copy of these limits).

export type Intent = 'role' | 'engagement' | 'other'

export const INTENTS: readonly [Intent, string][] = [
  ['role', 'A role'],
  ['engagement', 'A programme or engagement'],
  ['other', 'Something else'],
]

export interface ContactFields {
  intent: Intent | ''
  name: string
  email: string
  message: string
}

export type FieldName = keyof ContactFields
export type FieldErrors = Partial<Record<FieldName, string>>

export const LIMITS = { name: 200, email: 320, message: 5000 } as const

/** The order errors are reported and focused in: the order of the fields on the page. */
export const FIELD_ORDER: readonly FieldName[] = ['intent', 'name', 'email', 'message']

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validate(fields: ContactFields): FieldErrors {
  const errors: FieldErrors = {}
  if (!fields.intent) errors.intent = 'Choose what this is about'
  const name = fields.name.trim()
  if (!name) errors.name = 'Enter your name'
  else if (name.length > LIMITS.name) errors.name = `Keep your name under ${LIMITS.name} characters`
  const email = fields.email.trim()
  if (!email) errors.email = 'Enter an email address so he can reply'
  else if (email.length > LIMITS.email || !EMAIL.test(email)) errors.email = 'Enter a valid email address, like name@example.com'
  const message = fields.message.trim()
  if (!message) errors.message = 'Write a message'
  else if (message.length > LIMITS.message) errors.message = 'Keep the message under 5,000 characters'
  return errors
}

export const firstError = (errors: FieldErrors) => FIELD_ORDER.find((field) => errors[field])

/** The server's field codes (apps/api parseContact), in this page's words. */
const SERVER_CODES: Record<string, Partial<Record<FieldName, string>>> = {
  required: { intent: 'Choose what this is about', name: 'Enter your name', email: 'Enter an email address so he can reply', message: 'Write a message' },
  too_long: { name: `Keep your name under ${LIMITS.name} characters`, email: 'Enter a valid email address, like name@example.com', message: 'Keep the message under 5,000 characters' },
  invalid: { intent: 'Choose what this is about', email: 'Enter a valid email address, like name@example.com' },
}

export type SendResult =
  | { ok: true }
  | { ok: false; kind: 'rate_limited'; retryAfterSeconds?: number }
  | { ok: false; kind: 'invalid'; errors: FieldErrors }
  | { ok: false; kind: 'unavailable' }

export interface SendOptions {
  source: 'page' | 'ask'
  /** The honeypot's value: people never see the field, so only bots fill it. */
  website?: string
  fetch?: typeof globalThis.fetch
  timeoutMs?: number
}

/** POST /contact. Success means the service stored the message (201); nothing else counts as sent. */
export async function sendContact(fields: ContactFields, { source, website = '', fetch: fetcher = globalThis.fetch, timeoutMs = 15_000 }: SendOptions): Promise<SendResult> {
  let res: Response
  try {
    res = await fetcher(`${config.apiBaseUrl}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intent: fields.intent, name: fields.name.trim(), email: fields.email.trim(), message: fields.message.trim(), source, website }),
      signal: AbortSignal.timeout(timeoutMs),
    })
  } catch {
    return { ok: false, kind: 'unavailable' }
  }
  if (res.status === 201) return { ok: true }
  const body = (await res.json().catch(() => ({}))) as { error?: string; retryAfterSeconds?: number; fields?: Record<string, string> }
  if (res.status === 429) return { ok: false, kind: 'rate_limited', retryAfterSeconds: body.retryAfterSeconds ?? (Number(res.headers.get('Retry-After')) || undefined) }
  if (res.status === 400 && body.fields) {
    const errors: FieldErrors = {}
    for (const [field, code] of Object.entries(body.fields)) {
      if ((FIELD_ORDER as readonly string[]).includes(field)) errors[field as FieldName] = SERVER_CODES[code]?.[field as FieldName] ?? 'Check this field'
    }
    if (Object.keys(errors).length) return { ok: false, kind: 'invalid', errors }
  }
  return { ok: false, kind: 'unavailable' }
}

/** "about 20 minutes", for the rate-limit message. */
export function waitText(seconds: number | undefined): string {
  if (!seconds) return 'a little while'
  const minutes = Math.max(1, Math.ceil(seconds / 60))
  return minutes >= 60 ? `about ${Math.ceil(minutes / 60)} ${minutes >= 120 ? 'hours' : 'hour'}` : `about ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`
}
