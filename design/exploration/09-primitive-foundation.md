# 09 — Primitive Foundation (UF-3): Radix vs Base UI vs React Aria

> **Status: ACCEPTED 2026-09-25 — Base UI (`@base-ui/react` 1.x) is the behavioral primitive layer**, with `@react-aria/live-announcer` for AI live regions.
> The guardrails in "Making Base UI work well with Claude Code" below are **binding** for the implementation:
> - no `@radix-ui/*`, `radix-ui`, `vaul`, `cmdk` or `@base-ui-components/react` in app code (lint-enforced)
> - `render` prop, never `asChild`
> - primitives are added with `shadcn add` after `shadcn init --base base`, with source in `src/ui/`
> - keyboard/focus contract tests for Dialog, Drawer, Menu, Autocomplete and Popover
>
> Also recorded as beads memory `portfolio-rewrite-ui-foundation-accepted-2026-09-25`. The CLAUDE.md rule block is added in roadmap Phase 2, when `src/ui/` is created.

Context: UF-1 (shadcn/ui + Tailwind v4) and UF-2 (modern browser floor) are **accepted**. The shadcn CLI supports all three candidates (`shadcn init --base radix | base | aria`, verified in `shadcn@4.21.0`). This decision picks the layer that supplies behaviour, accessibility and focus management underneath our components. Facts were checked on npm / package contents on 2026-09-25.

## Snapshot

| | **Radix** (`radix-ui`) | **Base UI** (`@base-ui/react`) | **React Aria** (`react-aria-components`) |
|---|---|---|---|
| Latest | 1.6.7 (2026-07-24) | 1.8.0 (2026-09-04) | 1.21.1 (2026-09-04) |
| Stable since | 1.0 Dec 2022 | **1.0 Dec 2025**; renamed from `@base-ui-components/react` | 1.0 Dec 2023 (hooks `react-aria` since 2020) |
| Releases, last 12 months | 9 (patch/minor) | 10 (feature minors) | 11 |
| Steward | WorkOS | MUI team, with authors of Radix and Floating UI | Adobe (powers React Spectrum) |
| React 19 peer | ✔ | ✔ | ✔ |
| Composition API | `asChild` + `Slot` | `render` prop | render props + `className`/`style` functions, `data-*` states |
| Drawer | ✘ (shadcn uses **vaul**, last release **Dec 2024**) | ✔ native `Drawer` | ✘ (Modal only; gestures are yours) |
| Command / autocomplete | ✘ (shadcn uses **cmdk**, last release **Mar 2025**) | ✔ `Autocomplete`, `Combobox` | ✔ `Autocomplete` (wraps Menu/ListBox) |
| Toast | ✔ | ✔ | ⚠ `UNSTABLE_Toast*` |
| Menus | DropdownMenu, ContextMenu, Menubar, NavigationMenu | Menu, ContextMenu, Menubar, NavigationMenu | Menu, SubmenuTrigger (long-press on touch) |

All three have dialog/alert-dialog, popover, tooltip and tabs.

## Criterion by criterion

| Criterion | Radix | Base UI | React Aria |
|---|---|---|---|
| **Accessibility** | Good WAI-ARIA patterns; some long-standing edge cases with modal layering and pointer-events on `body` | Strong; written by people who built Radix and Floating UI, with the lessons applied | **Best in class.** Adobe-tested across screen readers and mobile AT, i18n/RTL, `announce()` live regions |
| **React 19** | ✔ | ✔ | ✔ (none is a differentiator) |
| **Keyboard interaction** | Roving focus, typeahead | Roving focus, typeahead, composite navigation | **Most thorough**: keyboard-only focus rings (`useFocusRing`), consistent press semantics across mouse, touch, keyboard and virtual cursor |
| **Dialogs** | Solid | Solid; `initialFocus`/`finalFocus` props, nested dialogs, animations via data attributes | Solid; `Modal`/`ModalOverlay`; dismiss handling is very precise |
| **Popovers** | Floating UI underneath | Floating UI **by its authors**; best collision/anchoring controls | Own positioning engine; good |
| **Menus** | Complete, including submenus | Complete, including submenus, Menubar, context menu | Complete; long-press menus on touch |
| **Command interfaces (⌘K)** | Depends on **cmdk** (no release in 18 months) | Native `Autocomplete` inside `Dialog` | Native `Autocomplete` + `Menu`: the intended command-palette pattern |
| **Focus management** | FocusScope, auto-focus hooks | Trap/restore via props; good | **Most granular** (`FocusScope`, `useFocusManager`, virtual focus for comboboxes) |
| **Mobile drawers** | Depends on **vaul** (no release in 21 months) | **Native `Drawer`** | None; swipe, snap and iOS scroll-lock would be ours to build |
| **AI interaction components** (streamed message list, tool-call disclosure, confirmation forms, suggestion chips, toasts, live announcements) | Collapsible, ToggleGroup, Toast; weak form primitives | Collapsible, ToggleGroup, **Field/Form with validation**, stable Toast | Disclosure, forms (best), **`announce()` for streaming**; Toast unstable |
| **Long-term maintenance** | Maintained, but no first-party drawer, combobox or command; key shadcn dependencies are stale | **Most active trajectory** (1.0 → 1.8 in 9 months), MUI-funded | **Most proven** (Adobe, 5+ years, steady cadence) |
| **Claude Code support** | **Best**: years of shadcn/Radix examples in training data | Weakest: 1.0 is recent and the package was renamed, so models may produce pre-1.0 or `@base-ui-components/react` APIs | Good: long-lived, well documented, but a large API surface |

