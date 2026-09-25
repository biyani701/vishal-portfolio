import { useSyncExternalStore } from 'react'
import { layoutModes, type LayoutMode } from '@/design/modes.ts'

// JS view of the four layout modes (design package §7), from the same query strings as the CSS variants in
// tokens.css. Use it only where the DOM differs by mode (navigation composition, Ask surface); styling
// belongs in the mobile:/tablet:/desktop:/compact-landscape: variants.
const entries = Object.entries(layoutModes) as [LayoutMode, string][]

/** The mode whose query matches. The queries partition every viewport; desktop is the fallback for prerendering. */
export function getLayoutMode(): LayoutMode {
  return entries.find(([, query]) => matchMedia(query).matches)?.[0] ?? 'desktop'
}

function subscribe(onChange: () => void) {
  const lists = entries.map(([, query]) => matchMedia(query))
  lists.forEach((list) => list.addEventListener('change', onChange))
  return () => lists.forEach((list) => list.removeEventListener('change', onChange))
}

export function useLayoutMode(): LayoutMode {
  return useSyncExternalStore(subscribe, getLayoutMode, () => 'desktop')
}
