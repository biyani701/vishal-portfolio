## Purpose

Defines how the site presents its owner: as a senior technology delivery and programme leader who stays close to engineering. It covers positioning, proof, programme case studies, the order of the Home story, Experience and About copy, and the confidentiality and accuracy rules that constrain every page and the Ask corpus.

## ADDED Requirements

### Requirement: Positioning
The hero SHALL position the owner as a technology delivery and programme leader in financial services. The hero has four parts:
- a kicker naming that function
- a three-line statement in this order: leading delivery, understanding payments, building tools
- a lede that traces the career from engineering to programme leadership
- the current-role caption "Programme delivery lead · CoreCard"; the formal title stays on Experience

Years of experience SHALL be derived from the first role's start date wherever they appear, never hard-coded. Technology names SHALL NOT appear in the hero.

#### Scenario: Years stay current
- **WHEN** the site is built in October 2026 and the first role started in May 2000
- **THEN** every place that states years of experience shows 26

#### Scenario: Hero has no stack
- **WHEN** a visitor reads the hero
- **THEN** it names no programming language, framework or tool

### Requirement: Proof ledger
Home's proof ledger SHALL show exactly four leadership outcomes:
- years in financial-services technology
- 104 people across 7 teams
- 50+ applications run for the IFC
- 4× system-wide throughput

Every figure SHALL carry a label that says what it measures and where it comes from. The ledger SHALL NOT show the same number with two meanings.

#### Scenario: Throughput is scoped
- **WHEN** a visitor reads the 4× figure
- **THEN** its label says it was measured across the reference-data system, not on a single file

### Requirement: Programme case studies
Work SHALL include three programme case studies:
- building predictable delivery at scale (CoreCard)
- stabilising a 50+ application portfolio (IFC)
- re-engineering market reference-data processing (JPMorgan Chase)

Each SHALL present context, the problem, what the owner did, and the outcome, with one headline outcome. Each SHALL be readable in short paragraphs and lists, and SHALL state only facts the owner has supplied.

The CoreCard case study SHALL include a "Delivery engineering" section. Each internal tool in it (customer-to-internal Jira sync, release-note automation, source-control traceability controls, the estimation template, delivery analytics) SHALL be tied to the delivery problem it removed.

The JPMorgan Chase case study SHALL present two measurements separately:
- the FNMA monthly-file workload, reduced from about 20–24 days to about 2 days
- the roughly 4× throughput measured across the whole system

It SHALL NOT present either as derived from the other.

#### Scenario: Programme case study structure
- **WHEN** a visitor opens the IFC case study
- **THEN** it shows the inherited situation, the actions (release windows, weekly management review, Remedy visibility), and the outcomes, including no contractual SLA breaches and the internal 2013 Project of the Year

#### Scenario: Two JPMorgan Chase measurements
- **WHEN** a visitor reads the JPMorgan Chase case study
- **THEN** the FNMA reduction and the system-wide 4× appear as distinct results, each with what it measured

### Requirement: Project kinds on Work
Every project SHALL be either a programme or a tool. `/work` SHALL list programmes before tools and SHALL offer a kind filter synced to the URL, alongside the existing domain and stack filters. Each tool's summary SHALL lead with the delivery problem or outcome and name technology second.

#### Scenario: Kind filter link
- **WHEN** a visitor opens `/work?kind=programme`
- **THEN** only the three programme case studies are listed, and the Programmes filter shows as selected

#### Scenario: Tool summary leads with the problem
- **WHEN** a visitor reads a tool card
- **THEN** its first sentence states the delivery question or friction it addresses, before any technology

### Requirement: Home story order
Home SHALL present, in this order:
1. hero
2. Programme Line
3. proof ledger
4. "Programmes I've led": the three programme case studies
5. "Delivery tools": three tools
6. the Ask question input, with starter questions about programmes and delivery
7. the contact band

Home SHALL NOT show a separate band of personal or separately hosted projects. Those remain listed on `/work`.

#### Scenario: Programmes before tools
- **WHEN** a visitor scrolls Home
- **THEN** the programme case studies appear before any tool, and no blog, knowledge-base or OAuth card appears on Home

### Requirement: Experience copy
Each role's outcomes SHALL describe what the owner led and what changed, in the voice of the programme case studies. The roles SHALL keep eight UK banking clients and the 150+ people brought through the Agile delivery model. That coaching figure SHALL appear only as a CoreCard Experience outcome. The CoreCard case study SHALL state the separate figure of approximately 150 people as the major card programme's peak Development + QA + PMO population. No page SHALL present one figure as the other, and the two SHALL NOT appear in the same paragraph. The CoreCard role SHALL keep its formal title, Principal Project Analyst. Recognition SHALL say who gave it; Project of the Year is Cognizant internal recognition for the IFC portfolio.

#### Scenario: Two 150 figures stay apart
- **WHEN** a visitor reads the CoreCard Experience outcomes and the CoreCard case study
- **THEN** the 150+ coaching figure appears only on Experience, the ~150 peak appears only in the case study labelled as peak Development + QA + PMO population, and neither appears on the proof ledger

#### Scenario: Scoped recognition
- **WHEN** a visitor reads the credentials ledger
- **THEN** Project of the Year (2013) is identified as internal recognition for the IFC portfolio, not as an external award

### Requirement: About page
`/about` SHALL present the owner's story as a career arc:
1. engineer
2. learning how complex financial systems work
3. technical and delivery leadership
4. customers, commercial commitments and programme risk
5. improving the delivery system itself

It SHALL also present "How I lead": four principles, each with one concrete proof point drawn from a role or case study. The About page SHALL NOT be marked as draft and SHALL be part of Ask's corpus.

#### Scenario: Principles carry evidence
- **WHEN** a visitor reads a principle on `/about`
- **THEN** it is followed by a specific example from the owner's experience

#### Scenario: No draft marking
- **WHEN** a visitor opens `/about`
- **THEN** no "Draft copy" or "Placeholder copy" marking appears, and Ask can answer from the story

### Requirement: Confidentiality and accuracy guard
Content, rendered pages and generated indexes (`search-index.json`, `ai-context.json`) SHALL NOT contain:
- client or product names not cleared for publication (Goldman Sachs, Apple, Apple Card)
- internal programme codenames (Cookie, Jazz)
- currency amounts
- revenue, pricing or P&L figures
- the misspelling "FNAM"
- any claim that the owner built or delivered a client's card or payment product

CoreCard work SHALL be described without naming the client, for example "a major US consumer card programme". The build SHALL fail, naming the file and term, when a denylisted term appears.

#### Scenario: Denylisted term blocks the build
- **WHEN** a project file mentions "Goldman Sachs"
- **THEN** the content build fails and names the file and the term

#### Scenario: Currency figure blocks the build
- **WHEN** a role outcome contains "$40M"
- **THEN** the content build fails and names the file

### Requirement: Unconfirmed facts are omitted
A fact the owner has not confirmed SHALL NOT be published. In particular, the JPMorgan Chase case study SHALL NOT name individual data vendors other than FNMA, written "FNMA (Fannie Mae)" and never described as Freddie Mac. It SHALL describe the other sources generically until the owner confirms them.

#### Scenario: Vendors kept generic
- **WHEN** a visitor reads the JPMorgan Chase case study
- **THEN** it refers to multiple external market and reference-data sources, and names FNMA only as the worked example