## Scorecard

These weights are judgement calls. React 19 is a pass/fail gate that all three pass, so it's weighted 0.

| Criterion | Weight | Radix | Base UI | React Aria |
|---|---:|:-:|:-:|:-:|
| Accessibility | 15 | 4 | 4 | **5** |
| Keyboard interaction | 10 | 4 | 4 | **5** |
| Focus management | 10 | 4 | 4 | **5** |
| Dialogs | 5 | 4 | **5** | 4 |
| Popovers | 5 | 4 | **5** | 4 |
| Menus | 5 | 4 | **5** | **5** |
| Command interfaces | 10 | 2 | **4** | **4** |
| Mobile drawers | 10 | 2 | **4** | 2 |
| AI interaction components | 10 | 3 | **4** | **4** |
| Long-term maintenance | 10 | 3 | **5** | **5** |
| Claude Code support | 5 | **5** | 3 | 4 |
| Fit with shadcn + Tailwind (UF-1) | 5 | **5** | 4 | 3 |
| **Weighted total** | 100 | **70** | **84** | **85** |

The numbers put **Base UI and React Aria in a near-tie**, with Radix clearly third. The tie is broken by the surfaces this project actually has to build.

## Recommendation: **Base UI** (`shadcn init --base base`)

1. **The surfaces we've designed depend on a drawer and a command palette.** The mobile nav, the Ask sheet on mobile and the compact-landscape drawer all need a drawer, and ⌘K search/Ask needs an autocomplete. Base UI ships both natively, with Toast and Field/Form. React Aria would make us build the drawer ourselves (gestures, snap points, iOS scroll-lock), which is the riskiest component in exactly the area where the current site fails. Radix would make us depend on vaul and cmdk, both unreleased for over a year.
2. **Maintenance trajectory.** Base UI is the actively developed successor from the people behind Radix and Floating UI. It has shipped 8 feature releases since 1.0.
3. **Accessibility gap to React Aria is small and closable.** We adopt one React Aria utility where it is clearly better: `@react-aria/live-announcer` (or an equivalent `aria-live` region) for announcing streamed AI answers and tool status. We don't adopt the full library.

**Why not Radix, reversing my earlier lean:** that lean rested on matching CopilotKit v2's stack. We use CopilotKit's **headless** hooks, so the match buys little; CopilotKit's internal Radix dependencies ship either way and don't conflict. Against that, Radix's drawer and command pieces are the two stalest dependencies in the shadcn ecosystem.

**When React Aria would be the right call instead:** accessibility certification (e.g. a WCAG audit for an employer or client) matters more than build effort, and you're willing to build and own the drawer. It's a reasonable choice; it's just not the pragmatic one here.

## Making Base UI work well with Claude Code

Base UI is the weakest of the three for AI-assisted coding, so these are part of the recommendation:
1. **Source in the repo.** shadcn copies each component's source into `src/ui/`, so Claude edits real, current code instead of recalling APIs.
2. **A CLAUDE.md rule block:**
   - Base UI 1.x from `@base-ui/react`.
   - Composition uses the `render` prop, never Radix's `asChild`.
   - Link to the Base UI docs.
   - Don't hand-write primitives; add them with `shadcn add`.
3. **Lint guards:**
   - `no-restricted-imports` bans `@base-ui-components/react` (the old name), `@radix-ui/*`, `vaul` and `cmdk` in app code.
   - A custom rule flags `asChild` props.
4. **Contract tests:** keyboard and focus tests for Dialog, Drawer, Menu, Autocomplete and Popover, written once in `ui/`. They catch regressions when components or upgrades change.

## Knock-on updates (once you accept)
- `05-component-architecture.md`: "Radix supplies behaviour" → "Base UI supplies behaviour". NavDrawer and the Ask sheet use `Drawer`; ⌘K uses `Autocomplete` in `Dialog`; Toast is Base UI.
- `08-ui-foundation.md`: UF-3 resolved to Base UI.
- The roadmap is unchanged. Phase 2 adds the `ui/` contract tests and the CLAUDE.md block.

## Decision requested
| ID | Decision | Recommendation |
|---|---|---|
| UF-3 | Primitive layer | **Base UI**, plus `@react-aria/live-announcer` for AI live regions — **accepted 2026-09-25** |
