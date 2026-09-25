import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { prefersReducedMotion } from './useReducedMotion.ts'

// Design package §4.5: an 8px rise plus fade, once. Content is visible without JS: nothing starts hidden in
// the markup; only content that is still below the fold when this mounts is hidden, then revealed as it
// scrolls in. Reduced motion (or no IntersectionObserver) skips the effect entirely.
type Phase = 'static' | 'pending' | 'shown'

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<Phase>('static')

  useLayoutEffect(() => {
    const element = ref.current
    if (!element || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return
    if (element.getBoundingClientRect().top < window.innerHeight) return // already in view: never hide it

    setPhase('pending')
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setPhase('shown')
        observer.disconnect()
      }
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-reveal={phase}
      className={cn(
        'transition duration-reveal ease-enter',
        phase === 'pending' && 'translate-y-2 opacity-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
