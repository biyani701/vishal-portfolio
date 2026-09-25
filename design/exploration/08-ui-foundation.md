# 08 — UI Foundation: MUI 9 vs shadcn/ui + Tailwind vs Mantine

> **Status:** UF-1 and UF-2 accepted 2026-09-25. **UF-3 was later decided as Base UI** (`09-primitive-foundation.md`). Where this report says "Radix", read "Base UI". Sonner, Command (cmdk) and Sheet (vaul) are replaced by Base UI Toast, Autocomplete and Drawer.

This is an architectural decision for the rewritten `apps/portfolio`. Keeping migration effort low is **not** a criterion, because the app is being rebuilt.
Versions were checked on npm on 2026-09-25.

## The options, as they are today

| | **MUI 9** | **shadcn/ui + Tailwind CSS** | **Mantine 9** |
|---|---|---|---|
| Latest | `@mui/material` 9.4.0 (2026-08-27) | `shadcn` CLI 4.21.0, `tailwindcss` 4.3.3 | `@mantine/core` 9.6.2 (2026-09-21) |
| What you install | A component library (npm dependency) | A CLI that **copies component source into your repo**, built on a headless primitive layer | A component library plus optional packages (charts, spotlight, code-highlight, form, dates…) |
| Primitives / a11y layer | MUI's own implementations | You choose: **Radix** (`radix-ui` 1.6.7), **Base UI** (`@base-ui/react` 1.8.0) or **React Aria** (`shadcn init --base radix\|base\|aria`) | Mantine's own, with Floating UI for positioning |
| Styling engine | **Emotion (runtime CSS-in-JS)**; `@emotion/react` is a required peer. Pigment CSS (zero-runtime) is still 0.0.31 | **Tailwind v4**: compiled static CSS, tokens as CSS variables via `@theme`, no runtime | **CSS Modules / static CSS** + CSS variables (no runtime CSS-in-JS since v7) |
| React support | ^17 \|\| ^18 \|\| ^19 | Radix/Base UI: ^16.8–^19 | **^19.2 only** |
| Design language | Material Design by default | None: unstyled primitives + your tokens | A neutral "Mantine look", fully themeable |
| Major-version cadence | v7 (2025) → v8 → v9 within ~18 months; Grid API broke twice | None for your copied code; primitive libraries are on semver 1.x | v7 (Sep 2023) → v8 (May 2025) → v9 (Mar 2026) |

## Evaluation against this project's requirements

**1. A bespoke visual identity (all three design directions are custom).**
- **MUI:** you fight Material defaults (ripple, elevation model, density, typography variants) through `styleOverrides` for every component. Our hybrid direction ends up re-skinning nearly all of it.
- **shadcn:** you start from unstyled primitives and write the look once, in tokens and `cva` variants. This fits best.
- **Mantine:** neutral defaults and a good Styles API. Less fighting than MUI, but you still override a house style.

**2. The responsive architecture (four mutually exclusive layout modes; landscape must not be overridden).**
- **Tailwind v4:** `@custom-variant compact-landscape (@media (orientation: landscape) and (max-height: 500px));` then `tablet`/`desktop` variants that exclude it. Components write `grid-cols-1 compact-landscape:grid-cols-2 desktop:grid-cols-3`. The mode system becomes a first-class, lint-checkable part of the styling language. It is the cleanest expression of design D1.
- **Mantine:** responsive style props and `hiddenFrom`/`visibleFrom` are width-only. Custom mode media works in CSS Modules through `postcss-preset-mantine` mixins, so it's workable, but component props and the mode system follow two models.
- **MUI:** `sx`/`styled` media keys are width breakpoints. Mode keys need a custom helper. This is the exact pattern that produced today's landscape bug.

**3. Accessibility.**
- All three are good.
- **shadcn** inherits Radix, Base UI or React Aria, the most battle-tested headless primitives for focus management, dismissal layers, typeahead and ARIA patterns.
- **MUI** is mature.
- **Mantine** is solid.

**4. Component coverage for *this* app** (dialog/sheet, menu, tabs, ⌘K palette, toast, tooltip, forms, carousel, charts, timeline, code highlighting).
- **Mantine is the broadest out of the box:** Spotlight (⌘K), Timeline, `@mantine/charts`, `@mantine/code-highlight`, Carousel, notifications and form.
- **shadcn covers most of it** through its registry: Command (cmdk), Sheet, Sonner, Chart (Recharts), Carousel (Embla), Form. Timeline and CodeBlock are custom work, but our designs need custom versions of both anyway.
- **MUI** has the core components and Timeline (in lab). It has no command palette, and charts live in the separate MUI X package.

**5. AI experience (CopilotKit v2 / AG-UI).**
- CopilotKit 1.73's v2 UI is itself built on **Tailwind v4, Radix, `class-variance-authority`, `tailwind-merge` and Lucide**, the same stack as shadcn. Its `v2/styles.css` is compiled Tailwind v4 CSS.
- We use the **headless** hooks either way. With shadcn, though, we can adapt CopilotKit's reference components (tool-call view, suggestion pills, message view) directly, and share tokens and icon set with no second styling system on the page.
- With MUI or Mantine, those references have to be translated. If any prebuilt CopilotKit piece is used, a second styling system ships alongside.

