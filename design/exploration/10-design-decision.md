# 10 — Design Decision: re-evaluating A, B and C against the final foundation

**Status:** DD-1…DD-4 **accepted** (2026-09-25). This document records the exploration reasoning. The binding decisions are consolidated in `11-final-design-package.md`.
**Fixed inputs:** UF-1 shadcn/ui + Tailwind v4 · UF-2 modern browser floor · UF-3 Base UI · React 19 · Vite · CopilotKit v2 / AG-UI · four exclusive layout modes (compactLandscape, mobile, tablet, desktop).
**Evidence:** the existing canvases, [A Editorial](https://claude.ai/artifact/WV1hqjmRgEMKPEvefFLNB3), [B AI-native](https://claude.ai/artifact/E9NQ78qVETMcsmKhp3LgPs) and [C Signature](https://claude.ai/artifact/A2bRyTowXuePuEm6VfYnPa), plus a refinement canvas for the selected direction: [Selected direction — Programme](https://claude.ai/artifact/1sbFERUzCEWMfGJtMGxWso).

---

## 1. Does the foundation constrain the choice?

No. All three directions can be built on shadcn + Tailwind v4 + Base UI without friction:

| Concern | A Editorial | B AI-native | C Signature |
|---|---|---|---|
| Tailwind tokens / `@theme` | Square corners and hairlines: set `--radius` to 0–2px | Closest to shadcn defaults | Large radii and colour blocks: fine |
| Base UI surfaces | Drawer nav; Autocomplete for ⌘K | Drawer for mobile Ask; Autocomplete ⌘K bar | Drawer for the concierge sheet |
| CopilotKit v2 headless | Citations need sources in tool results (available) | Tool rows map 1:1 to `useRenderToolCall` | Plain-language status needs a label per tool (easy) |
| Four layout modes | Landscape master–detail works well | Landscape split panes work | Landscape "poster" works; heavy display type needs clamping |

The foundation carries one **risk** instead of a constraint.
- *Observation (subjective, not measured):* B's look (dark slate, a neutral geometric sans, 12px-radius cards, a single cool accent) sits close to shadcn's out-of-the-box styling, and to the look of many developer tools.
- *Design consequence:* on a shadcn foundation, visual distinctiveness must come from our own tokens and signature elements, not from the defaults.

## 2. Honest review of each direction

### A — Editorial
- **What works:**
  - The typographic authority: a serif for display and long-form, ledger numerals, 2px rules marking section tops.
  - Citation-first Ask, where sources sit in the margin and answers read like an annotated page.
  - The best long-form reading of the three.
  - A clean compact-landscape master–detail layout for Work.
- **What doesn't work:**
  - *Observation (subjective):* the warm-paper, serif and oxblood palette reads to me as "writer's blog" more than "technology platform", and it is a frequently seen editorial style.
  - Project presentation is list-only, with no visual evidence of building.
  - Dark mode would be an afterthought.
- **Feels like:** a respected columnist's site. Distinctive for a writer, but under-sells the builder.

### B — AI-native
- **What works:**
  - The information design: a career Gantt from real dates, skills over time, project cards with architecture thumbnails.
  - ⌘K for search and Ask together.
  - Transparent, inspectable tool activity.
  - The confirmation card as the model for outward actions.
  - Landscape split panes.
- **What doesn't work:**
  - Dark-first slate + Geist + teal is the shadcn/Vercel default look.
  - The three-pane Ask (threads | chat | canvas) is a product UI transplanted into a portfolio. It's heavy, and it makes the site read as an "AI demo".
  - Amber glow and sparkle marks everywhere make AI the theme.
- **Feels like:** a developer tool. Credible to engineers, generic to everyone else.

### C — Signature
- **What works:**
  - A real point of view and voice ("I lead delivery. I build tools. I explain payments.").
  - A confident name typeset at large scale.
  - The portrait as identity, not decoration.
  - The strongest mobile composition; the landscape poster.
  - Plain-language AI status ("Looking through his roles…").
- **What doesn't work:**
  - *Observation (subjective):* cream, cobalt and citrus bento blocks feel tied to current trends, and may date faster.
  - Colour blocks fight long-form and knowledge pages.
  - The floating "Ask" pill adds exactly the kind of overlay we're removing.
  - The citrus sticker and 196px name undercut seniority for CXO audiences.
  - Hiding tool activity entirely removes the transparency that makes the AI trustworthy.
- **Feels like:** a design-studio personal brand. Memorable, but louder than the person it presents.

## 3. Decision DD-1: a deliberate combination, "Programme"

No single direction survives as-is:
- **A** has the right register but the wrong palette and weak evidence of building.
- **B** has the right substance but the wrong skin.
- **C** has the right personality but the wrong volume.

The strongest option is a synthesis with **one organising idea taken from Vishal's own world**:

> **The site reads like a well-run programme: a clear plan, evidence of delivery, and honest status.**

This idea is specific to a delivery director. It is what makes the site a *personal technology platform* instead of a generic portfolio, dashboard or AI demo. It shows up in four signature devices:

1. **The Programme Line** (from B's career Gantt). The 2000–2026 career rendered as a delivery timeline with swimlanes and milestones, built from real dates. It anchors the bottom of the Home hero and is reused on Experience and in Ask answers. It's the one element only this person's site would have.
2. **Ledger structure** (from A). A 2px ink rule opens each section; figures use tabular numerals; long-form uses a serif.
3. **Declarative voice** (from C). The triptych "I lead delivery · I build tools · I explain payments" and a confident, but not shouting, display face.
4. **Status vocabulary shared by content and AI** (new; ties B's activity states to the site).
   - Roles and projects carry status chips such as *Delivered 2014–19* and *In flight*.
   - The AI's activity uses the **same "in flight" amber** and the same chip shape.
   - So the AI speaks the site's language instead of bringing its own theme.

### Retain / change / discard

| From | **Retain** | **Change** | **Discard** |
|---|---|---|---|
| **A** | Serif long-form (Newsreader); ledger rules and tabular numerals; citation-first answers with a sources rail; Ask "questions as headings, answers as prose"; landscape master–detail for Work | Palette (no paper and terracotta); square corners → small radii | List-only project index; drop caps; oxblood accent |
| **B** | Programme Line (career Gantt); skills-over-time; project cards with architecture thumbnails; ⌘K search + Ask; inspectable tool activity; confirmation card; landscape split panes | Dark-first → light-first; Geist → a characterful grotesk; tool rows written in plain language, with technical detail on expand | Three-pane Ask with threads and a separate canvas; glow; sparkle icon everywhere; teal |
| **C** | Voice triptych; confident name typography (scaled down); portrait as identity; mobile hero composition; landscape "name + portrait" poster; plain-language status copy | Cobalt kept as the **single** action/brand accent, used sparingly; radii 24–36 → 6–12 | Cream ground; citrus; bento colour blocks; floating Ask pill; 25+ sticker |

## 4. DD-2, DD-3, DD-4

| ID | Decision | Resolution | Rationale |
|---|---|---|---|
| **DD-1** | Visual direction | **"Programme": a synthesis of A/B/C** as defined above | See §3 |
| **DD-2** | Default theme | **Follow the OS (`prefers-color-scheme`); light is the design-first theme and the fallback.** Dark is fully designed, not inverted. The header toggle offers light / dark / system; the choice is saved through the existing consent-gated preference | Light suits decision-maker audiences and long reading. Respecting the OS is the accessible default |
| **DD-3** | AI tool-call presentation | **Visible, plain-language, expandable.** Each tool call shows one activity line in site language ("Searched 5 projects · 3 matched") with an in-flight/complete/failed chip. Expanding it shows the technical detail (tool name, arguments, duration). Answers end with numbered **sources**. Reasoning is never shown raw | B's transparency with C's tone: trustworthy without looking like a console |
| **DD-4** | Portrait / avatar | **Medium portrait, natural colour, 4:5 crop, with a thin cobalt keyline. Home hero only (desktop: 3 of 12 columns, about 300px wide; mobile: 104px beside the role line; compact landscape: 76px square).** It is **never** used as an AI avatar or beside AI answers | Identity without "poster" loudness. Keeping the portrait away from AI answers avoids implying Vishal is speaking |

## 5. Validation across the application

| Surface | Pattern in "Programme" | Source | Status |
|---|---|---|---|
| **Shell / navigation** | 64px bar: wordmark · Work · Experience · Writing · Knowledge · About · ⌘K field · Ask · theme · Contact. Mobile 56px: wordmark · Ask · menu → Base UI Drawer. Compact landscape 44px bar. Static footer | A + B | Refinement canvas |
| **Home** | Hero: statement + voice triptych + portrait; Programme Line under the hero; proof ledger; selected work cards with thumbnails; Ask prompt as a section; writing; contact band | A + B + C | Refinement canvas |
| **Work index** | Filter chips + cards with architecture thumbnails and status chips; landscape master–detail | B cards, A landscape | A/B canvases (needs a restyle pass) |
| **Project detail** | A's case-study reading layout with B's architecture figure and fact grid; "Ask about this" in the margin | A + B | Refinement canvas |
| **Experience** (new route) | Full Programme Line with expandable roles, outcomes, skills-over-time, credentials | B | **Not yet prototyped** |
| **Writing list / article** | A's editorial list and article; serif body; CodeBlock; ToC rail; landscape ToC column | A | A canvas (restyle only) |
| **Knowledge / glossary / 3DS** | Domain map + topic pages in article layout; glossary as Autocomplete-filtered list; interactive 3DS flow | B map, A reading | **Glossary and 3DS need prototyping** |
| **About** | Story in long-form + principles + education/recognition ledger | A | **Not yet prototyped** |
| **Contact** | Intent choice + Tally form (consent-gated) in the site's form style | new | **Not yet prototyped** |
| **Sign-in / account / legal / colophon / 404** | Utility pages on the same shell | new | Low risk; tokens + templates |
| **Ask** | See §6 | A + B + C | Refinement canvas |
| **Mobile** | C's hero composition; drawers for nav and Ask; cards stack; Programme Line becomes vertical | C + B | Refinement canvas |
| **Compact landscape** | 44px bar; two-pane compositions (hero \| portrait + proof; list \| detail; page \| Ask drawer); no fixed footer | A + B + C | Refinement canvas |

Functional capabilities and the IA from `02-information-architecture.md` are unchanged. No feature is removed by this decision.

## 6. AI as part of the product, not the theme

| Aspect | Decision |
|---|---|
| **Entry points** | "Ask" nav item (text, no sparkle), the ⌘K result "Ask: …" as the last option, contextual "Ask about this" text links in page margins, and a Home section that is an input, not a banner. No floating button |
| **Conversation surface** | `/ask` is an editorial page: the **question is set as a heading**, the answer as serif prose, results as the site's own cards, and sources in a right rail (desktop) or a "Sources" disclosure (mobile/landscape). No chat bubbles, no avatar, no persona |
| **Streaming** | Prose streams into a reserved block with a thin cobalt caret. Layout never jumps, because result cards reserve their height once the tool reports |
| **Tool / activity** | One activity line per tool in plain language with a status chip (in flight = amber, done = ink, failed = warning). It expands to show tool name, arguments and duration. The same chip is used for "In flight" roles on Experience |
| **Loading / error** | Thinking: "Reading Experience…" in the activity line. Tool failed: a degraded answer, labelled, with Retry. Connection lost: the partial answer is kept, marked "Incomplete", with Retry and "Copy what's here" |
| **Mobile** | Ask opens as a Base UI **Drawer** (bottom, full-height snap) from any page, and `/ask` exists as a full page. Composer pinned above the safe area |
| **Compact landscape** | Ask opens as a **right-side Drawer at ~60% width**. The page stays visible on the left, sources collapse into a disclosure, and the composer is pinned to the bottom |
| **Accessibility** | `@react-aria/live-announcer` in polite mode announces "Answer started", each tool status change and "Answer complete, N sources". Tokens are never announced. The message container has `aria-busy` while streaming. Stop is a real button. Focus returns to the composer after sending. Drawer focus trapping and restoration come from Base UI. With reduced motion the caret is static and nothing animates |
| **Outward actions** | Contact drafts use a confirmation card (from B) inline in the answer; nothing is sent without "Send request" |

## 7. What still needs prototyping (before or during Phase 2)

1. **Experience page:** the full Programme Line interaction (expand a role, filter by skill), on all four modes.
2. **Knowledge:** glossary list + term detail; the interactive 3-D Secure flow in the new language.
3. **About and Contact:** long-form story, the credentials ledger, and the intent-first contact form with the consent gate.
4. **Dark theme pass:** of Home, Ask and Article.
5. **Programme Line at 320px width:** the vertical variant, and its accessible table fallback.
6. **Ask edge cases:** a long answer with 6+ sources; a failed tool plus the confirmation card together; a keyboard-only walkthrough.

## 8. Decisions requested
Approve **DD-1 "Programme"**, **DD-2 system/light-first**, **DD-3 visible plain-language expandable**, **DD-4 medium portrait, hero only**. After that, implementation can be authorised against `04-design-system.md` (foundation) and `05-component-architecture.md` (Base UI mapping).
