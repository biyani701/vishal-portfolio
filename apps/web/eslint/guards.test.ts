// @vitest-environment node
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { ESLint } from 'eslint'
import { describe, expect, it } from 'vitest'

// Each fixture is linted as if it lived at `path`, so the per-directory overrides are exercised too.
const eslint = new ESLint({ cwd: fileURLToPath(new URL('..', import.meta.url)) })

async function lint(fixture: string, path: string) {
  const code = readFileSync(new URL(`./fixtures/${fixture}`, import.meta.url), 'utf8')
  const [result] = await eslint.lintText(code, { filePath: path })
  return result!.messages.map((m) => ({ rule: m.ruleId, message: m.message }))
}

// The first lint loads ESLint and typescript-eslint cold, which can exceed 5s while the browser tests run alongside.
describe('UF-3 lint guards', { timeout: 30_000 }, () => {
  it.each([
    ['radix-import.tsx', '@radix-ui/react-dialog'],
    ['radix-ui-import.tsx', 'radix-ui'],
    ['vaul-import.tsx', 'vaul'],
    ['cmdk-import.tsx', 'cmdk'],
    ['old-base-ui-import.tsx', '@base-ui-components/react/dialog'],
  ])('rejects %s everywhere, including src/ui', async (fixture, pkg) => {
    for (const path of ['src/routes/fixture.tsx', 'src/ui/fixture.tsx']) {
      const messages = await lint(fixture, path)
      expect(messages).toContainEqual({ rule: 'no-restricted-imports', message: expect.stringContaining(`'${pkg}'`) })
    }
  })

  it('allows @base-ui/react only inside src/ui', async () => {
    expect(await lint('base-ui-import.tsx', 'src/routes/fixture.tsx')).toContainEqual({
      rule: 'no-restricted-imports',
      message: expect.stringContaining("'@base-ui/react/dialog'"),
    })
    expect(await lint('base-ui-import.tsx', 'src/ui/dialog.tsx')).toEqual([])
  })

  it('rejects asChild with a pointer to the render prop, including in src/ui', async () => {
    for (const path of ['src/components/fixture.tsx', 'src/ui/fixture.tsx']) {
      expect(await lint('as-child.tsx', path)).toEqual([
        { rule: 'portfolio/no-as-child', message: expect.stringContaining('`render` prop') },
      ])
    }
  })

  it('rejects arbitrary Tailwind values outside src/design and src/ui', async () => {
    const tokens = (await lint('arbitrary-value.tsx', 'src/routes/fixture.tsx'))
      .filter((m) => m.rule === 'portfolio/no-arbitrary-tailwind')
      .map((m) => /`(.+?)`/.exec(m.message)?.[1])
    expect(tokens).toEqual(['text-[#2447D9]', 'p-[13px]', 'md:[mask-type:alpha]', 'hover:p-(--gap)'])
  })

  it('allows arbitrary Tailwind values in src/design and src/ui', async () => {
    expect(await lint('arbitrary-value.tsx', 'src/design/fixture.tsx')).toEqual([])
    expect(await lint('arbitrary-value.tsx', 'src/ui/fixture.tsx')).toEqual([])
  })

  it('accepts token utilities, arbitrary variants and non-class strings', async () => {
    expect(await lint('allowed-classes.tsx', 'src/routes/fixture.tsx')).toEqual([])
  })
})
