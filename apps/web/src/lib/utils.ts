import { createCn } from 'cn/config'

// Programme's custom Tailwind scales (src/design/tokens.css). Without them the merger can't tell a font size
// from a colour, so cn('text-label text-ink') would silently drop the size. utils.test.ts keeps these in sync.
export const textSizes = ['display', 'h1', 'h2', 'h3', 'question', 'lede', 'prose', 'body', 'label', 'mono-s']
export const spacingTokens = ['gutter', 'section', 'header', 'target', 'target-primary']
export const shadowTokens = ['overlay']

export const cn = createCn({
  extend: {
    theme: { spacing: spacingTokens },
    classGroups: {
      'font-size': [{ text: textSizes }],
      shadow: [{ shadow: shadowTokens }],
    },
  },
})
