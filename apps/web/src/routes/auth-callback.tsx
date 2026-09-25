import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { takeReturnPath } from '@/auth/client.ts'
import { useAuth } from '@/auth/context.ts'
import { PageShell } from '@/layout/PageShell.tsx'

// The auth server's callback paths (/auth-callback, /callback, /auth-success, /api/auth/callback/{github,google})
// all land here: read the session, then return to the page sign-in started from. The session cookie can take
// a moment to be readable cross-site, so a missing session is retried once before giving up.
const RETRY_MS = 1500

export function Component() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { refresh } = useAuth()
  const failed = params.get('error')
  const [error, setError] = useState<string | null>(failed ? `The provider reported: ${failed}.` : null)
  const started = useRef(false)

  useEffect(() => {
    if (failed || started.current) return
    started.current = true
    let timer: ReturnType<typeof setTimeout> | undefined
    void (async () => {
      let session = await refresh()
      if (!session) {
        await new Promise((resolve) => (timer = setTimeout(resolve, RETRY_MS)))
        session = await refresh()
      }
      if (session) navigate(takeReturnPath(), { replace: true })
      else setError("We couldn't find your session after signing in.")
    })()
    return () => clearTimeout(timer)
  }, [failed, navigate, refresh])

  return (
    <PageShell className="flex max-w-xl flex-col gap-4">
      <h1 className="font-sans text-h1 font-semibold">{error ? 'Sign-in didn’t finish' : 'Signing you in…'}</h1>
      {error ? (
        <>
          <p role="alert" className="text-lede text-ink-2">
            {error}
          </p>
          <p>
            <Link to="/signin" className="inline-flex min-h-target items-center text-accent underline-offset-4 hover:underline">
              Try again
            </Link>
          </p>
        </>
      ) : (
        <p role="status" className="text-lede text-ink-2">
          Checking your session with the sign-in server.
        </p>
      )}
    </PageShell>
  )
}
