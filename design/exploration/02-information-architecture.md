# 02 — Information Architecture & Route Migration

## Principles
1. **Home argues; sections prove.** Home is a curated argument (who, what I deliver, proof, how to explore). Detail lives one click away.
2. **One fact, one source.** Career, projects, writing, knowledge and skills live in a typed `content/` layer. Pages, search and the AI agent all read the same records.
3. **Ask is a peer section, not a widget.** `/ask` is a real destination (deep-linkable conversations and starter prompts). Every page also offers *contextual* Ask ("Ask about this project").
4. **Three primary audiences:**
   - **Hiring / engagement decision-maker** (CTO, VP Eng, HR): 60-second credibility check.
   - **Technical peer**: projects, code, architecture.
   - **Domain learner**: payments and capital-markets knowledge, articles.

## Proposed sitemap

```
/                       Home
/about                  About — story, principles, how I lead, education, recognition
/experience             Experience — career timeline, roles, outcomes, capability map
/work                   Work — project index (filter by domain / tech / type)
/work/:slug             Project case study
/writing                Writing — articles (filter by topic)
/writing/:slug          Article
/knowledge              Knowledge — domain map (Payments, Reference Data, Capital Markets)
/knowledge/:domain      Domain overview
/knowledge/:domain/:topic   Topic explainer (incl. interactive 3DS flow)
/knowledge/glossary     Glossary (+ /knowledge/glossary/:term anchors)
/ask                    Ask — AI exploration of everything above
/contact                Contact
/colophon               How this site is built + credits (replaces /credits)
/legal/privacy  /legal/terms
/_dev                   dev-only diagnostics
```

Primary navigation (5 items + Ask + ⌘K): **Work · Experience · Writing · Knowledge · About**, then **Ask** (a distinct AI affordance), a **search** icon, and **Contact** (button). Legal, colophon and account live in the footer / account menu.

## Sections

| Section | Purpose | Audience | Primary journey | Relationships | Replaces |
|---|---|---|---|---|---|
| **Home** | 60-second answer to "who is this, and why should I care?" | Decision-makers first | Hero → proof strip (25+ yrs, 8 UK banks, 150+ mentored, 50+ apps) → selected work (3) → capabilities → latest writing → Ask prompt → Contact | Teasers into Work, Experience, Writing, Ask | `/` (Hero, stats) |
| **About** | Person, principles, leadership approach | Decision-makers | Story → how I work → education & recognition → Contact | Links to Experience | `/about`, `ProfileSummaryNew` (Executive Summary), Education, Recognition |
| **Experience** | Evidence of delivery over 25 years | Decision-makers, HR | Timeline → expand a role → outcomes → skills used → related projects | Roles ↔ projects ↔ skills | `Experience`, `CareerTimeline`, `Skills`, Certifications, ProfileSummary "Complete Profile" |
| **Work** | Evidence of building | Technical peers | Index → filter → case study (problem, approach, stack, architecture, outcome, links) → Ask about it | Project ↔ skills ↔ articles | `/works` |
| **Writing** | Thinking in public | Peers, learners | List → topic filter → long-form article → related knowledge | Article ↔ knowledge topics | `/blogs`, `/blogs/:id` |
| **Knowledge** | Domain expertise as a reference | Learners, domain peers | Domain map → topic → glossary terms inline → Ask a follow-up | Topic ↔ glossary ↔ articles | `/knowledge/*` |
| **Ask** | Conversational discovery over all content, with interactive results (cards, timelines, comparisons) | Everyone; especially time-poor visitors | Starter prompt → streamed answer with cited cards → follow-up / open page / contact | Reads every section; can hand off to Contact | `CopilotChatBubble` in the footer |
| **Contact** | Convert interest | Decision-makers | Intent choice (hire / collaborate / say hi) → form (Tally) | The Ask agent can pre-fill intent (with confirmation) | `/contact` |
| **Colophon** | Craft transparency: stack, AI assistance, credits | Peers | – | Links to the docs site | `/credits` |

## Route migration map

| Old route | New route | Redirect |
|---|---|---|
| `/` | `/` | – |
| `/about` (protected) | `/about` (public) | – |
| `/works` | `/work` | redirect |
| — (home anchors `#experience`, `#skills`, `#timeline`, `#certifications`) | `/experience` (+ `#skills`, `#certifications`) | anchors on `/` redirect to the new sections |
| `#education`, `#recognition`, `#summary` | `/about#education` etc. | redirect |
| `/blogs` | `/writing` | redirect |
| `/blogs/:blogId` | `/writing/:slug` (slug = existing id) | redirect |
| `/blog/new`, `/blog/edit/:id` | `/studio/writing[/…]` owner-only, **or removed** (D-3) | – |
| `/knowledge` | `/knowledge` | – |
| `/knowledge/glossary` | `/knowledge/glossary` | – |
| `/knowledge/domain/:categoryId` | `/knowledge/:domain` | redirect |
| `/knowledge/domain/:categoryId/:topicId` | `/knowledge/:domain/:topic` | redirect |
| `/knowledge/ThreeDSFlowStepper` | `/knowledge/credit-cards-payments/3ds-flow` | redirect |
| `/contact` | `/contact` | – |
| `/credits` | `/colophon` | redirect |
| `/privacy`, `/terms` | `/legal/privacy`, `/legal/terms` | redirect |
| `/signin`, `/signin-legacy`, `/login`, `/signin-toolpad`, `/logout`, `/profile`, `/account`, `/auth-callback`, `/auth-callback.html`, `/auth-success`, `/auth-error`, `/callback`, `/api/auth/callback/*` | `/` | redirect (amended 2026-09-26: the site has no sign-in; replaces D-4 and the auth-server contract rows) |
| `/auth-debug*`, `/auth-test`, `/config-test`, `/click-test`, `/viewport-demo` | `/_dev` (dev builds only) | – |
| — | `/ask`, `/ask?q=…`, `/experience`, `/work/:slug`, `/colophon` | new |

Redirects are client-side `<Navigate replace>` entries in one `redirects.ts` table, and are covered by a test that iterates over the table. The GitHub Pages `404.html` deep-link trick stays.

## Content model (feeds pages, search and AI)

```
content/
  profile.ts        identity, positioning, principles, proof metrics
  roles.ts          Role { org, client?, title, period, location, outcomes[], skills[], projects[] }
  projects/*.mdx    frontmatter { slug, title, year, type, domains[], stack[], outcomes[], links{} } + case-study body
  writing/*.md      frontmatter { slug, title, date, topics[], summary, readingTime } + body
  knowledge/        domains.ts, topics/*.mdx, glossary.ts (68 terms)
  skills.ts         Skill { name, group, since, until?, use: professional|personal|learning }
  credentials.ts    education, certifications, recognition
```

Build step: one generated search index + an `ai-context.json` digest that the agent tools query. The agent never sees anything that the site doesn't publish.
