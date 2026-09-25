# 06 — AI Experience (CopilotKit v2 / AG-UI)

> **Status (2026-09-25):**
> - UF-3 Base UI is accepted, and DD-3 is resolved in `10-design-decision.md` §6.
> - Presentation: questions set as headings, prose answers in Newsreader, results rendered with site components, and a numbered sources list.
> - Activity: plain-language activity lines with a StatusChip and expandable technical detail.
> - Surfaces: Base UI Drawer on mobile (bottom) and compact landscape (right, 60%), with `@react-aria/live-announcer` for announcements.
> - The earlier "threads sidebar" and "canvas" ideas are dropped. Conversation history lives in a menu in the Ask header (`useThreads`, browser-local).
> - The component mapping is in `05-component-architecture.md` §C.

## Current state
- `CopilotChatBubble.jsx` uses CopilotKit **1.8** `useCopilotChat` with a CopilotKit Cloud `publicApiKey`. It registers **no actions and no readable context**, so the assistant knows nothing about the portfolio. It lives inside the fixed footer and competes with back-to-top and the privacy button.
- The latest release is `@copilotkit/react-core@1.73.3`. It ships the v2 API under `@copilotkit/react-core/v2` (plus `/v2/headless`) and is built on `@ag-ui/client`. Available primitives were verified from the package: `CopilotKitProvider`, `useAgent`, `useAgentContext`, `useFrontendTool`, `useRenderToolCall`, `useRenderTool`, `useDefaultRenderTool`, `useHumanInTheLoop`, `useInterrupt`, `useConfigureSuggestions`, `useSuggestions`, `useThreads`.

## Product principles
1. **Ask is a destination and a lens.** `/ask` is a full page. Every project, article, role and glossary term has a contextual "Ask about this" that pre-seeds the question and passes page context.
2. **Grounded or silent.** The agent answers only from the published content index. Every answer cites the records it used. "I don't know from this site" is an acceptable answer.
3. **Show the work.** Tool calls are visible as quiet rows (name + arguments + result count) and expandable. Reasoning is summarised as the section being read. Raw chain-of-thought is never shown.
4. **Results are UI, not paragraphs.** Tool output renders as the same `ProjectCard`, `Timeline`, comparison table and glossary components the site uses.
5. **Nothing leaves without consent.** Any outward action (a contact draft, opening an external link on the visitor's behalf) goes through a human-in-the-loop confirmation card.
6. **Not gimmicky.** No avatar persona and no impersonation of Vishal: it is "the portfolio's assistant". No auto-open. No sound.

## Agent tools (read-only unless stated)
| Tool | Input | Output → rendered as |
|---|---|---|
| `search_content` | query, types[] | ranked records → result list with citations |
| `get_project` | slug | project record → `ProjectCard` / case-study excerpt |
| `compare_projects` | slugs[] | table → comparison table |
| `search_experience` | client/skill/period | roles → `Timeline` excerpt |
| `get_skill_history` | skill | usage periods → `CapabilityMap` row |
| `lookup_glossary` | term | term → glossary card with link |
| `explain_topic` | domain/topic | topic excerpt → knowledge card |
| `draft_contact_request` (**HITL**) | intent, message | draft → confirmation form → client-side Tally submit |
| `navigate` (frontend tool) | route | asks the visitor, then navigates |

The content index (`ai-context.json`) is generated at build time from `content/`. The agent never sees data that the site doesn't publish.

## States (designed in every direction's "AI states" artboard)
launcher · contextual actions · thinking · tool running (with stop) · tool complete → result · tool failed (degraded answer + retry) · error / connection lost (partial answer kept, marked incomplete) · suggested next actions · confirmation input.

## Architecture (see `diagrams/04-ai-agui-interaction.html`, `diagrams/02-application-shell.html`)
- Frontend: `AskProvider` → `CopilotKitProvider` (runtime URL from runtime-config) → headless hooks → our components.
- Runtime: the site is static on GitHub Pages, so the AG-UI runtime must run elsewhere.

### Decision D-9 — runtime host (needs approval; backend change)
| Option | Pros | Cons |
|---|---|---|
| **A. `/api/copilotkit` route in `apps/auth-server`** (Next 15, Vercel) — recommended | Already deployed on Vercel; same CORS/origin setup; keeps secrets server-side | Couples AI with auth deploys; adds LLM key to that project |
| B. New `apps/agent` Vercel function | Clean separation; independent scaling | A second deployment to run |
| C. CopilotKit Cloud (current `publicApiKey`) | No backend | Less control over tools/grounding; vendor-hosted agent; key in client |

Model choice, rate limiting (per IP plus a daily budget), a usage/cost cap, logging without PII, and prompt-injection defences (the content index is data, never instructions) belong to the D-9 implementation phase.

## Footer and launcher change (your note)
The Copilot bubble leaves the footer. Ask gets its **own nav item and route** (`/ask`) plus the ⌘K fallback and contextual buttons. The footer becomes static (not fixed), which removes the biggest vertical-space constraint in compact landscape and one of three competing floating overlays.
