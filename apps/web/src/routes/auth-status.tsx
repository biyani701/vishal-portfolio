import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useAuth } from '@/auth/context.ts'
import { PageShell } from '@/layout/PageShell.tsx'

const linkClass = 'inline-flex min-h-target items-center text-accent underline-offset-4 hover:underline'

/** /auth-error: where the auth server sends a failed sign-in. */
export function AuthError() {
  const [params] = useSearchParams()
  const reason = params.get('error') ?? params.get('message')
  return (
    <PageShell className="flex max-w-xl flex-col gap-4">
      <h1 className="font-sans text-h1 font-semibold">Sign-in didn’t work</h1>
      <p className="text-lede text-ink-2">{reason ? `The sign-in server reported: ${reason}.` : 'The sign-in server reported an error.'}</p>
      <p className="flex gap-6">
        <Link to="/signin" className={linkClass}>
          Try again
        </Link>
        <Link to="/" className={linkClass}>
          Go to Home
        </Link>
      </p>
    </PageShell>
  )
}

/** /logout: kept for old links; ends the session and returns to Home. */
export function Logout() {
  const { signOut } = useAuth()
  useEffect(signOut, [signOut])
  return (
    <PageShell>
      <h1 className="font-sans text-h1 font-semibold">Signing you out…</h1>
    </PageShell>
  )
}
