---
slug: "fast-jiraql"
title: "Fast-JiraQL"
year: 2023
type: "open-source"
featured: 1
summary: "One API for the questions delivery teams keep asking Jira: REST and GraphQL over Jira data in PostgreSQL."
domains: ["delivery-tooling", "apis"]
stack: ["Python", "FastAPI", "GraphQL", "Strawberry GraphQL", "PostgreSQL", "Redis", "SQLAlchemy", "MkDocs", "pytest"]
outcomes: []
links: {"github": "https://github.com/biyani701/fast-jiraql", "docs": "https://fast-jiraql.readthedocs.io/"}
architecture: ["Client", "REST · GraphQL", "PostgreSQL + Redis"]
---

Fast-JiraQL is an API for reading and working with Jira data through both REST and GraphQL. Jira data is stored in PostgreSQL; Redis caches hot queries; Microsoft identity handles authentication. The code uses dependency injection for a clean architecture, and the documentation is generated with MkDocs.

## What it does

- REST endpoints for Jira data
- A GraphQL API (Strawberry) for flexible queries
- Redis caching for faster responses
- Authentication with Microsoft identity
- OpenAPI documentation with code examples
- SQLAlchemy ORM over PostgreSQL

## How it's built

Dependency injection keeps the API, data access and caching layers separate. Tests run with pytest, and MkDocs publishes the documentation to Read the Docs.
