## Purpose

Defines the typed content layer and the content routes built from it (Home, Experience, Work, Writing, Knowledge, Glossary, 3-D Secure flow, About, Colophon, Legal), so every fact has one source.

## ADDED Requirements

### Requirement: Content layer
All portfolio facts (profile, roles, projects, skills, credentials, articles, knowledge topics, glossary) SHALL live in `apps/web/content` as schema-validated Markdown/TypeScript. The build SHALL fail on schema errors. The build SHALL also emit `search-index.json` and `ai-context.json` from the same records.

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
- writing and knowledge teasers
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

#### Scenario: Filter link
- **WHEN** a visitor opens `/work?stack=python`
- **THEN** only Python projects are listed, and the Python filter shows as selected

### Requirement: Writing and Knowledge
`/writing` and `/writing/:slug` SHALL render articles from Markdown, with a table of contents, serif prose, CodeBlock (highlighted at build time, with copy) and sanitised HTML. `/knowledge` SHALL present the domains. `/knowledge/:domain/:topic` SHALL use the article layout. Glossary terms in text SHALL open term popovers.

#### Scenario: Code copy
- **WHEN** a visitor activates Copy on a code block
- **THEN** the code is copied and a toast confirms it

### Requirement: Glossary
`/knowledge/glossary` SHALL provide autocomplete search, category filters with counts, A–Z jump links, a term grid, and a term detail panel (a Drawer on mobile) with related terms and "Ask about {term}".

#### Scenario: Search a term
- **WHEN** a visitor types "auth"
- **THEN** matching acronyms and full forms are suggested, and the last suggestion is "Ask: auth"

### Requirement: 3-D Secure flow
The 3-D Secure topic SHALL present the five-step flow as an interactive step sequence:
- **desktop:** a step list, a participant sequence diagram and a step detail panel
- **mobile:** vertical steps with the current step expanded and Previous/Next pinned

Steps are announced as "Step n of 5".

#### Scenario: Keyboard stepping
- **WHEN** a keyboard user activates Next on step 3
- **THEN** step 4 becomes current, the diagram highlights it, and the change is announced

### Requirement: About, Colophon and Legal
`/about` SHALL present the story, working principles and credentials, without the portrait. `/colophon` SHALL describe the stack and credits. `/legal/privacy` and `/legal/terms` SHALL cover cookies, analytics, AI conversations and contact-message storage and retention.

#### Scenario: Privacy coverage
- **WHEN** a visitor reads `/legal/privacy`
- **THEN** it states what the contact form stores, for how long, and how AI questions are processed
