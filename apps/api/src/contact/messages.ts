import type { Db } from '../db/client.js'
import type { ContactInput } from './schema.js'

// contact_messages (src/db/migrations.ts 0001). Times come from the caller's clock, so tests control them.

export interface StoredMessage extends ContactInput {
  id: string
  createdAt: Date
  emailAttempts: number
}

interface Row {
  id: string
  created_at: Date
  intent: ContactInput['intent']
  source: ContactInput['source']
  name: string
  email: string
  message: string
  email_attempts: number
}

const toMessage = (row: Row): StoredMessage => ({
  id: row.id,
  createdAt: new Date(row.created_at),
  intent: row.intent,
  source: row.source,
  name: row.name,
  email: row.email,
  message: row.message,
  emailAttempts: row.email_attempts,
})

const DAY_MS = 24 * 60 * 60 * 1000

export function contactMessages(db: Db) {
  return {
    async insert(input: ContactInput, now: Date): Promise<StoredMessage> {
      const [row] = await db.query<Row>(
        `insert into contact_messages (intent, source, name, email, message, created_at)
         values ($1, $2, $3, $4, $5, $6) returning *`,
        [input.intent, input.source, input.name, input.email, input.message, now],
      )
      return toMessage(row!)
    },

    /** Messages still waiting for their notification, oldest first. */
    async pending(limit: number): Promise<StoredMessage[]> {
      const rows = await db.query<Row>(
        `select * from contact_messages where status = 'pending_email' order by created_at limit $1`,
        [limit],
      )
      return rows.map(toMessage)
    },

    async markSent(id: string, now: Date): Promise<void> {
      await db.query(
        `update contact_messages
         set status = 'sent', sent_at = $2, last_attempt_at = $2, email_attempts = email_attempts + 1
         where id = $1`,
        [id, now],
      )
    },

    async markFailed(id: string, now: Date): Promise<void> {
      await db.query(
        `update contact_messages set last_attempt_at = $2, email_attempts = email_attempts + 1
         where id = $1 and status = 'pending_email'`,
        [id, now],
      )
    },

    /** Stops retrying messages still undelivered after `hours`, and returns how many were flagged. */
    async flagUndelivered(hours: number, now: Date): Promise<number> {
      const rows = await db.query(
        `update contact_messages set status = 'flagged'
         where status = 'pending_email' and created_at < $1 returning id`,
        [new Date(now.getTime() - hours * 60 * 60 * 1000)],
      )
      return rows.length
    },

    /** Deletes every message older than the retention period, whatever its status. */
    async purge(retentionDays: number, now: Date): Promise<number> {
      const rows = await db.query(`delete from contact_messages where created_at < $1 returning id`, [
        new Date(now.getTime() - retentionDays * DAY_MS),
      ])
      return rows.length
    },
  }
}

export type ContactMessages = ReturnType<typeof contactMessages>
