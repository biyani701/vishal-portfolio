import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import type { SearchEntry } from '@content/schema.ts'
import {
  Autocomplete,
  AutocompleteCollection,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
  AutocompleteStatus,
} from '@/ui/autocomplete.tsx'
import { Dialog, DialogContent, DialogTitle } from '@/ui/dialog.tsx'
import { PaletteContext } from './context.ts'
import { loadSearchIndex, searchEntries, type ResultGroup } from './search.ts'

// The ⌘K palette (specs/site-navigation "Command palette"): Dialog + Autocomplete over the build-time index,
// results grouped by kind, and "Ask: {query}" always last. Ask itself arrives in P11; until then the Ask
// option opens /ask?q=….

export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [initialQuery, setInitialQuery] = useState('')

  const openPalette = useCallback((query = '') => {
    setInitialQuery(query)
    setOpen(true)
  }, [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey) && !event.altKey) {
        event.preventDefault()
        setOpen((wasOpen) => {
          if (!wasOpen) setInitialQuery('')
          return !wasOpen
        })
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const value = useMemo(() => ({ openPalette }), [openPalette])
  return (
    <PaletteContext value={value}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        {open && <Palette initialQuery={initialQuery} onDone={() => setOpen(false)} />}
      </Dialog>
    </PaletteContext>
  )
}

type Status = 'loading' | 'ready' | 'failed'

function Palette({ initialQuery, onDone }: { initialQuery: string; onDone: () => void }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState(initialQuery)
  const [entries, setEntries] = useState<SearchEntry[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const highlighted = useRef<SearchEntry | undefined>(undefined)

  useEffect(() => {
    let live = true
    loadSearchIndex().then(
      (loaded) => live && (setEntries(loaded), setStatus('ready')),
      () => live && setStatus('failed'),
    )
    return () => {
      live = false
    }
  }, [])

  const groups: ResultGroup[] = useMemo(() => searchEntries(entries, query), [entries, query])

  function go(entry: SearchEntry | undefined) {
    if (!entry) return
    onDone()
    navigate(entry.url)
  }

  return (
    <DialogContent
      showCloseButton={false}
      className="top-16 translate-y-0 content-start gap-0 overflow-hidden p-0 tablet:max-w-xl desktop:max-w-xl compact-landscape:top-2"
    >
      <DialogTitle className="sr-only">Search or ask</DialogTitle>
      <Autocomplete
        inline
        open
        items={groups}
        filteredItems={groups}
        value={query}
        onValueChange={(value) => setQuery(value)}
        itemToStringValue={(entry: SearchEntry) => entry.title}
        autoHighlight="always"
        onItemHighlighted={(entry: SearchEntry | undefined) => (highlighted.current = entry)}
      >
        <div className="border-b border-border p-3">
          <AutocompleteInput
            aria-label="Search or ask"
            placeholder="Search or ask…"
            className="w-full"
            onKeyDown={(event) => {
              if (event.key === 'Enter' && highlighted.current) {
                event.preventDefault()
                go(highlighted.current)
              }
            }}
          />
        </div>
        <AutocompleteStatus>
          {status === 'loading' ? 'Loading the index…' : status === 'failed' ? 'Search is unavailable right now; you can still ask.' : ''}
        </AutocompleteStatus>
        <AutocompleteEmpty>No matches</AutocompleteEmpty>
        <AutocompleteList className="max-h-96 overflow-y-auto">
          {(group: ResultGroup) => (
            <AutocompleteGroup key={group.value} items={group.items} className="py-1">
              <AutocompleteLabel>{group.label}</AutocompleteLabel>
              <AutocompleteCollection>
                {(entry: SearchEntry) => (
                  <AutocompleteItem key={entry.id} value={entry} onClick={() => go(entry)} className="min-h-11 py-1.5">
                    <span className="flex min-w-0 flex-col">
                      <span className={group.value === 'ask' ? 'font-medium text-accent' : 'font-medium'}>{entry.title}</span>
                      <span className="truncate text-muted">{entry.summary}</span>
                    </span>
                  </AutocompleteItem>
                )}
              </AutocompleteCollection>
            </AutocompleteGroup>
          )}
        </AutocompleteList>
      </Autocomplete>
    </DialogContent>
  )
}
