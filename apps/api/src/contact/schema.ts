import { z } from 'zod'

// POST /contact body (specs/contact "Contact form", "Shared with Ask"; specs/api-service "Contact endpoint").
// Limits stay within the contact_messages checks (src/db/migrations.ts). The web form shows its own copy for
// each field; the API answers with a code per field.

export const INTENTS = ['role', 'engagement', 'other'] as const
export type Intent = (typeof INTENTS)[number]

/** The honeypot: a field the form hides from people, so only bots fill it in. */
export const HONEYPOT_FIELD = 'website'

export const contactSchema = z.object({
  intent: z.enum(INTENTS, { error: 'invalid' }),
  name: z.string({ error: 'required' }).trim().min(1, 'required').max(200, 'too_long'),
  email: z.string({ error: 'required' }).trim().min(1, 'required').max(320, 'too_long').pipe(z.email('invalid')),
  message: z.string({ error: 'required' }).trim().min(1, 'required').max(5000, 'too_long'),
  source: z.enum(['page', 'ask'], { error: 'invalid' }).default('page'),
  [HONEYPOT_FIELD]: z.string().optional(),
})

export type ContactInput = Omit<z.infer<typeof contactSchema>, typeof HONEYPOT_FIELD>

/** Field name → error code, e.g. { email: 'invalid' }. */
export type FieldErrors = Record<string, string>

export function parseContact(body: unknown): { ok: true; input: ContactInput; honeypot: boolean } | { ok: false; fields: FieldErrors } {
  const result = contactSchema.safeParse(body ?? {})
  if (!result.success) {
    const fields: FieldErrors = {}
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? 'body')
      fields[key] ??= issue.message === 'required' || issue.message === 'too_long' || issue.message === 'invalid' ? issue.message : 'invalid'
    }
    return { ok: false, fields }
  }
  const { [HONEYPOT_FIELD]: trap, ...input } = result.data
  return { ok: true, input, honeypot: Boolean(trap?.trim()) }
}
