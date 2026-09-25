// The 9-viewport matrix from specs/responsive-layout ("No horizontal overflow"), tagged with the layout
// mode each one must resolve to (compact-landscape: landscape and height ≤ 500; else by width 600/900).
export type LayoutMode = 'compact-landscape' | 'mobile' | 'tablet' | 'desktop'

export interface MatrixViewport {
  width: number
  height: number
  mode: LayoutMode
  /** Phones and tablets: emulate a touch device with a mobile meta-viewport. */
  touch: boolean
}

export const viewports: MatrixViewport[] = [
  { width: 320, height: 568, mode: 'mobile', touch: true },
  { width: 375, height: 667, mode: 'mobile', touch: true },
  { width: 390, height: 844, mode: 'mobile', touch: true },
  { width: 568, height: 320, mode: 'compact-landscape', touch: true },
  { width: 844, height: 390, mode: 'compact-landscape', touch: true },
  { width: 932, height: 430, mode: 'compact-landscape', touch: true },
  { width: 768, height: 1024, mode: 'tablet', touch: true },
  { width: 1024, height: 768, mode: 'desktop', touch: true },
  { width: 1440, height: 900, mode: 'desktop', touch: false },
]

export const viewportName = ({ width, height, mode }: MatrixViewport) => `${mode}-${width}x${height}`
