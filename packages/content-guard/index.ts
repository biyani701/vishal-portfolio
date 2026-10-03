import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

// The confidentiality and accuracy guard (specs/portfolio-narrative "Confidentiality and accuracy guard"), shared by
// apps/web and apps/hub (openspec add-biyani-hub, D3). Client and
// product names not cleared for publication, internal codenames, currency amounts and the "FNAM" misspelling must
// never reach content/ or the generated indexes. The build fails naming the file and the term. The codename patterns
// match the codenames' usage, not the bare words, so the privacy page can still talk about cookies.

export const DENYLIST: readonly { term: string; pattern: RegExp }[] = [
  { term: 'Goldman Sachs', pattern: /\bgoldman\b/i },
  { term: 'Apple', pattern: /\bapple\b/i },
  { term: 'Cookie (codename)', pattern: /\bcookie\s+(?:and\s+jazz|projects?|programme)\b/i },
  { term: 'Jazz (codename)', pattern: /\bjazz\b/i },
  { term: 'FNAM (misspelling of FNMA)', pattern: /\bfnam\b/i },
  { term: 'currency amount', pattern: /[$£€₹]\s?\d/ },
  { term: 'currency amount', pattern: /\b(?:USD|GBP|EUR|INR)\s?\d/ },
]

export class ConfidentialityError extends Error {
  override name = 'ConfidentialityError'
}

/** Throws `<file>: denylisted term "<term>"` for the first match in `text`. */
export function checkConfidential(file: string, text: string) {
  for (const { term, pattern } of DENYLIST) {
    if (pattern.test(text)) throw new ConfidentialityError(`${file}: denylisted term "${term}"`)
  }
}

/** Checks the source of every file under `dir` (content/), reported by its path from the app root. */
export function checkConfidentialSources(dir: string) {
  const files = (readdirSync(dir, { recursive: true }) as string[]).filter((name) => /\.(ts|md|json)$/.test(name)).sort()
  for (const name of files) {
    checkConfidential(['content', ...relative(dir, join(dir, name)).split(sep)].join('/'), readFileSync(join(dir, name), 'utf8'))
  }
}
