import { neon } from '@neondatabase/serverless'

// Postgres access (design.md A6: Neon via the Vercel Marketplace, DATABASE_URL). Neon's HTTP driver suits
// functions: no connection pool to hold open between requests. Tests use PGlite, a real Postgres in-process
// (src/db/testing.ts), behind the same interface.

export interface Statement {
  text: string
  params?: unknown[]
}

export interface Db {
  query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]>
  /** Runs the statements as one transaction: all of them apply, or none do. */
  transaction(statements: Statement[]): Promise<void>
}

export function neonDb(url: string): Db {
  const sql = neon(url)
  return {
    async query<T>(text: string, params: unknown[] = []) {
      return (await sql.query(text, params)) as T[]
    },
    async transaction(statements) {
      await sql.transaction(statements.map(({ text, params = [] }) => sql.query(text, params)))
    },
  }
}
