import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { authSettings, rememberReturnPath, signInUrl } from '@/auth/client.ts'
import { ProviderIcon } from '@/auth/ProviderIcon.tsx'
import { PageShell } from '@/layout/PageShell.tsx'
import { Button } from '@/ui/button.tsx'

// specs/auth-integration "Sign-in page": the configured providers as labelled buttons, a busy state while
// redirecting, and a recoverable error if the redirect can't start. `?from=/path` is where to come back to.
export function Component() {
  const [params] = useSearchParams()
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const settings = authSettings()
  const providers = 'error' in settings ? [{ id: 'github', name: 'GitHub' }] : settings.providers

  function start(provider: { id: string; name: string }) {
    setError(null)
    if ('error' in settings) {
      setError(`Sign-in isn't available right now (${settings.error}). Please try again later.`)
      return
    }
    setBusy(provider.name)
    rememberReturnPath(params.get('from') ?? '/')
    try {
      location.assign(signInUrl(settings, provider.id))
    } catch (cause) {
      setBusy(null)
      setError(`Couldn't start sign-in with ${provider.name}: ${(cause as Error).message}`)
    }
  }

  return (
    <PageShell className="flex max-w-xl flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="font-sans text-h1 font-semibold">Sign in</h1>
        <p className="text-lede text-ink-2">
          Signing in is optional. It shows your account details and your GitHub repositories on the Account page.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {providers.map((provider) => (
          <Button
            key={provider.id}
            variant="outline"
            size="lg"
            className="justify-start"
            disabled={busy !== null}
            onClick={() => start(provider)}
          >
            <ProviderIcon provider={provider.id} />
            Continue with {provider.name}
          </Button>
        ))}
      </div>

      <p role="status" aria-live="polite" className="text-label text-muted empty:hidden">
        {busy ? `Redirecting to ${busy}…` : ''}
      </p>
      {error && (
        <p role="alert" className="rounded-md border border-error-border bg-error-bg p-3 text-label text-error">
          {error}
        </p>
      )}
    </PageShell>
  )
}
