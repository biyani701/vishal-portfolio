// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { credentials } from '../../content/credentials.ts'
import { glossary } from '../../content/glossary.ts'
import { domains } from '../../content/knowledge/domains.ts'
import { profile } from '../../content/profile.ts'
import { organisations, roles } from '../../content/roles.ts'
import { skills } from '../../content/skills.ts'
import { buildAiContext, buildSearchIndex } from './indexes.ts'
import { loadContent, loadMarkdown, validateCollections } from './load.ts'
import { renderMarkdown } from './markdown.ts'

const fixture = (name: string) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8')
const collections = { profile, organisations, roles, skills, credentials, domains, glossary }

describe('content records (task 4.2)', () => {
  it('migrates every record from apps/portfolio', async () => {
    const content = await loadContent()
    expect(content.projects).toHaveLength(5)
    expect(content.roles).toHaveLength(5) // engagements
    expect(content.glossary).toHaveLength(68)
    expect(content.writing).toHaveLength(3)
    expect(content.domains).toHaveLength(3)
    expect(content.projects.filter((p) => p.meta.featured)).toHaveLength(3)
  })

  it('has exactly one current role, and dates in order', () => {
    expect(roles.filter((role) => !('end' in role))).toHaveLength(1)
    for (const role of roles) if ('end' in role) expect(role.end >= role.start, role.id).toBe(true)
  })
})

describe('validation fails naming the file and field (task 4.1)', () => {
  it('a project without its year', async () => {
    await expect(loadMarkdown('content/projects/no-year.md', fixture('no-year.md'))).rejects.toThrow(
      /^content\/projects\/no-year\.md: year: /,
    )
  })

  it('a slug that does not match the file name', async () => {
    const source = fixture('no-year.md').replace('type:', 'year: 2020\ntype:')
    await expect(loadMarkdown('content/projects/other-name.md', source)).rejects.toThrow(
      'content/projects/other-name.md: slug: "no-year" must match the file name "other-name"',
    )
  })

  it('a file without frontmatter', async () => {
    await expect(loadMarkdown('content/writing/bare.md', '# Just a body')).rejects.toThrow(
      'content/writing/bare.md: frontmatter: missing',
    )
  })

  it('a malformed date in a TypeScript collection', () => {
    const broken = { ...collections, roles: [{ ...roles[0], start: 'Nov 2019' }, ...roles.slice(1)] }
    expect(() => validateCollections(broken)).toThrow('content/roles.ts: [0].start: use YYYY-MM')
  })

  it('a reference to a record that does not exist', async () => {
    const broken = { ...collections, roles: [{ ...roles[0], projects: ['nope'] }, ...roles.slice(1)] }
    await expect(loadContent(broken)).rejects.toThrow('content/roles.ts: [0].projects: no project "nope"')
  })
})

describe('Markdown pipeline (task 4.3)', () => {
  it('renders headings with ids, a highlighted code block and a table, and strips unsafe HTML', async () => {
    const { html, headings } = await renderMarkdown(fixture('article.md'))

    expect(headings).toEqual([
      { id: 'why-it-matters', text: 'Why it matters', depth: 2 },
      { id: 'a-detail', text: 'A detail', depth: 3 },
    ])
    expect(html).toContain('<h2 id="why-it-matters">')
    // Shiki output coloured through the token variables, never raw colours.
    expect(html).toMatch(/<pre class="shiki programme[^"]*"[^>]*><code class="language-python">/)
    expect(html).toContain('var(--code-token-keyword)')
    expect(html).not.toMatch(/color:\s*#/i)
    expect(html).toContain('<table>')
    expect(html).toContain('<td>Authenticate</td>')

    expect(html).not.toContain('<script')
    expect(html).not.toContain('onerror')
  })

  it('compiles a content file through the Vite plugin', async () => {
    const project = await import('/content/projects/fast-jiraql.md')
    expect(project.meta).toMatchObject({ slug: 'fast-jiraql', year: 2023 })
    expect(project.html).toContain('<h2 id="what-it-does">')
    expect(project.headings.map((h: { id: string }) => h.id)).toContain('what-it-does')
  })
})

describe('build artefacts (task 4.4)', () => {
  it('are deterministic', async () => {
    const [a, b] = await Promise.all([loadContent(), loadContent()])
    expect(JSON.stringify(buildSearchIndex(a))).toBe(JSON.stringify(buildSearchIndex(b)))
    expect(JSON.stringify(buildAiContext(a))).toBe(JSON.stringify(buildAiContext(b)))
  })

  it('index every page, role, project, article, topic and term once', async () => {
    const content = await loadContent()
    const { entries } = buildSearchIndex(content)
    expect(new Set(entries.map((e) => e.id)).size).toBe(entries.length)
    const count = (group: string) => entries.filter((e) => e.group === group).length
    expect(count('role')).toBe(5)
    expect(count('project')).toBe(5)
    expect(count('article')).toBe(3)
    expect(count('term')).toBe(68)
    expect(count('topic')).toBe(3 + content.topics.length)
    expect(entries.find((e) => e.id === 'term:cavv')).toMatchObject({
      title: 'CAVV',
      summary: 'Cardholder Authentication Verification Value',
      url: '/knowledge/glossary#cavv',
    })
  })

  it('contain only published fields: no contact details and nothing unrendered', async () => {
    const context = buildAiContext(await loadContent())
    const text = JSON.stringify(context)
    expect(text).not.toMatch(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i) // no email address
    expect(text).not.toMatch(/\+91[\s\d]/) // no phone number
    expect(Object.keys(context.profile).sort()).toEqual(
      ['currentRole', 'links', 'location', 'name', 'positioning', 'proof', 'summary'].sort(),
    )
    expect(context.projects.map((p) => p.slug)).toHaveLength(5)
    expect(context.roles.find((r) => r.id === 'corecard')).toMatchObject({ status: 'in-flight', end: null })
    expect(context.milestones.map((m) => m.when)).toEqual(['Q4 2009', '2013', 'Sep 2020', 'Q3 2021'])
  })
})
