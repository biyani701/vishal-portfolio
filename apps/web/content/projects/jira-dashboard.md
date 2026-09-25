---
slug: "jira-dashboard"
title: "JIRA Delivery Dashboard"
year: 2022
type: "work"
featured: 2
summary: "Sprints, worklogs and releases in one view, with an LLM over the data."
domains: ["delivery-tooling", "dashboards"]
stack: ["Python", "Dash", "PostgreSQL", "JIRA REST API", "KeePass", "Redis", "Docker", "Bitbucket Pipelines", "OpenAI"]
outcomes: []
links: {"bitbucket": "https://bitbucket.org/visby8em/jiradashboard"}
architecture: ["Jira REST API", "PostgreSQL", "Dash"]
---

A dashboard that gives a complete view of Jira project data. It pulls from the Jira REST API into PostgreSQL and presents release tracking, worklog analysis and sprint performance in Dash. Credentials are held in KeePass.

## What it does

- Release notes and version tracking
- Worklog analysis and time tracking
- Sprint performance metrics
- Service availability monitoring
- OpenAI ChatGPT integration over the data

## How it's built

Python and Dash on the front end, PostgreSQL for storage and analysis, Redis for caching, and KeePass for credentials. It ships as a Docker container through Bitbucket Pipelines.
