// UF-3: apps/web must not depend on Radix, vaul, cmdk or the old Base UI package, even transitively
// (lint only sees direct imports). Other workspace apps may still use them, so this walks only this
// package's resolved tree.
import { execSync } from 'node:child_process'

const FORBIDDEN = /^(@radix-ui\/.+|radix-ui|vaul|cmdk|@base-ui-components\/.+)$/

const tree = JSON.parse(
  // A fixed command string (pnpm is a .cmd shim on Windows); the tree is over 1 MB of JSON.
  execSync('pnpm list --depth Infinity --json', { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 }),
)

const found = new Map()
function walk(node, path) {
  for (const group of ['dependencies', 'devDependencies', 'optionalDependencies']) {
    for (const [name, child] of Object.entries(node[group] ?? {})) {
      const here = [...path, name]
      if (FORBIDDEN.test(name) && !found.has(name)) found.set(name, here.join(' > '))
      walk(child, here)
    }
  }
}
for (const root of tree) walk(root, [root.name])

if (found.size) {
  console.error('Forbidden packages in the apps/web dependency tree (UF-3):')
  for (const via of found.values()) console.error(`  ${via}`)
  process.exit(1)
}
console.log('check-deps: no Radix, vaul, cmdk or @base-ui-components in the apps/web dependency tree')
