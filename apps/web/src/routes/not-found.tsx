import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { usePalette } from '@/features/search/context.ts'
import { PageShell } from '@/layout/PageShell.tsx'
import { sections } from '@/layout/sections.ts'
import { Button } from '@/ui/button.tsx'
import { Input } from '@/ui/input.tsx'
import { Label } from '@/ui/label.tsx'

// specs/site-navigation "Not found": inside the shell, offering search (the ⌘K palette, pre-filled), Ask and
// links to the main sections.
export function Component() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { openPalette } = usePalette()
  const [question, setQuestion] = useState('')

  // Enter searches; the Ask button hands the question to Ask instead.
  function search(event: FormEvent) {
    event.preventDefault()
    openPalette(question.trim())
  }

  function ask() {
    const q = question.trim()
    navigate(q ? `/ask?${new URLSearchParams({ q })}` : '/ask')
  }

  return (
    <PageShell className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="font-mono text-mono-s text-muted uppercase">404</p>
        <h1 className="font-sans text-h1 font-semibold">Page not found</h1>
        <p className="text-lede text-ink-2">
          Nothing lives at <code className="font-mono break-all">{pathname}</code>. It may have moved in the redesign.
        </p>
      </div>

      <form role="search" aria-label="Search this site" onSubmit={search} className="flex max-w-xl flex-col gap-2">
        <Label htmlFor="not-found-question">What were you looking for?</Label>
        <div className="flex gap-2">
          <Input
            id="not-found-question"
            name="q"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            autoComplete="off"
          />
          <Button type="submit">Search</Button>
          <Button type="button" variant="outline" onClick={ask}>
            Ask
          </Button>
        </div>
      </form>

      <nav aria-label="Main sections">
        <ul className="flex flex-wrap gap-x-6 gap-y-1">
          {[{ path: '/', label: 'Home' }, ...sections].map(({ path, label }) => (
            <li key={path}>
              <Link to={path} className="inline-flex min-h-target items-center text-accent underline-offset-4 hover:underline">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </PageShell>
  )
}
