# 01 — Application Inventory

Snapshot of `apps/portfolio` on `main` @ `1c49ef5` (2026-09-25). This is read-only discovery: no code was changed.

Legend: **Keep** = retain the capability · **Redesign** = rebuild in the new design system · **Merge** = consolidate into another section · **Obsolete?** = propose removal, pending your decision (nothing is deleted automatically).

## 1. Content routes

| Route | Purpose | Component | Key functionality | Data source | Auth | Nav entry | Keep | Redesign | Consolidate | Obsolete? |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | Landing + full résumé | `Hero`, `ProfileSummaryNew`, `Skills`, `Experience`, `Certifications`, `Education`, `Recognition`, `CareerTimeline` | Typewriter roles, stat cards, CTA, tabbed "Complete Profile / Executive Summary", skills periodic table + filters, MUI Lab timeline, horizontal career timeline with logos | Inline arrays in each component; `skillSections` exported from `Skills.js` | – | Logo, "Home" | ✔ | ✔ | Split: Home becomes a *curated* landing; the résumé sections move to **/about** and **/experience** | – |
| `/about` | Personal story, roles | `AboutMe` | Animated role chips, narrative | Inline JSX | **Protected** | "About Me" | ✔ | ✔ | Merge with profile summary → **/about** (public) | Protection looks accidental (it's public-facing content) → **decision D-2** |
| `/profile` | Signed-in user's profile + their GitHub repos | `ProfilePage` | Calls `api.github.com/user/repos` with the user's token | GitHub API | **Protected** | Account menu | ✔ | ✔ | → **/account** | – |
| `/works` | Projects | `Works` (1,562 lines) | 5 projects, pinnable/hover sidebar, detail panel, tech chips, links (GitHub, docs, PyPI, Bitbucket, demo) | Inline `projects[]`; images are `via.placeholder.com` | – | "Portfolio" | ✔ | ✔ | Split list/detail → **/work**, **/work/:slug** | – |
| `/knowledge` | Knowledge hub | `KnowledgeBase` | Domain cards + glossary teaser | `domainKnowledgeData` (3 domains × 3 topics), `glossaryData` (68 terms) | – | "Knowledge Base" menu | ✔ | ✔ | → **/knowledge** | – |
| `/knowledge/glossary` | Payments/banking glossary | `Glossary` (848 lines) | Search, category filter, acronym cards | `glossaryData` | – | Knowledge menu | ✔ | ✔ | → **/knowledge/glossary** | – |
| `/knowledge/domain/:categoryId[/:topicId]` | Domain explainer | `DomainKnowledge` | Category → topic drill-down | `domainKnowledgeData` | – | Knowledge menu | ✔ | ✔ | → **/knowledge/:domain/:topic** | – |
| `/knowledge/ThreeDSFlowStepper` | 3-D Secure flow explainer | `ThreeDSFlowStepper` | MUI Stepper walkthrough | Inline `steps[]` | – | Knowledge menu | ✔ | ✔ (interactive diagram) | → **/knowledge/payments/3ds-flow** | – |
| `/blogs` | Article list | `BlogList` | Category filter, search, cards, AOS | `sampleBlogData` (3 posts) + `localStorage.blogs` | – | "Blog" menu | ✔ | ✔ | → **/writing** | – |
| `/blogs/:blogId` | Article | `BlogPost`, `BlogSidebar` | Markdown render (`react-markdown` + `rehype-sanitize`), related posts | same | – | – | ✔ | ✔ | → **/writing/:slug** | – |
| `/blog/new`, `/blog/edit/:blogId` | Author articles | `EnhancedBlogEditor` (Slate) | Rich editor; **saves to the visitor's own `localStorage`** | `localStorage` | **None** | Blog menu "Add" | ? | ✔ | → **/studio/writing** (owner-only) | **Decision D-3**: it looks like a publishing tool, but nothing is published |
| `/contact` | Contact | `Contact` | Tally form embed, gated by Klaro consent (`tally` + `norton`) | Tally `mB6PPe` | – | "Contact Me" | ✔ | ✔ | → **/contact** | – |
| `/credits` | Credits for libraries/AI help | `CreditsPage` | Credit cards | Inline | – | Footer | ✔ | ✔ | Merge into **/colophon** | – |
| `/privacy`, `/terms` | Legal | `PrivacyPolicy` (tabs) | Two tabs | Inline + docs-site links | – | Footer | ✔ | ✔ | → **/legal/privacy**, **/legal/terms** | – |
| `*` | 404 | inline `<div>` | – | – | – | – | ✔ | ✔ | Proper 404 with search + Ask | – |

### Navigation paths that go nowhere
`ImprovedNavbar.navigationItems` declares `/experience`, `/education`, `/skills`, `/projects` and `/achievements`, and uses `/resume/:id` as a fallback. None of them is routed; they're used only for icon lookup, and the menu items scroll to home anchors instead. The new information architecture gives `/experience` a real route.

## 2. Authentication routes (functional, not visual)

| Route | Component | Purpose | Keep? |
|---|---|---|---|
| `/signin` | `ModernSignIn` (Toolpad `SignInPage`) | Provider picker: GitHub, Google, Facebook, LinkedIn, Auth0 → Auth.js `/api/auth/signin/:provider` with `callbackUrl` + `client_id`; stores `auth_redirect` | ✔ Redesign (no Toolpad) |
| `/signin-legacy` | `SimpleSignIn` | Older picker | Obsolete? → **D-4** |
| `/signin-toolpad` | `ToolpadSignInPageWrapper` | Toolpad demo | Obsolete (Toolpad removed) |
| `/login` | `GitHubAuth` | GitHub-only sign-in | Obsolete? → **D-4** |
| `/logout` | `LogoutPage` | Sign-out via Auth.js `/api/auth/signout` | ✔ |
| `/auth-callback`, `/auth-callback.html`, `/auth-success`, `/auth-error` | callback pages | Auth.js return + status | ✔ (contract with auth-server; keep paths) |
| `/api/auth/callback/github`, `/api/auth/callback/google` | `GitHubCallback`, `GoogleCallback` | Client-side callback handlers (GH Pages 404 trick) | ✔ (keep paths) |
| `/callback` | `GitHubCallback` | Legacy callback | ✔ until the auth-server config is confirmed not to use it |

`/auth-callback` and `/auth-debug` are each declared **twice** in `App.js` (the first match wins).

## 3. Debug / test routes

| Route | Component | Proposal |
|---|---|---|
| `/auth-debug` | `AuthServerDebug` (the second declaration, `AuthDebug`, is unreachable) | Dev-only build flag |
| `/auth-debug-tool` | `AuthDebugTool` | Dev-only |
| `/auth-test` | `AuthTestPage` | Dev-only |
| `/click-test` | `ClickTest` | Obsolete? |
| `/config-test` | `ConfigTest` | Dev-only |
| `/viewport-demo` | `ViewportDemo` | Obsolete (demonstrates the layout hooks being replaced) |

→ **Decision D-5**: fold all of these into one dev-only `/_dev` page with tabs.

## 4. Shared capabilities

| Capability | Where today | Notes / issues | Rewrite |
|---|---|---|---|
| Navigation | `ImprovedNavbar` (1,982 lines) + `EnhancedMobileDrawer` (716) + `ModernMobileMenu` (1,003) | Three navigation implementations. Resume mega-menu scrolls to anchors. Knowledge and Blog menus. Width-only mode detection (desktop nav on landscape phones) | One `Navigation` with 3 compositions (desktop / drawer / compact-landscape rail) |
| Search | Navbar, `flexsearch` `Document` index | Indexes `resumeData.js`, which is **placeholder text** ("XYZ University", "Senior Analyst") that contradicts the real experience, plus skills and knowledge | Global ⌘K palette over one real content index; AI is offered as a fallback |
| Authentication | `AuthProvider`/`AuthContext` (two contexts: `useAuthContext`, `useLegacyAuth`), `AuthJsClient`, `AuthSessionCheck` | Auth.js on `apps/auth-server` (Next 15, Vercel); session via `/api/auth/session` | Keep the contract; one context |
| Account menu | Toolpad `Account` inside the navbar/drawers | Toolpad pins MUI 7 | MUI-native `AccountMenu` |
| Theme / palette | `App.js` mode + `paletteIndex`, cookies (Klaro-gated) + `localStorage`, `theme.js` (735 lines, several palettes) | Palette picker in the navbar | Light/dark/system; palettes → **D-6** (keep or drop) |
| AI / Copilot | `CopilotChatBubble` (CopilotKit 1.8, `useCopilotChat`, `publicApiKey` → CopilotKit Cloud) inside the footer | **No actions, no readable context**: the assistant knows nothing about the portfolio. Fixed bubble competes with back-to-top and the privacy button | First-class `/ask` + contextual launcher, CopilotKit v2 / AG-UI (see 06) |
| Footer | `FooterNew` | `styled()` created inside render (remounts every render). Hosts the Copilot bubble. Fixed position eats vertical space | Static (non-fixed) footer; AI moves out |
| Consent | Klaro (`public/klaro*.js`, `klaro-config.js`), `PrivacyPreferencesButton` | Gates theme cookies, Tally, analytics | Keep; restyle Klaro CSS with tokens |
| Analytics | `utils/analytics.js` (`trackClick`) | Consent-gated | Keep |
| Runtime config | `public/runtime-config.js` → `window.__RUNTIME_CONFIG__`, `config.js` | Overrides auth URLs at runtime | Keep |
| Notifications | MUI `Snackbar` ad hoc (sign-in, editor), `alert()` in editor | Inconsistent | `Toast` primitive |
| Overlays | Back-to-top `Fab`, Copilot bubble, privacy button, Klaro banner | Collide in landscape | One overlay stack; AI launcher is part of the nav on small screens |
| Dialogs / drawers | MUI Dialog/Drawer, footer "Connect" drawer | – | `Dialog`, `Sheet` |
| Forms | Tally embed (contact), sign-in, blog editor | – | `Field`, `Input`; Tally stays |
| Markdown / content | `react-markdown` + `rehype-sanitize` (blog) | No syntax highlighting | `MarkdownContent` + `CodeBlock` (Shiki, build-time) |
| Code blocks | none styled | – | `CodeBlock` with copy button |
| Project cards | `Works` inline | Placeholder images | `ProjectCard` |
| Article cards | `BlogList` inline | – | `ArticleCard` |
| Filtering | Blog categories, glossary categories, skills filter | Three implementations | `FilterBar` |
| Tables / grids | Skills "periodic table", glossary grid | Legacy Grid props dropped by MUI 7 | `ResponsiveGrid` |
| Timelines | `@mui/lab` Timeline (Experience) + custom horizontal `CareerTimeline` | Two timelines of the same career | One `Timeline` component (vertical / horizontal) |
| Charts / visualization | Skills proficiency bars (ProfileSummary), periodic table | – | Capability map (see directions) |
| Animation | AOS (`data-aos`) + framer-motion + CSS keyframes | Three systems | `motion` only, tokenised |
| Docs site | `apps/portfolio/docs-site` (Docusaurus) at `/docs` | Linked for policies/SBOM | Out of scope; link from `/colophon` |

## 5. Content inventory (the facts the redesign presents)

- **Identity**: Vishal Biyani, Mumbai. Principal Project Analyst (CoreCard). Positioned as a Technical Program Manager / Delivery Director with 25+ years of experience.
- **Career**: Tata Infotech (2000–03, Senior Software Engineer) → Cognizant (2003–19: JP Morgan Chase TPM 2003–12; IFC / World Bank Group Senior Manager 2012–14, 50+ apps, 24 onsite + 26 offshore; BFS UK Delivery Lead 2014–19, 8 UK banking clients, P&L) → CoreCard (2019–present: Agile PMO, 150+ mentored, key-account delivery).
- **Education**: M.Tech Energy Systems Engineering, IIT Bombay (1998–2000; the source misspells "Enery"); B.E. Chemical Engineering, GEC Raipur (1994–98).
- **Certification**: AWS Solutions Architect – Associate (Sep 2020).
- **Recognition**: Manager of the Quarter (Q3 2021), Project of the Year (2013), Guiding Star (Q4 2009).
- **Projects (5)**: Portfolio Website; Confluence Space Pages Details (PyPI); Fast-JiraQL (FastAPI + GraphQL + Redis); JIRA Dashboard (Dash + PostgreSQL + OpenAI); Admin Dashboard (Flask-Admin, NLP data).
- **Skills**: Programming, Frontend, Database, SCM, Testing, Visualization, each with start/end dates, current/past usage and professional/personal/learning use. Tools (Jira, Confluence, MS Project) with levels.
- **Writing (3 sample posts)**: "The Rise of AI Agents: Augment, Cursor, WindSurf"; "Innovations in Credit Card and Payments: 2023 Trends"; "Top AI Tools Transforming Productivity in 2023".
- **Knowledge**: Credit Cards & Payments (Card Networks, Payment Processing, Fraud Prevention); Market Reference Data (Security Identifiers, Pricing Data, Corporate Actions); Capital Markets (Trading Systems, Post-Trade, Risk Management); 3-D Secure flow; 68-term glossary.

### Content-quality findings (decisions for you, not fixes)
1. `resumeData.js` (navbar search) is placeholder text that contradicts the real content → **D-7**: replace it with the real content index.
2. Experience appears in three places with different granularity (`ProfileSummaryNew`, `Experience`, `CareerTimeline`), and recognition in two. The rewrite uses one `content/` source.
3. Project images are placeholders and there are no outcome metrics per project → **D-8**: supply screenshots/metrics, or accept typographic cards.
4. The Fast-JiraQL demo URL is `*.example.com` (not real).

## 6. Decisions from this inventory

> **Resolved 2026-09-25.** See `11-final-design-package.md` §13 (D-3: editor removed; D-9: new `apps/api` on Vercel; others as recommended).

| ID | Decision | Recommendation |
|---|---|---|
| D-1 | Split the long homepage into Home (curated) + About + Experience | Yes |
| D-2 | Make `/about` public | Yes: it is portfolio content |
| D-3 | Blog editor that saves to the visitor's localStorage | Keep writing as Markdown files in the repo (`content/writing/*.md`). Remove the in-browser editor, or keep it owner-only as `/studio` with export-to-Markdown |
| D-4 | `/signin-legacy`, `/login` | Remove; `/signin` covers both |
| D-5 | Debug routes | Single dev-only `/_dev` |
| D-6 | Multiple colour palettes picker | Drop; offer light / dark / system only (the palette picker dilutes the new identity) |
| D-7 | Placeholder `resumeData` search source | Replace with the real content index |
| D-8 | Project imagery / metrics | Provide 1 screenshot + 1–3 outcome facts per project; typographic fallback |
| D-9 | Where the AG-UI runtime runs (site is static on GitHub Pages) | New `/api/copilotkit` route on `apps/auth-server` (Vercel) — **backend change, needs approval** (see 06) |
