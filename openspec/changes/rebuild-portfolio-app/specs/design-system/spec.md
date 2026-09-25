## Purpose

Defines the Programme visual system (tokens, themes, typography, status language, motion, iconography and portrait rules) and which UI pieces are Base UI primitives versus application-owned compositions.

## ADDED Requirements

### Requirement: Single token source
All colours, type sizes, spacing, radii, shadows, durations and layout-mode variants SHALL be defined once, in `src/design/tokens.css` (Tailwind `@theme` plus light/dark sets), with the values in `design/exploration/11-final-design-package.md` §4. Components MUST NOT use raw colour values or arbitrary Tailwind values outside `src/design/` and `src/ui/`.

#### Scenario: Arbitrary value
- **WHEN** a page component uses `text-[#2447D9]` or `p-[13px]`
- **THEN** lint fails

### Requirement: Themes
The site SHALL follow the operating-system colour scheme by default, with light as the fallback. It SHALL offer a three-way control (light / dark / system), persisted via the consent-gated preference cookie with a local-storage fallback. The dark theme SHALL use its own designed token set.

#### Scenario: First visit on a dark-mode device
- **WHEN** a visitor with `prefers-color-scheme: dark` opens the site with no saved preference
- **THEN** the dark token set is applied before first paint, without a flash of the light theme

#### Scenario: Contrast
- **WHEN** automated contrast checks run on every route in both themes
- **THEN** body text is at least 4.5:1 and large text and UI boundaries are at least 3:1

### Requirement: Typography roles
Headings and UI SHALL use Bricolage Grotesque, long-form text and AI answers SHALL use Newsreader, and dates, chips and technical detail SHALL use JetBrains Mono, all self-hosted with fallback stacks. The type scale SHALL follow §4.2 of the frozen package.

#### Scenario: Font failure
- **WHEN** a web font fails to load
- **THEN** text renders immediately in the fallback stack and remains readable

### Requirement: Status language
Status SHALL be shown with the shared StatusChip vocabulary: Delivered, In flight, Done, Failed, Answer complete, Selected. Every chip carries text. Amber styling SHALL be used only for "In flight".

#### Scenario: Current role and running AI step
- **WHEN** the current role and a running AI tool step are both visible
- **THEN** both use the same In-flight chip style

### Requirement: Portrait usage
The portrait SHALL appear only in the Home hero (4:5, natural colour). It MUST NOT appear beside AI output or on other pages.

#### Scenario: Ask page
- **WHEN** Ask renders an answer
- **THEN** no portrait or avatar of the owner is shown

### Requirement: Motion
Motion SHALL use the tokenised durations, with content visible without JavaScript. Under `prefers-reduced-motion: reduce`, all transitions SHALL be instant and the streaming caret static.

#### Scenario: Reduced motion
- **WHEN** reduced motion is on and a drawer opens
- **THEN** it appears without sliding

### Requirement: Primitive ownership
Dialog, Drawer, Popover, PreviewCard, Menu, ContextMenu, NavigationMenu, Autocomplete, Combobox, Select, Tabs, Tooltip, Toast, Collapsible, Accordion, the Field/Form controls, ToggleGroup, ScrollArea, Button and Separator SHALL be Base UI-based components in `src/ui/`, each with keyboard/focus contract tests. Product elements (ProgrammeLine, StatusChip, cards, layouts, the Ask components) SHALL be application-owned compositions.

#### Scenario: Drawer contract
- **WHEN** a Drawer opens and the user presses Tab repeatedly, then Escape
- **THEN** focus stays inside the drawer, then returns to the element that opened it
