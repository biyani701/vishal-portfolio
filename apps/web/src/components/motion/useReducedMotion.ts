import { useSyncExternalStore } from 'react'

// The reduced-motion gate for JS-driven motion (Reveal, the Ask caret). CSS transitions and animations are
// already made instant globally in tokens.css under the same media query.
const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void) {
  const media = matchMedia(QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

export const prefersReducedMotion = () => matchMedia(QUERY).matches

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => false)
}
