import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageShellProps {
  children: ReactNode
  className?: string
}

/**
 * The page's main landmark inside the AppShell: gutters that clear the safe areas, section rhythm and
 * the content width. `#main` is the skip link's target.
 */
export function PageShell({ children, className }: PageShellProps) {
  return (
    <main id="main" tabIndex={-1} className={cn('mx-auto w-full max-w-7xl flex-1 px-page py-section', className)}>
      {children}
    </main>
  )
}
