import { createContext, use } from 'react'
import type { Session } from './client.ts'

export type AuthStatus = 'loading' | 'signed-in' | 'signed-out'

export interface Auth {
  status: AuthStatus
  session: Session | null
  /** Re-reads the session from the auth server (after a callback). */
  refresh: () => Promise<Session | null>
  /** Ends the session on the auth server, which returns the visitor to Home. */
  signOut: () => void
}

export const AuthContext = createContext<Auth | null>(null)

export function useAuth(): Auth {
  const auth = use(AuthContext)
  if (!auth) throw new Error('useAuth must be used inside <AuthProvider>')
  return auth
}
