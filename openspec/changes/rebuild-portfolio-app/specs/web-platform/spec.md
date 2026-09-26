## Purpose

Defines how the rebuilt portfolio front end (`apps/web`) is built, configured, checked and deployed, including the dependency guardrails that keep it on the accepted foundation.

## ADDED Requirements

### Requirement: Accepted foundation only
`apps/web` SHALL be built with React 19, Vite, Tailwind CSS v4 and shadcn/ui components generated on Base UI primitives. App code MUST NOT import `@radix-ui/*`, `radix-ui`, `vaul`, `cmdk`, `@base-ui-components/react`, `@mui/*`, `bootstrap`, `aos`, FontAwesome or `react-icons`. Only files under `src/ui/` may import `@base-ui/react`.

#### Scenario: Forbidden import
- **WHEN** a file outside `src/ui/` imports `@base-ui/react`, or any file imports a forbidden package
- **THEN** `pnpm --filter web lint` fails and names the file and package

#### Scenario: Composition API
- **WHEN** a component passes an `asChild` prop
- **THEN** lint fails with a message to use the `render` prop

### Requirement: Browser support floor
The production build SHALL support Safari 16.4+, Chrome 111+ and Firefox 128+ and MAY use CSS features available in them.

#### Scenario: Supported browser
- **WHEN** the site is opened in Safari 16.4
- **THEN** every route renders with the correct layout mode and theme

### Requirement: Build output and hosting
`pnpm --filter web build` SHALL emit a static site to `apps/web/dist`, including `CNAME`, `404.html` (deep-link restore), `runtime-config.js` and all public assets. It SHALL deploy to GitHub Pages at `vishal.biyani.xyz`.

#### Scenario: Deep link
- **WHEN** a visitor opens `https://vishal.biyani.xyz/work/fast-jiraql` directly
- **THEN** the case study renders without a visible redirect loop

### Requirement: Configuration
Client configuration SHALL come from `VITE_*` build variables, overridable at runtime by `runtime-config.js`. The configuration covers the API base URL and the analytics settings. The build SHALL fail if a required variable is missing. No secret may be embedded in the bundle.

#### Scenario: Missing variable
- **WHEN** a production build runs without `VITE_API_BASE_URL`
- **THEN** the build exits non-zero naming the variable

### Requirement: Quality gates
CI SHALL run lint, type-check, unit tests, the `src/ui` contract tests, build, and the Playwright viewport matrix on every pull request to `main`, using pnpm on Node 22 LTS. Deployment SHALL happen only from `main` after all gates pass.

#### Scenario: Failing gate
- **WHEN** a contract test for Drawer focus-trapping fails
- **THEN** the pull request check fails and nothing is deployed
