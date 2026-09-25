---
slug: "admin-dashboard"
title: "Admin Dashboard"
year: 2023
type: "work"
summary: "A Flask-Admin console for teams, users and NLP training data."
domains: ["internal-tools"]
stack: ["Python", "Flask", "Flask-Admin", "SQLAlchemy", "PostgreSQL", "KeePass", "uWSGI", "WTForms"]
outcomes: []
links: {}
architecture: ["Flask-Admin", "SQLAlchemy", "PostgreSQL"]
---

An administration console for managing teams, users and NLP training data. It is built on Flask-Admin with custom model views, validation and bulk creation, connects to PostgreSQL through SQLAlchemy, and keeps credentials in KeePass. It deploys with uWSGI.

## What it does

- Custom model views for teams, users and NLP training data
- Email validation against the user database
- Automatic account ID retrieval
- Bulk creation through Excel uploads
- Case-insensitive text search
- A role-based access control framework
