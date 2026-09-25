import { useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { cn } from '@/lib/utils'

// DD-4 (design package §4.4): medium portrait, natural colour, Home hero only, never beside AI output.
// Enforced twice: lint lets only the Home route import this component, and at runtime it renders nothing
// off the home page or inside anything marked `data-ai-output`.
export const AI_OUTPUT_ATTRIBUTE = 'data-ai-output'

interface PortraitProps {
  src: string
  /** Required: describes the person, e.g. "Vishal Biyani, smiling, in a navy shirt". */
  alt: string
  className?: string
}

export function Portrait({ src, alt, className }: PortraitProps) {
  const { pathname } = useLocation()
  const ref = useRef<HTMLImageElement>(null)
  const [besideAi, setBesideAi] = useState(false)

  useLayoutEffect(() => {
    setBesideAi(Boolean(ref.current?.closest(`[${AI_OUTPUT_ATTRIBUTE}]`)))
  }, [])

  const allowed = pathname === '/' && !besideAi
  if (!allowed && import.meta.env.DEV) {
    console.error(`Portrait is Home-hero only (DD-4); not rendered at ${pathname}${besideAi ? ' beside AI output' : ''}.`)
  }

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      hidden={!allowed}
      decoding="async"
      className={cn(
        // 4:5 natural colour, radius 8, 1px accent keyline offset 6px; slightly dimmed in the dark theme.
        'aspect-4/5 w-full rounded-md object-cover outline-1 outline-offset-6 outline-accent dark:brightness-94',
        // Mobile: 104px beside the role line. Compact landscape: 76px square. Desktop: its 3-of-12 grid column.
        'mobile:w-26 compact-landscape:aspect-square compact-landscape:w-19',
        className,
      )}
    />
  )
}
