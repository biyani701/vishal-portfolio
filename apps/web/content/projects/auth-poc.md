---
slug: "auth-poc"
title: "Multi-client OAuth Server"
year: 2025
type: "personal"
summary: "One Auth.js server that several front ends sign in through, each with its own GitHub and Google OAuth apps."
domains: ["web", "apis"]
stack: ["Next.js", "Auth.js", "Prisma", "PostgreSQL", "TypeScript", "Vercel"]
outcomes: []
links: {"github": "https://github.com/biyani701/vishal-lab"}
architecture: ["Client sites", "Auth.js server", "PostgreSQL"]
---

A proof of concept for sharing one sign-in service across several sites. The server runs Auth.js on Next.js, stores users and sessions in PostgreSQL through Prisma, and is deployed on Vercel. It works out which site a request comes from and signs the visitor in with that site's own GitHub or Google OAuth app, so each site keeps its own consent screen and credentials.

The previous version of this portfolio signed in through it, with callback pages that handed the session back to the static site. The rebuilt portfolio has nothing to sign in for, so the server and both portfolio clients now live in a lab repository as a learning project. The original repository, [my-oauth-proxy](https://github.com/biyani701/my-oauth-proxy), keeps the full history.

## What it does

- Sign-in with GitHub and Google through Auth.js
- Per-client OAuth credentials, chosen from the calling site's origin
- Sessions and accounts in PostgreSQL via Prisma
- Callback and sign-out flows for a static single-page app on another domain

## What would change

It was built to learn, and some of its decisions would not survive a review:

- Clients are matched by substring on the origin, so any `github.io` site counts as the portfolio. An exact allow-list is the fix.
- It sends `Access-Control-Allow-Origin: *` together with credentials, which browsers reject for credentialed requests. The allowed origin should be echoed from the same allow-list.
- It depends on a pre-release version of Auth.js.
