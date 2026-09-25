---
slug: "confluence-pages-details"
title: "Confluence Space Pages Details"
year: 2023
type: "open-source"
featured: 3
summary: "Async extraction of Confluence spaces into structured data, published on PyPI."
domains: ["developer-tools", "knowledge-management"]
stack: ["Python", "asyncio", "KeePass", "Confluence API", "JSON"]
outcomes: []
links: {"github": "https://github.com/vishalbiyani/get-confluence-space-pages-details", "docs": "https://get-confluence-space-pages-details.readthedocs.io/", "pypi": "https://pypi.org/project/get-confluence-space-pages-details/"}
architecture: ["Confluence API", "async extractor", "JSON"]
---

A Python tool that automates extracting and formatting the pages of a Confluence space. It keeps credentials in KeePass, writes structured JSON, filters out unwanted pages and uses asynchronous API requests for speed. An enrichment step can extend glossary descriptions with external sources such as Wikipedia and Investopedia.

## What it does

- Extracts page details from Confluence spaces
- Manages credentials securely with KeePass
- Writes the results as structured JSON
- Filters out unwanted pages
- Makes asynchronous API requests
- Enriches glossary descriptions with external data

## Install

```bash
pip install get-confluence-space-pages-details
```
