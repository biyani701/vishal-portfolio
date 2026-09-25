## Purpose

Guarantees that every route renders correctly in four mutually exclusive layout modes (compact landscape, mobile, tablet, desktop), with a shell whose header never hides content and safe areas that are respected.

## ADDED Requirements

### Requirement: Layout modes
The site SHALL classify the viewport into exactly one mode:
- `compact-landscape`: landscape and height ≤ 500 CSS px
- `mobile`: width < 600, and not compact-landscape
- `tablet`: 600 ≤ width < 900, and not compact-landscape
- `desktop`: width ≥ 900, and not compact-landscape

The modes SHALL be defined once as Tailwind variants. JS mode detection SHALL use the same definitions, and only where the DOM differs.

#### Scenario: Large phone in landscape
- **WHEN** the viewport is 932×430
- **THEN** the mode is compact-landscape and no desktop rule applies

#### Scenario: Tablet in landscape
- **WHEN** the viewport is 1024×768
- **THEN** the mode is desktop

### Requirement: Shell sizing
The header SHALL be 64px (desktop and tablet), 56px (mobile) and 44px (compact landscape). The footer SHALL be static, not fixed. Content SHALL never render beneath the header, and in-page anchors SHALL scroll to below the header.

#### Scenario: Anchor navigation
- **WHEN** a visitor follows a link to a section anchor at 844×390
- **THEN** the section heading is fully visible below the 44px header

### Requirement: No horizontal overflow
No route SHALL scroll horizontally at 320×568, 375×667, 390×844, 568×320, 844×390, 932×430, 768×1024, 1024×768 or 1440×900. Only code blocks and data tables may scroll inside their own container.

#### Scenario: Viewport matrix
- **WHEN** the Playwright matrix runs across every route and viewport
- **THEN** `scrollWidth` never exceeds the viewport width

### Requirement: Touch targets and safe areas
Interactive targets SHALL be at least 44×44 CSS px on touch layouts. Content and controls SHALL stay within the device safe areas, using `viewport-fit=cover` and safe-area insets.

#### Scenario: Notched phone in landscape
- **WHEN** a phone with a side cutout is in landscape
- **THEN** no text or control falls inside the cutout inset

### Requirement: Mode-specific compositions
Each surface SHALL use the composition defined for each mode in §7 of the frozen design package. For example, Ask is a right Drawer at about 60% width in compact landscape, a bottom Drawer on mobile, and the `/ask` page on tablet and desktop.

#### Scenario: Ask on a landscape phone
- **WHEN** a visitor opens Ask at 844×390
- **THEN** Ask opens as a right-side drawer and the current page stays visible to its left
