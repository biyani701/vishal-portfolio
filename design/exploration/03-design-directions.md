# 03 — Design Directions, Trade-offs & Recommendation

> **Status (2026-09-25):** the recommendation below was a first pass. The **decision** is in `10-design-decision.md`: DD-1 "Programme", a synthesis of A/B/C with a new palette. The A/B/C canvases remain as reference.

Each direction is a full canvas with 14 artboards: Home, Work, Project case study, Writing + Knowledge, Article, Ask, AI states, three mobile frames (390×844) and four compact-landscape frames (844×390 and 932×430). All of them use the real content from the inventory. Missing facts appear as `[placeholders]`.

| Direction | Canvas |
|---|---|
| **A — Editorial ("The Ledger")** | https://claude.ai/artifact/WV1hqjmRgEMKPEvefFLNB3 |
| **B — AI-native ("Console")** | https://claude.ai/artifact/E9NQ78qVETMcsmKhp3LgPs |
| **C — Signature ("Personal brand")** | https://claude.ai/artifact/A2bRyTowXuePuEm6VfYnPa |

The artboards are clickable in Play mode (links go between Home → Work → Project → Ask and so on).

---

## A — Editorial / "The Ledger"

**Philosophy.** Present the career the way a quality financial paper presents a profile. Credibility comes from typography, restraint and evidence. Numbers read like a ledger. Ask behaves like an annotated page: answers carry footnote citations, and sources sit in the margin.

**Look.** Warm paper ground (`#F5F2EC`), ink text, a single oxblood accent (`#8C2F1B`), hairline rules, a 12-column editorial grid. Newsreader serif for display and long-form, Instrument Sans for UI, JetBrains Mono for data and code. Square corners. Very little motion.

**Compact landscape.** A 44px bar. The headline and CTAs sit on the left; a 2×2 proof ledger sits on the right. A "Next" rail hints that the page continues. Work becomes a master–detail split (list | project). Ask becomes conversation | sources + composer.

| | |
|---|---|
| Strengths | Highest perceived seniority and trust. Superb long-form reading. The quietest, most honest AI (citations first). Ages well. Cheapest to build. |
| Weaknesses | Can feel conservative or "print". Project presentation is list-led and depends on good writing. Less "wow" for technical peers. Dark mode needs deliberate work. |
| Audience perception | "Senior, thoughtful, rigorous — a director who writes." |
| Senior tech-leadership fit | ★★★★★ |
| Technical project presentation | ★★★☆☆ (strong for case studies, weak for at-a-glance scanning) |
| AI-native interaction | ★★★☆☆ (credible and restrained; the AI is a reference tool, not a centrepiece) |
| Responsive | Excellent. Typographic layouts reflow cleanly, and the landscape split is natural. |

## B — Technology / AI-native "Console"

**Philosophy.** The portfolio is an explorable system. Search and Ask share one command bar (⌘K). Career and skills are shown as real data visualisations (Gantt-style career timeline, skills-over-time map). Project cards carry mini architecture diagrams. Ask is a workspace: threads | conversation with inspectable tool calls | a **canvas** where tool results render as interactive UI (comparisons, drafts, timelines).

**Look.** Dark-first slate (`#0B0E13`) with a light theme. Teal (`#3DD6C1`) for things you can act on, amber (`#F2B544`) only for "the agent is doing something". Geist and Geist Mono, with Source Serif 4 for article bodies. 10–14px radii, layered surfaces, a single soft glow on the Ask panel.

**Compact landscape.** Uses the width. The Home hero sits beside a live Ask panel. Work becomes a horizontal card rail with filter chips in the 44px bar. Ask becomes conversation | canvas, with the confirmation form in the canvas pane. The article keeps its table of contents visible instead of a sticky header.

