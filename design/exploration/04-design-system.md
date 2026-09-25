# 04 — Visual Foundation: "Programme"

> **Final:** consolidated in `11-final-design-package.md`, which takes precedence (it includes the final dark tokens, Programme Line rules and the added compositions).

**Status:** proposed with DD-1…DD-4 (see `10-design-decision.md`). This supersedes the earlier "hybrid" token draft, which assumed MUI.
**Form:** conceptual design tokens for **Tailwind CSS v4**. One `src/design/tokens.css` holds the `@theme` block plus light and dark variable sets, and shadcn components consume those variables. No colour, size or font is written anywhere else (lint-enforced).
**Visual reference:** the Foundation artboard in the [Programme canvas](https://claude.ai/artifact/1sbFERUzCEWMfGJtMGxWso).

## Principles
1. **Plan, proof, status.** Structure reads like a well-run programme: ledger rules open sections, figures are tabular, and status is explicit.
2. **One accent, used for action.** Cobalt means "you can act on this". Amber means only "in flight", for a current role or a running AI task. Nothing else is coloured.
3. **Serif for reading, grotesk for doing.** Newsreader carries long-form and AI answers; Bricolage Grotesque carries UI and headings; mono carries dates and machine detail.
4. **Borders before shadows.** Surfaces are separated by hairlines. Shadow appears only on overlays (drawer, popover, dialog, menu).
5. **Every mode is composed.** Compact landscape, mobile, tablet and desktop each have deliberate layouts. Nothing just shrinks.

## Colour
All text pairs meet WCAG 2.2 AA (≥ 4.5:1 body, ≥ 3:1 large or UI). Neutrals carry a slight blue bias toward the accent.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-bg` | `#F4F6F8` | `#0D1015` | page ground |
| `--color-surface` | `#FFFFFF` | `#151A21` | cards, drawers, inputs |
| `--color-sunken` | `#ECEFF3` | `#10141A` | thumbnails, code headers, tool detail |
| `--color-border` | `#D7DCE3` | `#2A323D` | hairlines |
| `--color-ink` | `#0E131B` | `#E8ECF1` | text, 2px ledger rules |
| `--color-ink-2` | `#343B47` | `#C5CCD6` | long-form body |
| `--color-muted` | `#4A5361` | `#9AA4B2` | secondary text (≥ 4.5:1 on bg) |
| `--color-accent` | `#2447D9` | `#8FA6FF` | links, primary buttons, focus ring, Programme Line segments |
| `--color-accent-fill` | `#2447D9` | `#3558E6` | primary button background (white text in both themes) |
| `--color-accent-hover` | `#1A36A8` | `#A9BAFF` | hover/pressed |
| `--color-accent-soft` | `#E8EDFD` | `#1B2340` | selected rows, live-region hint, delivered segments |
| `--color-flight-fg` / `-bg` / `-dot` | `#8A4F00` / `#FCEFD8` / `#C27A0E` | `#F2B544` / `#3A2E14` / `#F2B544` | "In flight" chip: current role, running tool |
| `--color-success` | `#1E7A3A` | `#4ADE80` | "Done" where colour helps |
| `--color-error` / `-bg` | `#B42318` / `#FEF3F2` | `#F87171` / `#2A1414` | failures, validation |

Rules:
- **Status is never colour-only.** Every status has a text label in its chip.
- **Code blocks are dark in both themes** (`#121823`), with accent and amber syntax highlights.
- **Dark theme is designed, not inverted.** The accent lightens for text, the button fill stays saturated, and amber keeps its meaning.

## Typography

| Role | Family | Notes |
|---|---|---|
| Display + UI | **Bricolage Grotesque** (variable, opsz 12–96, wght 400–700) | Distinctive without being loud. Headings use 600 with −0.02 to −0.035em tracking |
| Long-form + AI answers + pull quotes | **Newsreader** (variable opsz, 400/500 + italic) | Case studies, articles, the Home lede, Ask answers |
| Data + machine detail | **JetBrains Mono** 400/500 | Dates, chips, kickers (uppercase, +0.06em), tool arguments, code |

Fonts are self-hosted as woff2 subsets with `font-display: swap`, preloading the display and serif families. Fallback stacks are `system-ui` / `Georgia` / `ui-monospace`.

| Token | Mobile → Desktop (clamp) | Line height | Weight |
|---|---|---|---|
| `text-display` | 40 → 72 | 1.0–1.02 | 600 |
| `text-h1` | 34 → 56 | 1.05 | 600 |
| `text-h2` | 26 → 36 | 1.1 | 600 |
| `text-h3` | 19 → 22 | 1.25 | 600 |
| `text-question` (Ask) | 22 → 30 | 1.2 | 600 |
| `text-lede` (serif) | 18 → 22 | 1.55 | 400 |
| `text-prose` (serif) | 18 → 20 | 1.65–1.7 | 400 |
| `text-body` | 15 → 16 | 1.5 | 400/500 |
| `text-label` | 13 → 14 | 1.4 | 500/600 |
| `text-mono-s` | 11 → 12 | 1.4 | 400/500, uppercase for kickers |

- Compact landscape uses the **mobile end** of every clamp, and display is capped at 32px.
- The reading measure is 60–70ch.
- Figures use `tabular-nums`.

## Spacing and sizing
- **Base:** a 4px scale (`0 4 8 12 16 20 24 32 40 48 64 72 96 128`).
- **Gutters:**
  - mobile 16
  - compact landscape 24
  - tablet 32
  - desktop 64
  - safe-area insets added on top
- **Section rhythm:**
  - desktop 96
  - tablet 72
  - mobile 32–48
  - compact landscape 24
- **Containers:** content 1312 (1440 − 2×64), reading 720, Ask conversation 8 of 12 columns.
- **Control heights:** 40 (dense desktop), 44 (default, the minimum touch target), 48–52 (primary CTA, composer).
- **Shell:** header 64 / 56 / 44 (desktop and tablet / mobile / compact landscape). The footer is static, never fixed.

## Radii and borders

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 6px | inputs, tags, code chips, tool-detail blocks |
| `--radius-md` | 8px | buttons, portrait, search field |
| `--radius-lg` | 12px | cards, drawers, dialogs, figures |
| `--radius-pill` | 999px | status chips only |
| `--border-hair` | 1px `--color-border` | cards, dividers, inputs |
| `--border-ledger` | 2px `--color-ink` | top of every section; sources list; composer divider |
| `--border-strong` | 1px `--color-ink` | secondary buttons, confirmation card |

## Elevation and surfaces
| Level | Treatment | Used by |
|---|---|---|
| 0 ground | `bg` | page |
| 1 surface | `surface` + hairline | cards, inputs, figures |
| 2 sunken | `sunken` | thumbnails, code headers, tool detail |
| 3 overlay | `surface` + `0 12px 32px -12px rgb(14 19 27 / .28)` + scrim `rgb(14 19 27 / .45)` | Drawer, Dialog, Popover, Menu, Autocomplete list, Toast |

There are no gradients and no glows.

## Iconography
- **Lucide** outline, 1.75px stroke, 16 / 20 / 24px, `currentColor`. There is one icon set.
- Brand marks (GitHub, LinkedIn, Bitbucket, PyPI) come from a small local SVG set.
- **There is no AI icon.** Ask is labelled with the word "Ask". The sparkle trope is deliberately not used.
- Icon-only buttons always have an `aria-label`.

## Imagery and portrait (DD-4)
- **Portrait:** natural colour, 4:5 crop at `object-position: center 12%`, `radius-md`, a 1px accent keyline offset 6px.
  - Desktop: 3 of 12 columns.
  - Mobile: 104px beside the role line.
  - Compact landscape: 76px square.
  - **Home hero only; never beside AI output.**
- **Project thumbnails:** a screenshot (decision D-8) or an **architecture mini-diagram** drawn from tokens (ink boxes, accent connectors). No stock imagery.
- **Diagrams in content:** inline SVG using the same tokens, with a mono caption ("FIG. 1 — …").

## Motion
| Token | Value | Use |
|---|---|---|
| `--duration-fast` | 150ms | hover, colour, chip changes |
| `--duration-base` | 220ms | reveals, popover/menu open, disclosure |
| `--duration-slow` | 320ms | Drawer and Dialog enter/exit |
| `--ease-out` | `cubic-bezier(.2,0,0,1)` | enter |
| `--ease-in` | `cubic-bezier(.4,0,1,1)` | exit |

- **Reveal:** an 8px rise plus fade, once, at a 10% threshold. Content is visible if JS fails.
- **Hover:** colour and border only; cards may lift 2px. No scaling.
- **Page change:** a 150ms cross-fade of route content; the shell doesn't move.
- **AI:**
  - A 2px accent caret that blinks at 1s.
  - Activity lines swap chips with a 150ms fade.
  - Result cards reserve their height once the tool returns, so text never jumps.
  - Tool-detail disclosure uses 220ms.
- **Reduced motion:** every transition becomes instant; the caret is static; the drawer appears without sliding.

## Interaction states
| State | Treatment |
|---|---|
| Hover | primary → `accent-hover`; secondary → `sunken` fill; links underline |
| Focus-visible | 2px `accent` outline, 3px offset, on **every** focusable (keyboard only) |
| Pressed | darker fill + 1px translate |
| Selected (nav, filter) | nav: 2px accent underline; filter chip: ink fill with surface text |
| Disabled | `border` fill, `muted` text, no pointer events |
| Loading | inline activity line (not a spinner) for AI; skeleton lines for content |
| Error | `error` text + icon + message in plain words + recovery action |

## Light and dark (DD-2)
- Follow `prefers-color-scheme`; light is the designed-first theme and the fallback.
- A three-state toggle (light / dark / system) sits in the header and the mobile drawer.
- The choice persists through the existing consent-gated preference cookie, with a localStorage fallback.
- `color-scheme` is set per theme so form controls and scrollbars follow.

## Responsive behaviour (tokens per mode)
| | compact-landscape | mobile | tablet | desktop |
|---|---|---|---|---|
| Query | landscape ∧ h ≤ 500 | w < 600 ∧ ¬CL | 600 ≤ w < 900 ∧ ¬CL | w ≥ 900 ∧ ¬CL |
| Header | 44, menu drawer | 56, menu drawer | 64, menu drawer | 64, full nav |
| Gutter / rhythm | 24 / 24 | 16 / 32–48 | 32 / 72 | 64 / 96 |
| Grid | 2 panes | 1 column | 2 columns | 12 columns |
| Programme Line | mini 3-lane strip | vertical list | full, horizontally scrollable | full |
| Ask | right Drawer (~60%) | bottom Drawer (full-height snap) | `/ask` page | `/ask` page + sources rail |
| Portrait | 76px square | 104px beside role | 3 of 8 columns | 3 of 12 columns |

In Tailwind v4 these are `@custom-variant compact-landscape | mobile | tablet | desktop`, defined once in `tokens.css`. Tablet and desktop explicitly exclude compact landscape, so rule order can't override it.
