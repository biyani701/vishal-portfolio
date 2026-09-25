// content/**/*.md is compiled by scripts/content/plugin.ts into a module of this shape.
declare module '*.md' {
  import type { Heading } from '@content/schema.ts'

  export const meta: unknown
  export const html: string
  export const headings: Heading[]
  export const words: number
}
