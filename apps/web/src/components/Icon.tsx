import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// Design package §4.4: Lucide outline icons at 1.75px stroke and 16/20/24px. There is no AI icon (lint bans
// the Sparkles/Bot/Wand family); Ask is the word "Ask".
const SIZES = { sm: 16, md: 20, lg: 24 } as const

interface IconProps {
  icon: LucideIcon
  size?: keyof typeof SIZES
  /** Only for icons that carry meaning on their own. Decorative icons (the default) are hidden from assistive tech. */
  label?: string
  className?: string
}

export function Icon({ icon: Glyph, size = 'sm', label, className }: IconProps) {
  const px = SIZES[size]
  return (
    <Glyph
      size={px}
      strokeWidth={1.75}
      absoluteStrokeWidth
      className={cn('shrink-0', className)}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true, focusable: false })}
    />
  )
}
