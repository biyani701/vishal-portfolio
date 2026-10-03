## Purpose

Makes the Programme design tokens and self-hosted fonts one workspace package. Every site in the monorepo uses the same values and files, and the portfolio's appearance and loading behaviour stay exactly as they are.

## ADDED Requirements

### Requirement: One source for tokens and fonts
The design tokens (colours, type scale, spacing, layout-mode variants and theme variants), the font-face declarations, the font files and their licences SHALL live in one workspace package. `apps/web` and `apps/hub` SHALL consume that package. Neither app SHALL keep its own copy of the token definitions in source control.

#### Scenario: A token changes once
- **WHEN** a colour token is changed in the design package
- **THEN** both the portfolio and the hub use the new value on their next build, with no edit in either app

### Requirement: Portfolio unchanged
Moving the tokens and fonts into the package SHALL NOT change the portfolio's output:
- Every app serves fonts at the same `/fonts/<name>.woff2` URLs, so the portfolio's preload links keep working.
- The portfolio's existing token, UI-class, font and layout tests SHALL pass unchanged except for the file paths they read.

#### Scenario: Fonts at stable URLs
- **WHEN** the portfolio is built after the move
- **THEN** `dist/fonts/` contains the same font files, byte for byte, as before, and the preload links in `index.html` resolve

#### Scenario: Same styles
- **WHEN** the portfolio's token and UI-class tests run after the move
- **THEN** they pass against the package's `tokens.css`
