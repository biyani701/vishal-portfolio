# 11 — Final Design Decision Package: "Programme"

**Status: FROZEN (approved 2026-09-25).** UF-1…UF-3 and DD-1…DD-4 accepted; inventory decisions D-1…D-9 and C-1…C-2 resolved (§13). Design exploration is closed. Changes require a concrete implementation constraint that makes a decision technically infeasible.
**This is the binding reference.** `04-design-system.md` and `05-component-architecture.md` hold supporting detail; where they differ, this document wins. `03` and `10` record exploration reasoning only.
**Visual reference:** [Programme canvas](https://claude.ai/artifact/1sbFERUzCEWMfGJtMGxWso). The *Direction* page holds the core surfaces; the *Validation* page holds the Programme Line at small sizes, the dark pass, Ask edge cases and the remaining surfaces.

---

## 1. Decision register

| ID | Decision | Status |
|---|---|---|
| UF-1 | shadcn/ui + Tailwind CSS v4 | Accepted |
| UF-2 | Browser floor: Safari 16.4+, Chrome 111+, Firefox 128+ | Accepted |
| UF-3 | Base UI (`@base-ui/react` 1.x) + `@react-aria/live-announcer`; guardrails binding (see `09`) | Accepted |
| DD-1 | Visual direction **Programme**: the career presented as a programme, with delivery, evidence, milestones and status | Accepted |
| DD-2 | Theme follows the OS; light is the primary design and the fallback; dark is designed separately | Accepted |
| DD-3 | AI activity: plain-language activity line + status chip; technical detail on demand | Accepted |
| DD-4 | Portrait: medium, natural colour, Home hero only, never beside AI output | Accepted |

## 2. Design decisions vs. exploration observations

**Decisions** are the rules in §§3–10. Implementation must follow them.

**Observations** informed the choice but aren't rationale to cite, because none were measured:
- B's styling sits close to shadcn's defaults.
- A's palette is a frequently seen editorial style.
- C's palette feels trend-bound.
- Tailwind/shadcn are well known to AI assistants.

The only evidence-based rationale in this package is:
- verified package facts (versions, available components, peer ranges)
- WCAG contrast ratios for the tokens
- geometry checks from the validation artboards: segment widths, milestone spacing, touch-target sizes

## 3. Visual foundation (principles)
1. **Plan, proof, status.** Sections open with a 2px ledger rule. Figures use tabular numerals. Status is always explicit.
2. **One action colour.** Cobalt means "you can act on this". Amber means only "in flight". Nothing else is chromatic.
3. **Serif for reading, grotesk for doing, mono for data.**
4. **Borders before shadows.** Only overlays cast a shadow.
5. **Every layout mode is composed.** Nothing is scaled down.

## 4. Tokens (final)

### 4.1 Colour
Contrast targets: body text ≥ 4.5:1 and large/UI ≥ 3:1 against the surface it sits on, in both themes.

| Token | Light | Dark |
|---|---|---|
| `bg` | `#F4F6F8` | `#0D1015` |
| `surface` | `#FFFFFF` | `#151A21` |
| `sunken` | `#ECEFF3` | `#10141A` |
| `border` | `#D7DCE3` | `#2A323D` |
| `border-strong` | `#0E131B` | `#C5CCD6` |
| `ink` (text, ledger rule) | `#0E131B` | `#E8ECF1` |
| `ink-2` (long-form) | `#232A35` / `#343B47` | `#C5CCD6` |
| `muted` | `#4A5361` | `#9AA4B2` |
| `accent` (links, focus, selected) | `#2447D9` | `#8FA6FF` |
| `accent-fill` (primary button, white text) | `#2447D9` | `#3558E6` |
| `accent-hover` | `#1A36A8` | `#A9BAFF` |
| `accent-soft` / `accent-soft-border` | `#E8EDFD` / `#B9C6F6` | `#1B2340` / `#3A4A8C` |
| `flight-fg` / `flight-bg` / `flight-border` / `flight-dot` | `#8A4F00` / `#FCEFD8` / `#F0D3A0` / `#C27A0E` | `#F2B544` / `#3A2E14` / `#5C4718` / `#F2B544` |
| `error` / `error-bg` / `error-border` | `#B42318` / `#FEF3F2` / `#F4C7C3` | `#F87171` / `#2A1414` / `#5A2626` |
| `success` | `#1E7A3A` | `#4ADE80` |
| `past` (pre-Cognizant segment, older skills) | `#8E99AA` on track `#E3E7ED` | `#39424F` on track `#1E242D` |
| `code-bg` / `code-header` | `#121823` / `#1B2230` | `#0A0D12` / `#151A21` |
| `code-keyword` / `code-string` / `code-comment` | `#8FA6FF` / `#F2C27A` / `#7D8796` | same |
| `scrim` | `rgb(14 19 27 / .45)` | `rgb(0 0 0 / .55)` |
| `shadow-overlay` | `0 12px 32px -12px rgb(14 19 27 / .28)` | `0 12px 32px -12px rgb(0 0 0 / .6)` |

**Dark-theme rules (validated in the dark pass):**
- Text accent lightens (`#8FA6FF`), but button fill stays saturated (`#3558E6`) with white text.
- Amber keeps the "in flight" meaning.
- Code sits *below* the surface (`#0A0D12`), not above it.
- The portrait gets `brightness(.94)`.
- The ledger rule becomes light ink.

### 4.2 Typography
| Role | Family | Rules |
|---|---|---|
| Display, headings, UI | Bricolage Grotesque (variable, opsz 12–96) | Headings 600, tracking −0.02 to −0.035em; UI 500; never below 13px |
| Long-form, AI answers, ledes, quotes | Newsreader (variable opsz) | 18–22px, line-height 1.55–1.7, measure 60–70ch; italic only for ledes and pull quotes |
| Data, dates, chips, kickers, tool detail, code | JetBrains Mono | 10–14px; kickers uppercase +0.06em; dates tabular |

Scale (mobile → desktop, clamped):

| Token | Size (px) |
|---|---|
| display | 40 → 72 |
| h1 | 34 → 56 |
| h2 | 26 → 36 |
| h3 | 19 → 22 |
| question | 22 → 30 |
| lede | 18 → 22 |
| prose | 18 → 20 |
| body | 15 → 16 |
| label | 13 → 14 |
| mono-s | 10 → 12 |

Compact landscape uses the mobile end of every clamp, with display capped at 32px.

### 4.3 Spacing, sizing, radii, borders, elevation
- **Spacing** on a 4px scale.
- **Gutters:** 16 (mobile), 24 (compact landscape), 32 (tablet), 64 (desktop), plus safe-area insets.
- **Section rhythm:** 32–48 (mobile), 24 (compact landscape), 72 (tablet), 96 (desktop).
- **Controls:** 44px minimum touch target; 48–52px for primary CTAs and the composer.
- **Header:** 64 (desktop and tablet), 56 (mobile), 44 (compact landscape). The footer is static.
- **Radii:** 6 (inputs, tags), 8 (buttons, portrait), 12 (cards, drawers, dialogs), pill (status chips only).
- **Borders:** 1px hairline, 2px ledger rule, 1px strong for secondary buttons and confirmation cards.
- **Elevation:** ground → surface (hairline) → sunken → overlay (shadow + scrim). No gradients or glows.

### 4.4 Iconography and imagery
- **Icons:** Lucide outline, 1.75px stroke, 16/20/24px. **No AI icon**; Ask is the word "Ask".
- **Portrait (DD-4):** 4:5 crop, natural colour, radius 8, 1px accent keyline offset 6px.
  - Desktop: 3 of 12 columns.
  - Mobile: 104px beside the role line.
  - Compact landscape: 76px square.
  - **Home only.** About, Ask and cards never show it.
- **Project thumbnails:** a screenshot, or an architecture mini-diagram drawn from tokens. No stock imagery.

### 4.5 Motion
- **Durations:** 150ms for colour, 220ms for reveals and popovers, 320ms for drawers and dialogs.
- **Easing:** ease-out on enter, ease-in on exit.
- **Reveal:** an 8px rise plus fade, once; content is visible without JS.
- **Caret:** a 2px accent caret blinking at 1s.
- **Reduced motion:** every transition is instant and the caret is static.

### 4.6 Interaction states
- **Hover:** darker fill, or underline for links.
- **Focus-visible:** 2px accent outline with 3px offset, on every focusable.
- **Pressed:** 1px translate.
- **Selected:** accent underline for nav; ink fill for filters; accent-soft fill with 2px accent border for cards, terms and Programme segments.
- **Disabled:** border-coloured fill with muted text.
- **Validation error:** red border plus a message below the field saying what to do.

## 5. Status language (content and AI share one vocabulary)
| Chip | Meaning | Used for |
|---|---|---|
| **Delivered · {period}** | Finished work | roles, projects |
| **In flight** (amber dot) | Happening now | current role; an AI step running |
| **Done** | An AI step finished | activity lines |
| **Failed · retry** | An AI step or send failed; always paired with a recovery action | activity lines, confirmation |
| **Answer complete · N sources** | The AI answer finished | end of an answer |
| **Selected** | Current item in a set | Programme Line, glossary |

Rules:
- A chip always has text, so colour is never the only signal.
- Amber is never used for anything that isn't in progress.
- Status wording is plain language.

## 6. Programme Line rules (validated at 320, 375, 390 and compact landscape)
1. **Data:** built only from real role and milestone dates, on an axis from 2000 to now (rendered to 2027). Nothing is estimated.
2. **Forms by mode.**

   | Mode | Form | Details |
   |---|---|---|
   | Desktop | Swimlanes | One lane per organisation; labelled segments; milestone row; axis every 5 years |
   | Tablet | Swimlanes | Same, inside a horizontal ScrollArea only if the lane is under 600px |
   | Compact landscape | Labelled lanes, 28px tall | Summary figure; the whole figure links to Experience; no per-segment targets |
   | Mobile (≤ 599px) | **Span rows** | One row per engagement: dates, title, and a thin full-width track showing that engagement's span on the shared axis |

   Span rows keep the chronology comparable across rows, need no horizontal scrolling, and make each row one ≥ 56px touch target.
3. **Labels:** a segment shows its label only if the label fits inside it with 8px padding; otherwise the label moves outside.
   - Validated: IFC is ~36px at 844px landscape, which fits "IFC".
   - In mobile span rows the title sits above the track, so width never constrains labels.
4. **Milestones:** markers closer than **12px** merge into a numbered cluster (`◆2`), and the full list is printed under the track.
   - Validated: at 288–358px track widths, AWS 2020 and Manager of the Quarter 2021 are about 9–12px apart, so they cluster.
   - At ≥ 500px they're 16px or more apart, so they stay separate.
5. **Status:** the current role uses in-flight colours. Pre-Cognizant work uses `past`. Selected uses accent fill with an ink outline.
6. **Accessibility:**
   - Every form has a "View as table" alternative (period · engagement · status).
   - The figure has an `aria-label` summary.
   - Segments and rows are links or buttons.
   - Tooltips appear on desktop only and are never the only source of information.
7. **Placement:**
   - Home: under the hero.
   - Experience: interactive; selecting a segment updates the role panel, with prev/next navigation.
   - Ask: an excerpt as a result.
   - Nowhere else.

## 7. Responsive rules
- Four mutually exclusive modes are defined once in `tokens.css` as Tailwind `@custom-variant`s.
  - compact-landscape: landscape and height ≤ 500px.
  - mobile / tablet / desktop exclude compact-landscape.
- Components use only these variants. No `@media` rules or arbitrary values outside `src/design` (lint-enforced).
- JS mode detection (`useLayoutMode`) is used only where the DOM differs: navigation composition and Ask surface type.

| Surface | compact-landscape | mobile | tablet | desktop |
|---|---|---|---|---|
| Header / nav | 44px bar + Drawer | 56px + Drawer | 64px + Drawer | 64px NavigationMenu |
| Home hero | two panes: statement / portrait + mini line + proof row | stacked; portrait beside role | 8-column grid | 12-column grid |
| Lists (work, writing, terms) | 2 panes: list / detail | 1 column | 2 columns | 3 columns + detail panel |
| Case study / article | reading column + ToC column | reading column; ToC in a disclosure | reading + ToC | ToC · reading · aside |
| 3-D Secure flow | steps + detail, two panes | vertical steps, current expanded, Prev/Next pinned | vertical steps + sequence | step list + sequence diagram + detail |
| Ask | right Drawer 60% | bottom Drawer, full-height snap | `/ask` page | `/ask` page + sources rail |

## 8. AI / Ask rules
**Entry.**
- Nav item "Ask", ⌘K "Ask: …" as the last option, margin links reading "Ask about this", and the Home question input.
- No floating button and no auto-open.

**Conversation.**
- The question is set as a heading and the answer as serif prose.
- Results use site components (ProjectCard compact, RoleCard, Programme Line excerpt, glossary card).
- No bubbles, avatar or persona.

**Long answers** (validated with 7 sources):
- Answers over ~150 words open with a one-sentence summary at lede size, then use h3 sub-sections.
- Citations are superscript numbers.
- Sources are numbered and grouped by section (Experience / Work / Knowledge).
- The desktop sources rail stays in view; hovering a citation highlights its source.
- Mobile sources collapse into a "N sources" disclosure showing the first 4, then "Show N more".
- When the reader has scrolled up, a "Jump to latest ↓" button appears above the composer.
- The end-of-answer row reads "Answer complete · N sources · Copy answer · Open {page}".

**Activity (DD-3).**
- One line per step: chip plus plain-language sentence.
- "Details" expands to show tool name, arguments and duration in mono.
- Several steps stack in execution order.

**Failure alongside confirmation** (validated):
- A failed step shows a Failed chip with an inline Retry.
- The answer says plainly what it couldn't do.
- The confirmation card **stays usable**, and includes a notice that the draft leaves out anything from the failed step. **Nothing unverified enters a draft.**
- The sources rail says "No sources" when nothing could be cited.

**Send failure** (validated):
- An inline `role="alert"` in the confirmation card: "Couldn't send your request… Your note is kept. Nothing was sent."
- The fields are preserved.
- Actions are "Try again" and "Open the contact form instead". It is never shown as a toast.

**Interrupted stream:**
- The partial answer is kept and marked Incomplete.
- Actions are Try again and Copy what's here.

**Outward actions:** only through a confirmation card; the primary action reads "Send request".

**Announcements** (`@react-aria/live-announcer`):
- Polite: "Answer started", each step status, "Answer complete, N sources".
- Assertive: send failure.
- Tokens are never announced.
- `aria-busy` is set while streaming. Focus returns to the composer.

**Surfaces:** as in §7. The mobile drawer pins the composer above the safe area. The landscape drawer keeps the page visible on the left.

## 9. Component ownership
**Base UI primitives, generated into `src/ui/` via `shadcn add` (owned source, contract-tested):**
- Dialog, AlertDialog
- Drawer
- Popover, PreviewCard
- Menu, ContextMenu, NavigationMenu
- Autocomplete, Combobox, Select
- Tabs
- Tooltip
- Toast
- Collapsible, Accordion
- Field, Form, Input, Checkbox, RadioGroup
- ToggleGroup
- ScrollArea
- Button, Separator, Avatar

**Application-owned compositions (`src/components/`, `src/features/ask/`):**

| Composition | Built from |
|---|---|
| AppShell, Navigation (bar / drawer / compact bar) | NavigationMenu, Drawer, CommandPalette |
| CommandPalette | Dialog + Autocomplete |
| **ProgrammeLine** (lanes / strip / span rows / table) | SVG/CSS + Tooltip + ScrollArea |
| **StatusChip** | tokens |
| ProofLedger, ProjectCard, ArchitectureThumb/Figure, RoleCard + RolePanel, CapabilityMap, CredentialsLedger | tokens + ui |
| ArticleRow/Card, MarkdownContent, CodeBlock | Shiki + Button + Toast |
| CaseStudyLayout / ArticleLayout | ToC via Collapsible on mobile |
| **GlossaryIndex** | Autocomplete + ToggleGroup + A–Z links + term grid + detail panel (Drawer on mobile) |
| **StepFlow** (3-D Secure) | Buttons with `aria-current="step"` + sequence SVG + Prev/Next; glossary terms as Popovers |
| **IntentPicker** (Contact) | RadioGroup |
| **ConsentGate** | Klaro-linked, for third-party embeds |
| Portrait | enforces DD-4 |
| Ask: AskProvider, AskEntry, AskSurface, AskTurn, AskActivity, AskResult, AskSources (grouped, hover-linked), AskConfirm (with failure notice and send-failure alert), AskSuggestions, AskComposer, JumpToLatest, AskAnnouncer | CopilotKit v2 headless hooks + ui + compositions |

Forbidden in app code: `@radix-ui/*`, `radix-ui`, `vaul`, `cmdk`, `@base-ui-components/react`, and `asChild`. Only `src/ui` imports `@base-ui/react`.

## 10. Architecture diagrams (Archify, regenerated)
| Diagram | File |
|---|---|
| Information architecture | `diagrams/01-information-architecture.html` |
| Application shell | `diagrams/02-application-shell.html` |
| Responsive architecture (Programme Line forms included) | `diagrams/03-responsive-architecture.html` |
| Ask AG-UI interaction, with live announcements | `diagrams/04-ai-agui-interaction.html` |
| Component layers (Base UI → src/ui → compositions → sections → pages → AppShell) | `diagrams/05-design-system-layers.html` |

All five pass Archify's automated checks; they haven't been reviewed visually in a browser.

## 11. Validation summary
| Item | Result | Canvas (Validation page) |
|---|---|---|
| Programme Line 320×568 | Passes with span rows. Every engagement readable; IFC span ~22px visible; milestones clustered; rows ≥ 56px; no horizontal scroll | PL320 |
| Programme Line 375×667 / 390×844 | Passes; full month ranges fit; milestone list printed | PL375, PL390 |
| Programme Line compact landscape | Passes as labelled lanes (all labels fit at 844px); whole figure links to Experience | PLLandscape |
| Dark theme: Home, case study with code, Ask, status/code/data | Designed palette; contrast rules hold; code sits below surface | DarkHome, DarkProject, DarkAsk, DarkStates |
| Ask: long answer, 7 sources (desktop + mobile) | Summary-first structure, grouped sources, jump-to-latest | AskLong, MobileAskLong |
| Ask: failure + confirmation; send failure | Confirmation stays usable with a disclosure notice; send failure keeps the draft | AskFailConfirm, MobileAskFail |
| Experience, Glossary, 3-D Secure (desktop + mobile), About, Contact | All built from existing tokens and compositions; no new visual language needed | Experience(+Mobile), Glossary, ThreeDS(+Mobile), About, Contact |

## 12. Open items carried into implementation
1. **Content placeholders:** the About narrative and principles, project outcomes/screenshots (D-8), article dates, glossary definitions. The site ships typographic fallbacks until these are supplied.
2. **Implementation change:** `openspec/changes/rebuild-portfolio-app` replaces the earlier migration change.

## 13. Inventory and backend decisions (resolved 2026-09-25)
| ID | Decision | Resolution |
|---|---|---|
| D-1 | Split the long homepage | Home + About + Experience |
| D-2 | `/about` protection | Public |
| D-3 | In-browser blog editor | **Removed.** Articles are Markdown in the repo, built into the site |
| D-4 | `/signin-legacy`, `/login` | Redirect to `/signin` |
| D-5 | Debug/test routes | One dev-only `/_dev` |
| D-6 | Multi-palette picker | Dropped; light / dark / system only |
| D-7 | Search source | Built from the real content layer |
| D-8 | Project imagery/outcomes | Owner supplies screenshots and outcomes; typographic fallback until then |
| D-9 | AI runtime host | **New `apps/api` project on Vercel**, hosting the CopilotKit/AG-UI runtime and the contact endpoint. `apps/auth-server` is untouched |
| C-1 | Contact form | **Application-owned Programme form.** The Tally embed is retired: Tally documents form management, submission retrieval and webhooks, but no submission API for third-party frontends |
| C-2 | Contact delivery | **`POST /contact` on `apps/api` (`https://api.vishal.biyani.xyz/contact`):** validates, rate-limits, **stores a copy**, then emails the owner through a transactional email provider. Stored messages are retried if email fails. This is a backend change, recorded here |

C-1 supersedes the Contact artboard's consent gate: with no third-party embed, Contact needs no ConsentGate. The privacy policy must describe message storage and retention.
