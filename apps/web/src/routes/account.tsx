import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import type { Session } from '@/auth/client.ts'
import { useAuth } from '@/auth/context.ts'
import { PageShell } from '@/layout/PageShell.tsx'
import { Button } from '@/ui/button.tsx'

// specs/auth-integration "Account menu and page": account details and the visitor's GitHub repositories, as
// the old /profile page showed them.

interface Repo {
  id: number
  name: string
  html_url: string
  description: string | null
  stargazers_count: number
  language: string | null
}

type Repos = { state: 'loading' } | { state: 'ready'; repos: Repo[] } | { state: 'unavailable'; reason: string }

/** Repositories by stars: the signed-in visitor's own when the session carries a GitHub token, else public ones. */
function useRepos(session: Session | null): Repos {
  const token = session?.accessToken
  const login = session?.user.login
  const url = token
    ? 'https://api.github.com/user/repos?per_page=100'
    : login
      ? `https://api.github.com/users/${encodeURIComponent(login)}/repos?per_page=100`
      : null
  const [result, setResult] = useState<{ url: string; repos: Repos } | null>(null)

  useEffect(() => {
    if (!url) return
    const controller = new AbortController()
    fetch(url, { signal: controller.signal, headers: token ? { Authorization: `token ${token}` } : {} })
      .then((response) => {
        if (!response.ok) throw new Error(`GitHub answered ${response.status}`)
        return response.json() as Promise<Repo[]>
      })
      .then((list) =>
        setResult({ url, repos: { state: 'ready', repos: [...list].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 5) } }),
      )
      .catch((error: Error) => {
        if (!controller.signal.aborted) setResult({ url, repos: { state: 'unavailable', reason: `Couldn't load repositories (${error.message}).` } })
      })
    return () => controller.abort()
  }, [url, token])

  if (!url) return { state: 'unavailable', reason: 'Sign in with GitHub to see your repositories here.' }
  return result?.url === url ? result.repos : { state: 'loading' }
}

export function Component() {
  const { status, session, signOut } = useAuth()
  const repos = useRepos(session)

  if (status !== 'signed-in' || !session) {
    return (
      <PageShell className="flex max-w-xl flex-col gap-4">
        <h1 className="font-sans text-h1 font-semibold">Account</h1>
        <p className="text-lede text-ink-2">
          {status === 'loading' ? 'Checking whether you’re signed in…' : 'You’re not signed in.'}
        </p>
        {status === 'signed-out' && (
          <p>
            <Button render={<Link to="/signin?from=/account" />}>Sign in</Button>
          </p>
        )}
      </PageShell>
    )
  }

  const { user } = session
  return (
    <PageShell className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        {user.image && <img src={user.image} alt="" className="size-16 rounded-md border border-border" />}
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="font-sans text-h1 font-semibold break-words">{user.name}</h1>
          {user.email && <p className="text-body break-all text-muted">{user.email}</p>}
        </div>
      </div>

      <section aria-labelledby="repos-heading" className="flex max-w-3xl flex-col gap-3 border-t-2 border-border-strong pt-4">
        <h2 id="repos-heading" className="font-sans text-h3 font-semibold">
          Your GitHub repositories
        </h2>
        {repos.state === 'loading' && <p role="status">Loading repositories…</p>}
        {repos.state === 'unavailable' && <p className="text-muted">{repos.reason}</p>}
        {repos.state === 'ready' &&
          (repos.repos.length ? (
            <ul className="flex flex-col">
              {repos.repos.map((repo) => (
                <li key={repo.id} className="border-b border-border py-3">
                  <a href={repo.html_url} className="font-medium text-accent underline-offset-4 hover:underline">
                    {repo.name}
                  </a>
                  <p className="text-label text-muted">
                    {[repo.language, `${repo.stargazers_count} ★`].filter(Boolean).join(' · ')}
                    {repo.description ? ` — ${repo.description}` : ''}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No repositories yet.</p>
          ))}
      </section>

      <p>
        <Button variant="outline" onClick={signOut}>
          Sign out
        </Button>
      </p>
    </PageShell>
  )
}
