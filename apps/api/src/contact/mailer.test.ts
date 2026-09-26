import { describe, expect, it, vi } from 'vitest'
import { MailerError, notificationEmail, resendMailer } from './mailer.js'
import type { StoredMessage } from './messages.js'

// vishal-portfolio-9cm.10.5: the Resend request, without calling Resend.
const message: StoredMessage = {
  id: '6f1c2a4e-0000-4000-8000-000000000001',
  createdAt: new Date('2026-09-27T09:00:00Z'),
  intent: 'engagement',
  source: 'page',
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'Hello',
  emailAttempts: 0,
}

function setup(response: Response | Error = new Response('{"id":"x"}', { status: 200 })) {
  const fetch = vi.fn(async () => (response instanceof Error ? Promise.reject(response) : response))
  const mailer = resendMailer({ apiKey: 're_test', from: 'contact@biyani.xyz', to: 'owner@example.com', fetch })
  return { fetch, mailer }
}

describe('resendMailer', () => {
  it('sends from the verified sender to the owner, with Reply-To the visitor and the message id as idempotency key', async () => {
    const { fetch, mailer } = setup()
    await mailer.notify(message)
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://api.resend.com/emails')
    expect(init.headers).toMatchObject({ Authorization: 'Bearer re_test', 'Idempotency-Key': `contact-${message.id}` })
    expect(JSON.parse(init.body as string)).toMatchObject({
      from: 'Portfolio contact <contact@biyani.xyz>',
      to: ['owner@example.com'],
      reply_to: 'ada@example.com',
      subject: 'Contact: A programme or engagement (Ada Lovelace)',
    })
  })

  it('throws a MailerError naming only the status when Resend refuses', async () => {
    const { mailer } = setup(new Response('{"message":"ada@example.com is invalid"}', { status: 422 }))
    await expect(mailer.notify(message)).rejects.toThrow(new MailerError('status_422'))
  })

  it('throws a MailerError when the request fails or times out', async () => {
    await expect(setup(new TypeError('fetch failed')).mailer.notify(message)).rejects.toThrow('network')
    await expect(setup(new DOMException('timed out', 'TimeoutError')).mailer.notify(message)).rejects.toThrow('timeout')
  })
})

describe('notificationEmail', () => {
  it('keeps the subject to one line whatever the name contains', () => {
    const { subject } = notificationEmail({ ...message, name: 'Ada\r\nBcc: someone@example.com' })
    expect(subject).not.toMatch(/[\r\n]/)
  })

  it('says when the message was drafted in Ask', () => {
    expect(notificationEmail({ ...message, source: 'ask' }).text).toContain('drafted in Ask')
  })
})