**6. Runtime performance and CSS model.**
- **Tailwind:** static CSS, no style-injection work at render, and a small stylesheet after tree-shaking.
- **Mantine:** static CSS, but the core stylesheet ships for all components unless you import per component.
- **MUI/Emotion:** style serialisation and insertion at runtime, plus the Emotion runtime in the bundle.
- For a content-heavy portfolio that aims for Lighthouse ≥ 90 on mobile (roadmap phase 6), zero-runtime CSS matters.

**7. Long-term ownership and upgrade risk.**
- **shadcn:** the code is yours. No forced majors, but also no automatic fixes: upgrades are a deliberate diff (`shadcn diff`). Radix and Base UI underneath are on stable semver.
- **MUI:** has already cost this project twice (Grid props silently dropped; Toolpad pinned to MUI 7). It is still Emotion-bound until Pigment matures.
- **Mantine:** majors are roughly yearly. Its **React ^19.2-only** peer range is fine for us, but it signals Mantine will track React closely.

**8. Productivity for you and for AI coding agents.**
- *Observation (not measured):* Tailwind and shadcn are widely used, so AI coding assistants tend to know them well. The evidenced point is that component source in the repo means an agent can read and modify it directly.
- Risk: class-string sprawl and inconsistent one-offs. Mitigations: variants live in `cva`; `prettier-plugin-tailwindcss` sorts classes; ESLint rules forbid arbitrary values (`[#hex]`, `[13px]`) outside `ui/`, which enforces the token rule from `05-component-architecture.md`.
- MUI and Mantine are well documented and familiar; MUI is what you know today.

## Scorecard

Weights reflect this project. Scores (1–5) are judgement calls based on the evidence above, not measurements.

| Criterion | Weight | MUI 9 | shadcn + Tailwind | Mantine 9 |
|---|---:|:-:|:-:|:-:|
| Bespoke identity / design freedom | 20 | 2 | **5** | 3 |
| Fit with layout-mode responsive architecture | 15 | 2 | **5** | 3 |
| Accessibility primitives | 15 | 4 | **5** | 4 |
| Component coverage for this app | 10 | 3 | 4 | **5** |
| CopilotKit v2 / AG-UI alignment | 10 | 2 | **5** | 3 |
| Runtime performance / CSS model | 10 | 2 | **5** | 4 |
| Long-term ownership / upgrade risk | 10 | 2 | **4** | 3 |
| Productivity (you + AI agents) | 10 | **4** | **4** | **4** |
| **Weighted total (/100)** | | **52** | **94** | **71** |

## Recommendation

**Adopt shadcn/ui + Tailwind CSS v4, with Lucide icons and `motion`** (primitive layer: see UF-3, now Base UI).

- Radix rather than Base UI or React Aria because it matches CopilotKit v2's own stack and has the largest registry ecosystem. Base UI is a credible alternative if you prefer its API; the CLI makes the choice per project.
- **Why:** it is the only option where our three hard requirements are native rather than worked around: a bespoke identity, four mutually exclusive layout modes, and an AI surface that feels native. Tokens become a single `@theme` block, the layout modes become Tailwind variants, and the Ask components share a stack with CopilotKit.
- **Runner-up: Mantine 9.** Choose it if you'd rather not own component code and want Spotlight, Timeline, charts and code highlighting ready-made. It is clearly better than MUI for this rewrite.
- **Not MUI 9** for the new app. Its strengths (a Material system and familiarity) don't serve a custom identity, and its runtime CSS and width-only responsive model work against the architecture we've designed.

### What we must do to make shadcn safe
1. **Tokens only:** `tokens.css` holds `@theme` plus light and dark variable sets; no raw colours or sizes in components (lint-enforced).
2. **Variants, not class soup:** every reusable component defines its states with `cva`; pages compose components and never style primitives directly.
3. **Own the upgrade path:** record the shadcn/registry version in `ui/README.md` and run `shadcn diff` quarterly.
4. **Browser floor:** Tailwind v4 targets modern evergreen browsers (Safari 16.4+, Chrome 111+, Firefox 128+). Confirm this is acceptable for your audience (decision UF-2).
5. **Custom builds:** CodeBlock (Shiki at build time), Timeline, CapabilityMap and ArchitectureFigure. These were custom in every option.

## Knock-on changes if approved
- `04-design-system.md`: tokens move from `tokens.ts → MUI theme` to `tokens.css` (`@theme`) with the same values. Remove "MUI underneath".
- `05-component-architecture.md`: the `ui/` layer becomes shadcn components (Dialog, Sheet, DropdownMenu, Tabs, Command, Tooltip, Sonner, Form) plus our custom components. Replace "MUI supplies behaviour" with "Radix supplies behaviour".
- `07-roadmap.md` Phase 3: **don't upgrade the old app to MUI 9.** Build the new app on a fresh Vite + React 19 + Tailwind v4 scaffold; the old app keeps running until cut-over. `apps/auth-server` (MUI 7 + Toolpad) is out of scope and unaffected.
- Diagram 05 (design-system layers): replace the "MUI 9" node with "Radix primitives".
- The OpenSpec change `modernize-react19-stack-and-responsive-layout` (which assumes MUI 9) needs revising when the rewrite change is written.

## Decisions requested
| ID | Decision | Recommendation |
|---|---|---|
| UF-1 | UI foundation | shadcn/ui + Tailwind v4 — **accepted 2026-09-25** |
| UF-2 | Browser floor (Safari 16.4+ / Chrome 111+ / Firefox 128+) | **Accepted 2026-09-25** |
| UF-3 | Primitive layer | **Base UI — accepted 2026-09-25** (see `09-primitive-foundation.md`; the Radix lean in this report is superseded) |
