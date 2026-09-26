## Purpose

Defines how visitors move through the site: primary navigation in each layout mode, the ⌘K search-and-ask palette, footer, theme control, legacy-URL redirects and the not-found page.

## ADDED Requirements

### Requirement: Primary navigation
Navigation SHALL offer Work, Experience, Writing, Knowledge, About, Ask, search and Contact.
- **Desktop:** an inline bar.
- **Tablet, mobile and compact landscape:** a menu button opening a Drawer, which also contains the theme control.

The current section SHALL be indicated.

#### Scenario: Mobile menu
- **WHEN** a visitor on a 390px phone opens the menu and selects Writing
- **THEN** the drawer closes, `/writing` loads, and focus moves to the page heading

### Requirement: Command palette
⌘K / Ctrl+K and the search field SHALL open a palette. It searches pages, projects, articles and glossary terms from the build-time index, and always offers "Ask: {query}" as the last option.

#### Scenario: Search to Ask
- **WHEN** a visitor types "fixed price" and chooses the Ask option
- **THEN** Ask opens with "fixed price" as the question

### Requirement: Redirects for legacy URLs
Every route from the current site SHALL either keep its path or redirect (client-side `replace`) to its new route, per the route migration map in `design/exploration/02-information-architecture.md`. Examples: `/works` → `/work`, `/blogs/:id` → `/writing/:slug`, `/credits` → `/colophon`, `/privacy` → `/legal/privacy`.

The site has no sign-in, so the old sign-in, account and auth callback URLs SHALL redirect to `/`, overriding their rows in the route map. These are `/signin`, `/signin-legacy`, `/signin-toolpad`, `/login`, `/logout`, `/profile`, `/account`, `/auth-callback`, `/auth-callback.html`, `/auth-success`, `/auth-error`, `/callback` and `/api/auth/callback/*`.

#### Scenario: Old link
- **WHEN** a visitor opens `/blogs/ai-agents`
- **THEN** they land on `/writing/ai-agents`, and the back button does not return to the old URL

#### Scenario: Old sign-in link
- **WHEN** a visitor opens `/signin?from=/work` or `/profile`
- **THEN** they land on `/`, and no sign-in or account control appears in the header, drawer or footer

### Requirement: Not found
Unknown routes SHALL render a 404 page within the shell, offering search, Ask and links to the main sections.

#### Scenario: Unknown path
- **WHEN** a visitor opens `/nope`
- **THEN** the 404 page renders with a working search field

### Requirement: Developer routes
Diagnostic pages SHALL exist only in development builds, under `/_dev`.

#### Scenario: Production
- **WHEN** a visitor opens `/_dev` on the production site
- **THEN** the 404 page renders
