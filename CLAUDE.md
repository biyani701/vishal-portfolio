# Project Instructions for AI Agents

This file provides instructions and context for AI coding agents working on this project.

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:46cd31e7 -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See https://github.com/gastownhall/beads/blob/main/docs/core-concepts/sync-concepts.md for details and anti-patterns.

## Agent Context Profiles

The managed Beads block is task-tracking guidance, not permission to override repository, user, or orchestrator instructions.

- **Conservative (default)**: Use `bd` for task tracking. Do not run git commits, git pushes, or Dolt remote sync unless explicitly asked. At handoff, report changed files, validation, and suggested next commands.
- **Minimal**: Keep tool instruction files as pointers to `bd prime`; use the same conservative git policy unless active instructions say otherwise.
- **Team-maintainer**: Only when the repository explicitly opts in, agents may close beads, run quality gates, commit, and push as part of session close. A current "do not commit" or "do not push" instruction still wins.

## Session Completion

This protocol applies when ending a Beads implementation workflow. It is subordinate to explicit user, repository, and orchestrator instructions.

1. **File issues for remaining work** - Create beads for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **Handle git/sync by active profile**:
   ```bash
   # Conservative/minimal/default: report status and proposed commands; wait for approval.
   git status

   # Team-maintainer opt-in only, unless current instructions forbid it:
   git pull --rebase
   bd dolt push
   git push
   git status
   ```
5. **Hand off** - Summarize changes, validation, issue status, and any blocked sync/commit/push step

**Critical rules:**
- Explicit user or orchestrator instructions override this Beads block.
- Do not commit or push without clear authority from the active profile or the current user request.
- If a required sync or push is blocked, stop and report the exact command and error.
<!-- END BEADS INTEGRATION -->


## Build & Test

_Add your build and test commands here_

```bash
# Example:
# npm install
# npm test
```

## Architecture Overview

_Add a brief overview of your project architecture_

## Conventions & Patterns

<!-- BEGIN UI RULES (apps/web) -->
## UI rules (apps/web)

Binding for all UI work in `apps/web` (UF-1 to UF-3: `design/exploration/09-primitive-foundation.md`, `design/exploration/11-final-design-package.md`). Lint and tests enforce most of these; keep this block identical in `CLAUDE.md` and `AGENTS.md`.

- **Primitives:** Base UI 1.x from `@base-ui/react` (docs: https://base-ui.com/react/overview/quick-start). Only `src/ui/` imports it; app code imports the `src/ui` component.
- **Never use:** `@radix-ui/*`, `radix-ui`, `vaul`, `cmdk` or `@base-ui-components/react`. `pnpm --filter web lint` also checks the whole dependency tree (`scripts/check-deps.mjs`).
- **Composition:** use the `render` prop, never `asChild`.
- **Adding a primitive:** run `pnpm dlx shadcn@latest add <name>` in `apps/web` (`components.json` targets Base UI and writes to `src/ui/`); don't hand-write primitives. Then remap shadcn's classes to Programme tokens (`src/ui/ui-classes.test.ts` fails on any class the theme doesn't define) and add a `*.contract.test.tsx` for anything interactive.
- **Styling:** tokens only, from `src/design/tokens.css` (Tailwind `@theme`). No raw colours or arbitrary values (`p-[13px]`, `text-[#2447D9]`, `p-(--gap)`) outside `src/design/` and `src/ui/`. Width breakpoints are removed: use the layout-mode variants `mobile:`, `tablet:`, `desktop:` and `compact-landscape:`; `dark:` follows `data-theme`.
- **Class merging:** import `cn` from `@/lib/utils` (configured with the Programme scales), never from the `cn` package.
- **Targets and focus:** interactive targets are at least 44px (`hit-target` for compact controls). Keep the global focus-visible outline; don't add `outline-none` to focusable controls.
- **Product rules:** status uses `StatusChip` (amber means In flight only); the Portrait is Home-hero only (DD-4, lint-enforced); there is no AI icon, because Ask is the word "Ask".
- **Checking your work:** `/_dev/ui` on the dev server shows every component in both themes; `pnpm --filter web test` runs the unit, contract and axe tests.
<!-- END UI RULES (apps/web) -->
