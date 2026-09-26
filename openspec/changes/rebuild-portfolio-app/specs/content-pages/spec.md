## Purpose

Defines the typed content layer and the content routes built from it (Home, Experience, Work, About, Colophon, Legal), so every fact has one source.

## ADDED Requirements

### Requirement: Content layer
All portfolio facts (profile, roles, projects, skills, credentials) SHALL live in `apps/web/content` as schema-validated Markdown/TypeScript. The build SHALL fail on schema errors. The build SHALL also emit `search-index.json` and `ai-context.json` from the same records.

#### Scenario: Invalid record
- **WHEN** a project file is missing its `year` field
- **THEN** the build fails and names the file and field

#### Scenario: Placeholder content
- **WHEN** a project has no screenshot or outcome
- **THEN** its card uses the typographic architecture thumbnail, and no invented metric appears

### Requirement: Home
Home SHALL present:
- the hero (statement, lede, primary and secondary actions, portrait)
- the Programme Line
- the proof ledger
- three selected projects
- the Ask question input
- highlighted projects: the separately hosted projects (blog platform, knowledge base, auth POC), each linking to its case study
- the contact band

#### Scenario: Home on desktop
- **WHEN** Home renders at 1440×900
- **THEN** the hero statement, both actions and the start of the Programme Line are visible without scrolling

### Requirement: Experience
`/experience` SHALL present the interactive Programme Line, a role panel (dates, status, achievements, skills evidenced, "Ask about this role"), skills over time, and the credentials ledger (education, certification, recognition).

#### Scenario: Deep link to a role
- **WHEN** a visitor opens `/experience#bfs-uk`
- **THEN** the BFS UK role is selected and in view

### Requirement: Work
`/work` SHALL list all projects with filters (domain, stack), synced to the URL. `/work/:slug` SHALL render a case study: header with status chips, a facts list, table of contents, prose, architecture figure, code blocks, and an aside with "Ask about this" and related items.

Writing, knowledge articles and the glossary are not part of this site: each is its own project, hosted separately and presented here as a case study. A case study for a separately hosted project SHALL link to its live site and repository when they exist, and SHALL say plainly when it is still in progress.

#### Scenario: Filter link
- **WHEN** a visitor opens `/work?stack=python`
- **THEN** only Python projects are listed, and the Python filter shows as selected

#### Scenario: Separately hosted project
- **WHEN** a visitor opens `/work/knowledge-base`
- **THEN** the case study describes the knowledge base, and links to `kb.biyani.xyz` once it is live, or states that it is in progress

### Requirement: About, Colophon and Legal
`/about` SHALL present the story, working principles and credentials, without the portrait. `/colophon` SHALL describe the stack and credits. `/legal/privacy` and `/legal/terms` SHALL cover cookies, analytics, AI conversations and contact-message storage and retention.

#### Scenario: Privacy coverage
- **WHEN** a visitor reads `/legal/privacy`
- **THEN** it states what the contact form stores, for how long, and how AI questions are processed
