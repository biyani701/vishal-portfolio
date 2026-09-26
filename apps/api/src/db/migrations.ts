// Schema migrations, applied in order by src/db/migrate.ts during each Vercel build (vercel.json), so every
// preview's Neon branch and production migrate before the new code serves requests. Never edit or reorder an
// applied migration: add a new one. Each one's statements run in a single transaction.

export interface Migration {
  /** Sortable and unique, e.g. 0002_add_something. Recorded in schema_migrations once applied. */
  id: string
  statements: string[]
}

export const migrations: Migration[] = [
  {
    // specs/api-service "Contact endpoint" (tasks 10.2, 10.3). Only what's needed to reply: no IP address or
    // user agent is stored. A message is stored before the owner is emailed; if sending fails it stays
    // pending_email and the retry cron picks it up, and it's flagged when retries give up. The purge cron
    // deletes rows older than CONTACT_RETENTION_DAYS by created_at. The length checks are a backstop:
    // POST /contact validation must stay within them.
    id: '0001_contact_messages',
    statements: [
      `create table contact_messages (
        id uuid primary key default gen_random_uuid(),
        created_at timestamptz not null default now(),
        intent text not null check (intent in ('role', 'engagement', 'other')),
        source text not null default 'page' check (source in ('page', 'ask')),
        name text not null check (char_length(name) between 1 and 200),
        email text not null check (char_length(email) between 3 and 320),
        message text not null check (char_length(message) between 1 and 5000),
        status text not null default 'pending_email' check (status in ('pending_email', 'sent', 'flagged')),
        email_attempts integer not null default 0 check (email_attempts >= 0),
        last_attempt_at timestamptz,
        sent_at timestamptz
      )`,
      `create index contact_messages_pending_idx on contact_messages (created_at) where status = 'pending_email'`,
      `create index contact_messages_created_at_idx on contact_messages (created_at)`,
    ],
  },
]