| | |
|---|---|
| Strengths | Best at showing *what he has built* and *how he thinks in systems*. The most meaningful AI (tool traces, generative UI, human-in-the-loop). The data-viz is honest because it comes from the real content model. Maps directly onto CopilotKit v2 primitives. |
| Weaknesses | Risk of reading as "developer portfolio" rather than "delivery director". Dark UI can feel cold to non-technical hiring managers. It needs the most engineering (canvas, tool renderers, charts). The data-viz needs real, accurate data (skills dates, outcomes). |
| Audience perception | "A technical leader who understands modern engineering and AI — not a slide-deck PM." |
| Senior tech-leadership fit | ★★★★☆ (★★★★★ with a light-first default) |
| Technical project presentation | ★★★★★ |
| AI-native interaction | ★★★★★ |
| Responsive | Very good. Panes collapse cleanly into sheets on mobile; landscape uses split panes. The most complex to test. |

## C — Premium personal / "Signature"

**Philosophy.** A strong personal brand. Oversized name typography, the portrait in a cobalt block, a citrus "25+ years" sticker, and three declarative statements ("I lead delivery. I build tools. I explain payments."). Projects are bold colour panels in a bento grid. Ask is a warm concierge: a persistent pill that opens a large sheet, with plain-language status pills instead of tool names.

**Look.** Cream (`#F4F1EA`), ink, cobalt (`#1E3FD8`), citrus (`#DDF65A`). Bricolage Grotesque 800 for display, Figtree for body, DM Mono for labels. 24–36px radii, pill buttons, confident spring motion.

**Compact landscape.** Name + CTAs on the left, a full-height portrait panel on the right: a single-screen "poster". Work becomes a swipeable panel rail. Ask becomes a right-hand sheet over the dimmed page. The article docks the Ask pill to the right so it never covers the text.

| | |
|---|---|
| Strengths | The most memorable and distinctive. Warmest, most human, with high recruiter recall. The mobile experience is excellent (thumb-reachable pill). |
| Weaknesses | Personality can undercut gravitas for board/CXO audiences. Colour blocks compete with content for long-form and knowledge pages. The persistent pill adds a floating overlay (the thing we're trying to reduce). Trend-driven: it may date faster. |
| Audience perception | "Confident, modern, approachable — a strong personal brand." |
| Senior tech-leadership fit | ★★★☆☆ |
| Technical project presentation | ★★★★☆ (great teasers, weaker detail) |
| AI-native interaction | ★★★★☆ (friendly and clear; tool transparency is hidden by default) |
| Responsive | Excellent on mobile. Landscape works because the composition is poster-like. Heavy display type needs careful clamping. |

---

## Comparison at a glance

| Criterion | A Editorial | B AI-native | C Signature |
|---|---|---|---|
| Credibility with CXO / hiring panel | **Highest** | High | Medium |
| Shows engineering depth | Medium | **Highest** | Medium |
| AI as a meaningful capability | Good | **Best** | Good |
| Long-form reading (writing / knowledge) | **Best** | Good | Fair |
| Memorability | Medium | High | **Highest** |
| Build complexity | **Lowest** | Highest | Medium |
| Risk of looking dated in 3 years | **Lowest** | Medium | Highest |

## Recommendation (for review, not decided)

**Adopt B's interaction model and information design, applied with A's restraint:**

1. **Structure and AI from B.** Unified ⌘K search/Ask, the career timeline and skills-over-time visualisations, project cards with architecture thumbnails, and the Ask workspace with inspectable tool calls, a results canvas and confirmation cards.
2. **Tone from A.** Light theme as the default (dark available). One action accent plus one "agent activity" accent. An editorial serif for article bodies and case-study prose. Citation-first answers with sources listed.
3. **Borrow from C.** The declarative "Lead · Build · Explain" capability statements and the swipeable project rail on mobile/landscape. Not the colour blocks or the floating pill.

Why: the brief says the site must show *who I am, what I've built, what I know, how I think, what I can deliver* and *how AI helps visitors explore*. B is the only direction where the AI and the data carry that argument. A's restraint keeps it credible for the decision-maker audience that matters most for a Delivery Director. C's personality is best used sparingly.

If you prefer lower risk and effort: **A with B's Ask workspace** is the conservative alternative.

## Decisions requested

| ID | Decision |
|---|---|
| DD-1 | Choose a direction (A / B / C / recommended hybrid) |
| DD-2 | Default theme: light-first (recommended) or dark-first |
| DD-3 | Tool-call transparency: visible by default (B) or on demand (C) |
| DD-4 | Portrait usage: small (A/B) or hero-scale (C) |
