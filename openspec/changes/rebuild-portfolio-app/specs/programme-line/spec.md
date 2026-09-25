## Purpose

Specifies the Programme Line, the signature component that presents the career as a programme with engagements, status and milestones, across every layout mode and in an accessible form.

## ADDED Requirements

### Requirement: Data fidelity
The Programme Line SHALL be generated only from role and milestone dates in the content layer, on a shared axis from 2000 to the current year. Nothing is estimated or hand-positioned.

#### Scenario: Role dates change
- **WHEN** a role's end date is edited in the content layer
- **THEN** every Programme Line form reflects it on the next build

### Requirement: Forms by layout mode
The component SHALL render:
- **desktop and tablet:** swimlanes by organisation, with labelled segments, a milestone row and an axis
- **compact-landscape:** labelled lanes as one summary figure that links to Experience
- **mobile:** span rows, one per engagement, each with dates, title and a full-width track on the shared axis

No form requires horizontal page scrolling.

#### Scenario: 320px phone
- **WHEN** Home renders at 320×568
- **THEN** every engagement appears as a span row at least 56px tall, and the chronology is readable without horizontal scrolling

### Requirement: Labels and milestone clustering
A segment label SHALL render inside its segment only when it fits with 8px padding; otherwise it renders outside. Milestone markers whose centres are less than 12px apart SHALL merge into a numbered cluster, with the full milestone list printed beneath.

#### Scenario: Close milestones
- **WHEN** the 2020 and 2021 milestones fall within 12px of each other on a narrow track
- **THEN** a single "◆2" cluster is shown and both milestones are listed in text

### Requirement: Status and selection
The current engagement SHALL use the In-flight style, and earlier engagements the Delivered style. On Experience, selecting a segment or row SHALL update the role panel and mark the selection with the Selected style. Previous/next controls SHALL move between roles.

#### Scenario: Select a role
- **WHEN** a visitor activates the BFS UK segment on Experience
- **THEN** the BFS UK role details appear, and the segment shows the Selected style and `aria-current`

### Requirement: Accessible alternative
Every form SHALL offer "View as table" (period, engagement, status) and an `aria-label` summary. Segments and rows SHALL be links or buttons. Tooltips SHALL never be the only source of information.

#### Scenario: Screen reader
- **WHEN** a screen-reader user reaches the Programme Line
- **THEN** they hear a summary and can open the table alternative
