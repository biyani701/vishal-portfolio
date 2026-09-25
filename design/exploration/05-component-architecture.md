# 05 — Component Architecture (shadcn/ui + Tailwind v4 + Base UI)

> **Final:** consolidated in `11-final-design-package.md`, which takes precedence (it includes the final dark tokens, Programme Line rules and the added compositions).

**Status:** updated for UF-1/2/3 (accepted) and DD-1 "Programme" (proposed). This supersedes the MUI-based version.

Layering (see `diagrams/05-design-system-layers.html`):
**tokens (`tokens.css` @theme) → Base UI primitives → `src/ui` (shadcn-generated, owned) → application compositions → sections → pages → AppShell.**

```
src/
  design/         tokens.css (@theme, light/dark, @custom-variant modes), fonts
  ui/             shadcn components generated with `--base base` (owned source) + contract tests
  components/     application-owned compositions (no Base UI imports except via ui/)
  sections/       page sections
  features/ask/   AI experience (CopilotKit v2 headless + ui/ + components/)
  layout/         AppShell, PageShell, useLayoutMode
  content/        typed content + loaders
  pages/          thin route components
```

**Import rules (lint-enforced):**
- Only `src/ui/` may import `@base-ui/react`.
- Nothing may import `@radix-ui/*`, `radix-ui`, `vaul`, `cmdk` or `@base-ui-components/react`.
- Composition uses the `render` prop, never `asChild`.

## A. Built on Base UI primitives (`src/ui/`, via `shadcn add`)

| Component | Base UI primitive | Where it's used | Programme styling |
|---|---|---|---|
| **Dialog** / **AlertDialog** | `dialog`, `alert-dialog` | ⌘K container, sign-out confirm, image zoom | radius-lg, overlay shadow, scrim, slow duration |
| **Drawer** | `drawer` | Mobile/tablet/compact-landscape nav; Ask on mobile (bottom, full-height snap) and compact landscape (right, 60%) | radius-lg on the leading edge; drag handle on bottom; safe-area padding |
| **Popover** | `popover` | glossary term previews in articles, share menu | overlay level, 220ms |
| **PreviewCard** | `preview-card` | hover preview for "Sources" and related links (desktop only) | overlay level |
| **Menu** / **ContextMenu** | `menu`, `context-menu` | account menu, "more" actions on cards | overlay level; items are 44px on touch |
| **NavigationMenu** | `navigation-menu` | desktop primary nav (plain links; submenu only for Knowledge domains) | accent underline on selected |
| **Autocomplete** | `autocomplete` | ⌘K search/Ask palette (inside Dialog), glossary filter, Work tech filter | results grouped: Pages · Terms · "Ask: …" last |
| **Combobox** / **Select** | `combobox`, `select` | contact intent, filter selects | |
| **Tabs** | `tabs` | Experience (Timeline / Skills / Credentials), code sample variants | ledger underline |
| **Tooltip** | `tooltip` | icon-only buttons, Programme Line segments (desktop) | mono 12px, never the only carrier of information |
| **Toast** | `toast` | "Request sent", copy confirmations, reconnect notices | bottom-center (mobile), bottom-right (desktop); never stacks over the composer |
| **Collapsible** / **Accordion** | `collapsible`, `accordion` | AI tool-detail disclosure, mobile "Sources", role details | 220ms |
| **Field / Form / Input / Checkbox / RadioGroup** | `field`, `form`, `input`, … | Contact, Ask confirmation card, sign-in | label above; error below with icon |
| **ToggleGroup** | `toggle-group` | theme switch (light/dark/system), filter chips | ink fill when selected |
| **ScrollArea** | `scroll-area` | Programme Line on tablet; code blocks | |
| **Button** / **Separator** / **Avatar** | `button`, `separator`, `avatar` | everywhere / ledger rules / account menu initials | |

## B. Application-owned compositions (`src/components/`)

These carry the product's identity. They compose `ui/` pieces and tokens, and never touch Base UI directly.

