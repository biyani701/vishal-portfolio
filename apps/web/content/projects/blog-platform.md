---
slug: "blog-platform"
title: "Blog Platform"
year: 2026
type: "personal"
status: "in-flight"
summary: "Writing, drafts and publishing outside this site, replacing the blog that used to live inside it."
domains: ["web", "publishing"]
stack: ["Next.js", "Markdown", "Vercel"]
outcomes: []
links: {"github": "https://github.com/biyani701/blog"}
site: {"url": "https://blog.biyani.xyz", "live": false}
architecture: ["Editor", "Drafts · publish", "blog.biyani.xyz"]
---

The writing that used to be part of this portfolio is moving to a blogging tool of its own at `blog.biyani.xyz`. A proper editor, drafts and a publishing flow are more than a portfolio should carry, but they make a good project in their own right.

The previous portfolio had an in-browser editor bolted onto a static site. This is the version built as a product, with its own architecture and deployment.

## Status

In progress. The repository is up: a Next.js site that renders the three articles from Markdown, with drafts, an RSS feed and redirects from the old article ids. It isn't deployed yet, and old `/blogs` links on this site lead to this page until it is.

## Planned

- An editor for writing and revising articles in the browser
- Drafts, previews and publishing without a local checkout
- Owner-only sign-in for the editor
