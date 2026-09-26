import type { Logger } from '../log.js'
import type { Mailer } from './mailer.js'
import type { ContactMessages, StoredMessage } from './messages.js'

// Store-then-email (specs/api-service "Contact endpoint", "Email provider outage", "Retention"). A message is
// always stored first; its notification is retried until it's sent or flagged. On the Hobby plan Vercel Cron
// runs once a day, so retries happen in the daily job (runDaily) and after every new submission (retryPending).

/** A message still undelivered this long after it arrived is flagged (design.md A6). */
export const FLAG_AFTER_HOURS = 24
const RETRY_BATCH = 20

export interface DailyReport {
  retried: number
  sent: number
  flagged: number
  purged: number
}

export function contactDelivery({ messages, mailer, log, now = () => new Date() }: { messages: ContactMessages; mailer: Mailer; log: Logger; now?: () => Date }) {
  /** One attempt; records the outcome and returns whether it was sent. Never throws for a mail failure. */
  async function deliver(message: StoredMessage): Promise<boolean> {
    try {
      await mailer.notify(message)
    } catch (error) {
      await messages.markFailed(message.id, now())
      log.warn('contact email failed', { id: message.id, attempts: message.emailAttempts + 1, error: error instanceof Error ? error.message : 'unknown' })
      return false
    }
    await messages.markSent(message.id, now())
    log.info('contact email sent', { id: message.id, attempts: message.emailAttempts + 1 })
    return true
  }

  async function retryPending(): Promise<{ retried: number; sent: number }> {
    const pending = await messages.pending(RETRY_BATCH)
    let sent = 0
    for (const message of pending) if (await deliver(message)) sent++
    return { retried: pending.length, sent }
  }

  async function runDaily(retentionDays: number): Promise<DailyReport> {
    // Retry before flagging, so every message gets at least one scheduled retry.
    const { retried, sent } = await retryPending()
    const flagged = await messages.flagUndelivered(FLAG_AFTER_HOURS, now())
    // The owner's attention: flagged messages are in the database but never reached the inbox.
    if (flagged > 0) log.error('contact messages flagged', { flagged, afterHours: FLAG_AFTER_HOURS })
    const purged = await messages.purge(retentionDays, now())
    return { retried, sent, flagged, purged }
  }

  return { deliver, retryPending, runDaily }
}

export type ContactDelivery = ReturnType<typeof contactDelivery>
