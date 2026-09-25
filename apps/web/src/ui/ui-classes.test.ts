// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { __unstable__loadDesignSystem } from 'tailwindcss'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'

// Tailwind silently ignores classes it doesn't know, so a shadcn class that has no Programme token
// (bg-popover, text-muted-foreground, sm:…) would just render unstyled. This compiles every class
// used in src/ui against the real theme (Tailwind + tokens.css + the shadcn variants) and fails on
// any that produce no CSS.
const dir = new URL('./', import.meta.url)
const require = createRequire(import.meta.url)
const read = (path: string | URL) => readFileSync(path, 'utf8')

const CLASS_FUNCTIONS = new Set(['cn', 'cva'])

/** Class-list strings: cn()/cva() arguments (minus cva's defaultVariants) and className attributes. */
function classStrings(file: string): string[] {
  const source = ts.createSourceFile(file, read(new URL(file, dir)), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const found: string[] = []

  function collect(node: ts.Node) {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      found.push(node.text)
      return
    }
    if (ts.isTemplateExpression(node)) {
      found.push(node.head.text, ...node.templateSpans.map((span) => span.literal.text))
    }
    if (ts.isPropertyAssignment(node)) {
      const key = node.name.getText(source).replace(/['"]/g, '')
      if (key === 'defaultVariants') return
      // compoundVariants entries mix variant selectors with the classes they apply.
      if (ts.isObjectLiteralExpression(node.parent) && ts.isArrayLiteralExpression(node.parent.parent)) {
        if (key !== 'class' && key !== 'className') return
      }
      collect(node.initializer)
      return
    }
    ts.forEachChild(node, collect)
  }

  function visit(node: ts.Node) {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && CLASS_FUNCTIONS.has(node.expression.text)) {
      node.arguments.forEach(collect)
      return
    }
    if (ts.isJsxAttribute(node) && node.name.getText(source) === 'className' && node.initializer) {
      collect(node.initializer)
      return
    }
    ts.forEachChild(node, visit)
  }

  visit(source)
  return found
}

const files = readdirSync(dir).filter((f) => f.endsWith('.tsx') && !f.includes('.test.'))
const byClass = new Map<string, Set<string>>()
for (const file of files) {
  for (const cls of classStrings(file).flatMap((s) => s.split(/\s+/)).filter(Boolean)) {
    if (!byClass.has(cls)) byClass.set(cls, new Set())
    byClass.get(cls)!.add(file)
  }
}

// tw-animate-css and shadcn publish their CSS only under the "style" export condition, which Node doesn't resolve;
// read them through apps/web/node_modules, where pnpm links every direct dependency.
const packageFile = (pkg: string, file: string) => read(new URL(`../../node_modules/${pkg}/${file}`, import.meta.url))

const css = [
  read(require.resolve('tailwindcss/index.css')),
  read(new URL('../design/tokens.css', import.meta.url)),
  packageFile('tw-animate-css', 'dist/tw-animate.css'),
  packageFile('shadcn', 'dist/tailwind.css'),
].join('\n')

describe('src/ui classes', () => {
  it('found components to check', () => {
    expect(files.length).toBeGreaterThan(20)
    expect(byClass.size).toBeGreaterThan(100)
  })

  it('every class compiles against the Programme theme', async () => {
    const design = await __unstable__loadDesignSystem(css, { base: new URL('../design/', import.meta.url).pathname })
    // group/peer markers only name an element for group-*/peer-* variants; they generate no CSS themselves.
    const classes = [...byClass.keys()].filter((cls) => !/^(group|peer)(\/[\w-]+)?$/.test(cls))
    const output = design.candidatesToCss(classes)
    const unknown = classes
      .filter((_, i) => !output[i])
      .map((cls) => `${cls}  (${[...byClass.get(cls)!].join(', ')})`)
    expect(unknown).toEqual([])
  })
})
