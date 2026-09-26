---
slug: "knowledge-base"
title: "Knowledge Base"
year: 2026
type: "personal"
highlighted: 1
status: "in-flight"
summary: "A payments and capital-markets knowledge base, with a searchable glossary, moving from static files to Neon Postgres."
domains: ["knowledge-management", "payments"]
stack: ["PostgreSQL", "Neon"]
outcomes: []
links: {}
site: {"url": "https://kb.biyani.xyz", "live": false}
architecture: ["Search · API", "Neon Postgres"]
---

The knowledge base collects notes from long delivery work across cards and payments, capital markets and market reference data: a glossary of 68 terms and topic notes in three domains. It used to be a set of static pages in this portfolio. It is becoming its own application at `kb.biyani.xyz`, with the content in Neon Postgres instead of files.

## Status

In progress. The glossary and topics are kept as its first data, and old `/knowledge` links on this site lead to this page until it is live.

## Planned

- Glossary and topics stored in Neon Postgres, with full-text search
- An API over the content, so other tools can look terms up
- The 3-D Secure authentication flow as an interactive, step-by-step explainer
