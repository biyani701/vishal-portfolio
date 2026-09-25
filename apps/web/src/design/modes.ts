// Layout-mode media queries (design package §7). These strings must match the @custom-variant
// definitions in tokens.css exactly; tokens.test.ts enforces that. useLayoutMode (P3.1) reads them via matchMedia.
export const layoutModes = {
  'compact-landscape': '(orientation: landscape) and (height <= 500px)',
  mobile: '(width < 600px) and (orientation: portrait), (width < 600px) and (height > 500px)',
  tablet: '(600px <= width < 900px) and (orientation: portrait), (600px <= width < 900px) and (height > 500px)',
  desktop: '(width >= 900px) and (orientation: portrait), (width >= 900px) and (height > 500px)',
} as const

export type LayoutMode = keyof typeof layoutModes
