---
slug: "knowledge-base"
title: "Knowledge Base"
year: 2026
type: "personal"
status: "in-flight"
summary: "A payments and capital-markets knowledge base, with a searchable glossary, moving from static files to Neon Postgres."
domains: ["knowledge-management", "payments"]
stack: ["Next.js", "PostgreSQL", "Neon"]
outcomes: []
links: {"github": "https://github.com/biyani701/kb"}
site: {"url": "https://kb.biyani.xyz", "live": false}
architecture: ["Search · API", "Neon Postgres"]
---

The knowledge base collects notes from long delivery work across cards and payments, capital markets and market reference data: a glossary of 68 terms and topic notes in three domains. It used to be a set of static pages in this portfolio. It is becoming its own application at `kb.biyani.xyz`, with the content in Neon Postgres instead of files.

## Status

In progress. The repository is up: the glossary and topics are seeded into Postgres, with full-text search, a read-only JSON API and the 3-D Secure flow as an interactive step-by-step view. It isn't deployed yet, and old `/knowledge` links on this site lead to this page until it is.

## Planned

- Deployment on Vercel with Neon Postgres at `kb.biyani.xyz`
- Ask on this site looking terms up through the knowledge base's API
- Editing terms and topics without a redeploy
