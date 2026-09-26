import type { StoredMessage } from './messages.js'

// Owner notifications through Resend (design.md A10), sent from the verified biyani.xyz sender. Reply-To is the
// visitor, so replying from the inbox reaches them. Resend's Idempotency-Key is the message id, so a retry that
// races another attempt can't send the same notification twice.

export interface Mailer {
  /** Sends the owner's notification for one stored message; throws if it wasn't accepted. */
  notify(message: StoredMessage): Promise<void>
}

export class MailerError extends Error {
  override name = 'MailerError'
}

const INTENT_LABELS: Record<StoredMessage['intent'], string> = {
  role: 'A role',
  engagement: 'A programme or engagement',
  other: 'Something else',
}

/** One line, so a name can't add lines to the subject. */
const oneLine = (value: string, max: number) => value.replace(/\s+/g, ' ').trim().slice(0, max)

export function notificationEmail(message: StoredMessage) {
  const intent = INTENT_LABELS[message.intent]
  return {
    subject: `Contact: ${intent} (${oneLine(message.name, 80)})`,
    text: [
      `${message.name} <${message.email}> sent a message${message.source === 'ask' ? ' drafted in Ask' : ''}.`,
      `Intent: ${intent}`,
      `Received: ${message.createdAt.toISOString()}`,
      '',
      message.message,
      '',
      '--',
      `Reply to this email to answer them. Message id: ${message.id}`,
    ].join('\n'),
  }
}

export function resendMailer({
  apiKey,
  from,
  to,
  fetch: fetchImpl = fetch,
  timeoutMs = 8000,
}: {
  apiKey: string
  from: string
  to: string
  fetch?: typeof fetch
  timeoutMs?: number
}): Mailer {
  return {
    async notify(message) {
      const { subject, text } = notificationEmail(message)
      let res: Response
      try {
        res = await fetchImpl('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Idempotency-Key': `contact-${message.id}`,
          },
          body: JSON.stringify({ from: `Portfolio contact <${from}>`, to: [to], reply_to: message.email, subject, text }),
          signal: AbortSignal.timeout(timeoutMs),
        })
      } catch (error) {
        throw new MailerError(error instanceof Error && error.name === 'TimeoutError' ? 'timeout' : 'network')
      }
      // The status only: Resend's error body can echo the addresses.
      if (!res.ok) throw new MailerError(`status_${res.status}`)
    },
  }
}
