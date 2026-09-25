import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authSettings, fetchSession, signOutUrl, type Session } from './client.ts'
import { AuthContext, type AuthStatus } from './context.ts'

async function loadSession(signal?: AbortSignal) {
  const settings = authSettings()
  return 'error' in settings ? null : fetchSession(settings, signal)
}

/** Reads the Auth.js session once on load; pages render straight away and never wait for it. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  const apply = useCallback((next: Session | null) => {
    setSession(next)
    setStatus(next ? 'signed-in' : 'signed-out')
    return next
  }, [])

  const refresh = useCallback(() => loadSession().then(apply), [apply])

  useEffect(() => {
    const controller = new AbortController()
    void loadSession(controller.signal).then((next) => {
      if (!controller.signal.aborted) apply(next)
    })
    return () => controller.abort()
  }, [apply])

  const signOut = useCallback(() => {
    const settings = authSettings()
    setSession(null)
    setStatus('signed-out')
    if ('error' in settings) location.assign('/')
    else location.assign(signOutUrl(settings))
  }, [])

  const value = useMemo(() => ({ status, session, refresh, signOut }), [status, session, refresh, signOut])
  return <AuthContext value={value}>{children}</AuthContext>
}
