import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { Logger } from '../log.js'
import { migrate } from './migrate.js'
import { migrations } from './migrations.js'
import { pgliteDb } from './testing.js'

// vishal-portfolio-9cm.10.2: migrations against a real (in-process) Postgres.
const quietLog: Logger = { info: () => {}, warn: () => {}, error: () => {} }

let db: ReturnType<typeof pgliteDb>
beforeEach(() => {
  db = pgliteDb()
})
afterEach(() => db.close())

const insert = (fields: Record<string, unknown>) => {
  const row = { intent: 'role', name: 'Ada', email: 'ada@example.com', message: 'Hello', ...fields }
  const keys = Object.keys(row)
  return db.query<{ id: string; status: string; source: string; email_attempts: number; created_at: Date }>(
    `insert into contact_messages (${keys.join(', ')}) values (${keys.map((_, i) => `$${i + 1}`).join(', ')}) returning *`,
    Object.values(row),
  )
}

describe('migrate', () => {
  it('applies every migration to an empty database, then nothing on the next run', async () => {
    expect(await migrate(db, quietLog)).toEqual(migrations.map((migration) => migration.id))
    expect(await migrate(db, quietLog)).toEqual([])
    const recorded = await db.query<{ id: string }>('select id from schema_migrations order by id')
    expect(recorded.map((row) => row.id)).toEqual(migrations.map((migration) => migration.id))
  })

  it('applies only migrations added since the last run', async () => {
    await migrate(db, quietLog)
    const next = { id: '9999_test_column', statements: ['alter table contact_messages add column test_note text'] }
    expect(await migrate(db, quietLog, [...migrations, next])).toEqual(['9999_test_column'])
  })

  it('rolls back a failing migration completely and does not record it', async () => {
    const broken = { id: '0001_broken', statements: ['create table half_done (id int)', 'select * from missing_table'] }
    await expect(migrate(db, quietLog, [broken])).rejects.toThrow(/missing_table/)
    expect(await db.query("select to_regclass('half_done') as t")).toEqual([{ t: null }])
    expect(await db.query('select id from schema_migrations')).toEqual([])
  })

  it('refuses duplicate or out-of-order ids before touching the database', async () => {
    const one = { id: '0002_b', statements: [] }
    await expect(migrate(db, quietLog, [one, one])).rejects.toThrow(/duplicate/)
    await expect(migrate(db, quietLog, [one, { id: '0001_a', statements: [] }])).rejects.toThrow(/ascending/)
    expect(await db.query("select to_regclass('schema_migrations') as t")).toEqual([{ t: null }])
  })
})

describe('contact_messages', () => {
  beforeEach(() => migrate(db, quietLog))

  it('stores a message as pending_email from the Contact page, with an id and timestamp', async () => {
    const [row] = await insert({})
    expect(row).toMatchObject({ status: 'pending_email', source: 'page', email_attempts: 0 })
    expect(row!.id).toMatch(/^[0-9a-f-]{36}$/)
    expect(row!.created_at).toBeInstanceOf(Date)
  })

  it.each([
    ['an unknown intent', { intent: 'spam' }],
    ['an unknown source', { source: 'api' }],
    ['an unknown status', { status: 'deleted' }],
    ['an empty name', { name: '' }],
    ['an over-long message', { message: 'x'.repeat(5001) }],
    ['a missing email', { email: null }],
  ])('rejects %s', async (_, fields) => {
    await expect(insert(fields)).rejects.toThrow()
  })

  it('has no column for IP addresses or user agents', async () => {
    const columns = await db.query<{ column_name: string }>(
      "select column_name from information_schema.columns where table_name = 'contact_messages'",
    )
    expect(columns.map((column) => column.column_name).sort()).toEqual(
      ['created_at', 'email', 'email_attempts', 'id', 'intent', 'last_attempt_at', 'message', 'name', 'sent_at', 'source', 'status'],
    )
  })
})