| Composition | Built from | Notes |
|---|---|---|
| **AppShell** | header, `NavigationMenu` (desktop) / `Drawer` (others), footer | measures header → `--app-header-h`; static footer; one overlay layer |
| **Navigation** (bar · drawer · compact bar) | NavigationMenu, Drawer, Autocomplete trigger, ToggleGroup | composition chosen by `useLayoutMode()`; styling by mode variants |
| **CommandPalette** | Dialog + Autocomplete | groups: Pages · Knowledge terms · Writing · "Ask: …" |
| **ProgrammeLine** ★ | SVG/CSS grid + Tooltip + Link | the signature element: horizontal lanes (desktop), mini strip (compact landscape), vertical list (mobile); accessible table fallback |
| **StatusChip** ★ | span + tokens | Delivered / In flight / Failed / Done; shared by content and AI |
| **ProofLedger** | grid + tabular numerals | 4 figures (desktop), 2×2 (mobile), inline row (compact landscape) |
| **ProjectCard** | Card + thumbnail (screenshot or ArchitectureThumb) + StatusChip + tags | variants: grid, compact (Ask result), row (landscape list) |
| **ArchitectureThumb / ArchitectureFigure** | inline SVG from data | tokenised; captioned "FIG. n" |
| **RoleCard / Timeline** | Collapsible + StatusChip | Experience page; Ask results |
| **CapabilityMap** | grid bars from skill dates | Experience |
| **ArticleCard / ArticleRow** | typography only | Writing lists, Home |
| **MarkdownContent** | react-markdown + rehype-sanitize → our elements | glossary terms become Popovers |
| **CodeBlock** | Shiki (build time) + copy Button + Toast | always dark |
| **CaseStudyLayout / ArticleLayout** | ToC rail + prose column + aside ("Ask about this", related) | the same reading system across Work, Writing and Knowledge |
| **Portrait** | img + tokens | DD-4 rules enforced by props (no `size="avatar"` in AI contexts) |
| **ContactForm** | Field/Form + Tally submission (consent-gated) | intent-first |

## C. AI experience (`src/features/ask/`), application-owned on CopilotKit v2 headless

| Composition | CopilotKit v2 | Built from | Behaviour |
|---|---|---|---|
| **AskProvider** | `CopilotKitProvider`, `useAgentContext` | — | runtime URL from runtime-config; page context (route, entity id) |
| **AskEntry** | — | nav link, CommandPalette "Ask:" item, margin "Ask about this" links, Home input | no floating button |
| **AskSurface** | `useAgent` | `/ask` page (desktop/tablet), `Drawer` bottom (mobile), `Drawer` right 60% (compact landscape) | one conversation state across surfaces |
| **AskTurn** | messages | `h2` question + prose answer (Newsreader) + inline results | no bubbles, no avatar |
| **AskActivity** | `useRenderToolCall`, `useDefaultRenderTool` | StatusChip + plain-language line + Collapsible technical detail | DD-3 |
| **AskResult** | `useRenderTool` per tool | ProjectCard (compact), RoleCard, ProgrammeLine excerpt, glossary card | same components as the site |
| **AskSources** | tool results | numbered list; ledger rule; Collapsible on mobile/landscape; PreviewCard on desktop | |
| **AskConfirm** | `useHumanInTheLoop` / `useInterrupt` | Form + Field + Buttons | nothing leaves without "Send request" |
| **AskSuggestions** | `useConfigureSuggestions`, `useSuggestions` | plain serif links | |
| **AskComposer** | `useAgent` (send/stop) | Input + Stop Button | pinned above the safe area |
| **AskAnnouncer** | — | `@react-aria/live-announcer` (polite) | announces start, tool status changes, completion with source count; never tokens |

## Rules
1. Pages only compose sections. Sections only compose `components/` and `ui/`.
2. No raw colours, sizes or media queries outside `src/design/`. Mode variants (`compact-landscape:`, `mobile:`, `tablet:`, `desktop:`) are the only responsive vocabulary.
3. A new visual element starts as a `ui/` variant (via `cva`) or a `components/` composition with a test. There are no one-offs in pages.
4. `src/ui/` contract tests (keyboard, focus trap/restore, Escape, outside click, touch targets ≥ 44px) cover Dialog, Drawer, Menu, Autocomplete, Popover, Tabs and Toast, and run on every shadcn/Base UI upgrade.
