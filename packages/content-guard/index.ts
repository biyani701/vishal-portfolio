import { createHash } from 'node:crypto'
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

// The confidentiality and accuracy guard (specs/portfolio-narrative "Confidentiality and accuracy guard"), shared by
// apps/web and apps/hub (openspec add-biyani-hub, D3). Client and product names not cleared for publication,
// internal codenames, currency amounts and the "FNAM" misspelling must never reach content/ or the generated files.
// The build fails naming the file and the kind of term.
//
// The names and codenames are stored as SHA-256 hashes of lower-cased words and short phrases, so this public
// repository doesn't spell out what it is protecting. Hashing keeps them out of search and casual reading; it is not
// secrecy against someone hashing guesses. To add a term, hash its lower-case form:
//   node -e "console.log(require('node:crypto').createHash('sha256').update('<term>').digest('hex'))"

type Kind = 'uncleared name' | 'internal codename'

/** Hashed words and phrases (one to three words, lower case, single spaces) and what kind of term each is. */
export const HASHED_TERMS: ReadonlyMap<string, Kind> = new Map([
  ['1bf26a0f3f93196133aa4e6e2b4104e1355431f55d58c914226c319633d2ca96', 'uncleared name'],
  ['3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b', 'uncleared name'],
  ['c301f75ab52fa076c827231e613bbc976e26b2c1f7ddd01a319b2832b8ecdf9a', 'internal codename'],
  // A codename that is also an ordinary word, so only its codename usages are hashed (the privacy page talks about
  // cookies): "<codename> and <codename>", "<codename> project(s)" and "<codename> programme".
  ['81d8759d2d0a49f1deab85f57ca7cb6683b2a055503866ea119ad079e1fa2bd5', 'internal codename'],
  ['f03f02f73d5a5946dc2c7d2d50281f2ec82807ab4794da92904356992b162992', 'internal codename'],
  ['3e7aad71f5f0ba33d25e98446c47bbdafa2adedf22bfc50f305cc599d6b51747', 'internal codename'],
  ['dee5e228b25a0f066920d6fa579a36076f98909b6182ac0409d98825bd547909', 'internal codename'],
])

/** Plain-text patterns: nothing confidential in them. */
export const PATTERNS: readonly { term: string; pattern: RegExp }[] = [
  { term: 'FNAM (misspelling of FNMA)', pattern: /\bfnam\b/i },
  { term: 'currency amount', pattern: /[$£€₹]\s?\d/ },
  { term: 'currency amount', pattern: /\b(?:USD|GBP|EUR|INR)\s?\d/ },
]

export class ConfidentialityError extends Error {
  override name = 'ConfidentialityError'
}

const sha256 = (text: string) => createHash('sha256').update(text).digest('hex')

/** Every word, and every run of two and three words, in lower case: what HASHED_TERMS is compared against. */
export function phrases(text: string): Set<string> {
  const words = text.toLowerCase().match(/[a-z]+/g) ?? []
  const out = new Set<string>()
  words.forEach((_, i) => {
    for (let n = 1; n <= 3 && i + n <= words.length; n++) out.add(words.slice(i, i + n).join(' '))
  })
  return out
}

/** Throws `<file>: denylisted <kind>` for the first problem in `text`. `terms` is replaceable for tests. */
export function checkConfidential(file: string, text: string, terms: ReadonlyMap<string, Kind> = HASHED_TERMS) {
  for (const phrase of phrases(text)) {
    const kind = terms.get(sha256(phrase))
    if (kind) throw new ConfidentialityError(`${file}: denylisted ${kind}`)
  }
  for (const { term, pattern } of PATTERNS) {
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
