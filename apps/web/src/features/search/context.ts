import { createContext, use } from 'react'

export interface Palette {
  /** Opens the ⌘K palette, optionally with a query already typed. */
  openPalette: (query?: string) => void
}

export const PaletteContext = createContext<Palette | null>(null)

export function usePalette(): Palette {
  const context = use(PaletteContext)
  if (!context) throw new Error('usePalette must be used inside <SearchProvider>')
  return context
}

/** The shortcut as the visitor's platform writes it. */
export const shortcutLabel = () => (/Mac|iPhone|iPad/.test(navigator.platform) ? '⌘K' : 'Ctrl K')
