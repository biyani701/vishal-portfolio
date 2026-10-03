import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { designAssets, FONTS_DIR, fontFiles } from './vite.ts'

// specs/shared-design: every app gets the same font files at the same /fonts/ URLs.
describe('designAssets', () => {
  it('ships the eight woff2 files and three licences', () => {
    const files = fontFiles()
    expect(files.filter((f) => f.endsWith('.woff2'))).toHaveLength(8)
    expect(files.filter((f) => f.startsWith('OFL-'))).toHaveLength(3)
  })

  it('emits every font file at fonts/<name>, byte for byte', () => {
    const emitted: { fileName: string; source: Uint8Array }[] = []
    const plugin = designAssets()
    const generate = plugin.generateBundle as unknown as (this: { emitFile: (f: (typeof emitted)[number]) => void }) => void
    generate.call({ emitFile: (file) => emitted.push(file) })
    expect(emitted.map((f) => f.fileName)).toEqual(fontFiles().map((name) => `fonts/${name}`))
    for (const file of emitted) expect(Buffer.compare(Buffer.from(file.source), readFileSync(FONTS_DIR + file.fileName.slice(6)))).toBe(0)
  })

  it('refers to the fonts by the same URLs the apps preload', () => {
    const css = readFileSync(new URL('./fonts.css', import.meta.url), 'utf8')
    const urls = [...css.matchAll(/url\('\/fonts\/([^']+)'\)/g)].map((m) => m[1]!)
    expect(urls.length).toBeGreaterThan(0)
    for (const name of urls) expect(fontFiles()).toContain(name)
  })
})
