## Purpose

Defines Ask, the AI capability for exploring the portfolio: its entry points, surfaces, answer structure, activity and error states, sources, confirmation of outward actions, and accessibility.

## ADDED Requirements

### Requirement: Entry points
Ask SHALL be reachable from the "Ask" navigation item, the command palette's "Ask: {query}" option, "Ask about this" links on content pages (which pass page context), and the Home question input. There SHALL be no floating launcher button, and Ask SHALL never open automatically.

#### Scenario: Contextual ask
- **WHEN** a visitor activates "Ask about this" on the Fast-JiraQL case study
- **THEN** Ask opens with the project as context and a suggested question

### Requirement: Surfaces by mode
Ask SHALL render as:
- the `/ask` page with a sources rail (desktop)
- the `/ask` page (tablet)
- a bottom Drawer with full-height snap (mobile)
- a right Drawer at about 60% width (compact landscape)

The conversation state SHALL persist across surfaces within a session.

#### Scenario: Rotate during a conversation
- **WHEN** a phone rotates from portrait to landscape while Ask is open
- **THEN** the same conversation continues in the right-side drawer

### Requirement: Answer structure
- Each question SHALL render as a heading, and each answer as serif prose.
- Answers over about 150 words SHALL begin with a one-sentence summary, then use sub-headings.
- Tool results SHALL render with site components (project, role, Programme Line excerpt).
- There SHALL be no avatar, persona or chat bubbles.

#### Scenario: Engineering projects question
- **WHEN** a visitor asks which projects show hands-on engineering
- **THEN** the answer includes compact project cards that link to the case studies

### Requirement: Grounding and sources
Answers SHALL use only published content, via the agent's tools. Answers SHALL cite with superscript numbers.
- Sources are grouped by section.
- On desktop, sources stay in view.
- On mobile and compact landscape, sources collapse into a "N sources" disclosure showing the first four.
- When nothing can be cited, the sources area says so.

#### Scenario: Question outside the site
- **WHEN** a visitor asks about the owner's salary expectations
- **THEN** Ask says the site doesn't cover it and suggests Contact, without inventing an answer

### Requirement: Activity presentation
Each agent step SHALL show one activity line: a StatusChip (In flight, Done or Failed) and a plain-language sentence, with a "Details" disclosure revealing the tool name, arguments and duration. Raw model reasoning MUST NOT be shown.

#### Scenario: Running step
- **WHEN** the agent is searching roles
- **THEN** an In-flight line reads "Looking through roles…" and Details shows the tool call

### Requirement: Failure, interruption and recovery
- A failed step SHALL show Failed with an inline Retry, and the answer SHALL state what it couldn't do.
- An interrupted stream SHALL keep the partial answer, marked Incomplete, with Try again and Copy.
- The composer SHALL offer Stop while streaming.
- A "Jump to latest" control SHALL appear when the reader has scrolled away from the newest content.

#### Scenario: Connection drops
- **WHEN** the connection fails mid-answer
- **THEN** the partial text stays, is marked Incomplete, and Try again resends the question

### Requirement: Outward actions need confirmation
Any action that sends data off the site (a contact request) SHALL be proposed as an inline confirmation form. The form lists exactly what will be sent and requires "Send request".
- If an earlier step failed, the form SHALL stay usable, SHALL say what was left out, and MUST NOT include unverified content.
- If sending fails, the form SHALL keep its values and offer "Try again" and "Open the contact form instead".

#### Scenario: Failure alongside confirmation
- **WHEN** the Experience lookup fails while the agent drafts a contact request
- **THEN** the draft excludes role details, shows a notice saying so, and can still be sent

### Requirement: Accessibility
Ask SHALL announce politely: answer started, each step's status change, and "Answer complete, N sources". Send failures SHALL be announced assertively. Tokens MUST NOT be announced individually.
- The streaming region SHALL set `aria-busy`.
- Focus SHALL return to the composer after sending.
- All controls SHALL be keyboard operable.

#### Scenario: Screen reader session
- **WHEN** a screen-reader user asks a question
- **THEN** they hear "Answer started", step updates and "Answer complete, 3 sources", and not the streamed words one by one

### Requirement: Privacy of conversations
Conversations SHALL be kept only in the visitor's browser (thread history). The server SHALL NOT store message content beyond what operational logs require, and those logs SHALL exclude personal data.

#### Scenario: New device
- **WHEN** the visitor opens Ask on another device
- **THEN** previous conversations are not present
