---
slug: "jpmorgan-reference-data"
title: "Re-engineering market reference-data processing"
kind: "programme"
headline: {"value": "4×", "label": "system-wide throughput"}
year: 2012
type: "work"
featured: 3
summary: "JPMorgan Chase (via Cognizant): re-engineered how the Global Market Reference Data platform, covering about 3 million securities, processes its vendor files."
domains: ["market-data", "programme-delivery"]
outcomes: []
links: {}
---

## Context

Global Market Reference Data covered approximately 3 million securities. Approximately 10–12 vendor files from multiple external market and reference-data sources arrived at daily, weekly and monthly frequencies.

I started on it as technical lead and moved into project and programme management, staying hands-on with the C++ design and development.

## The problem

Large monthly files created a processing bottleneck.

## What I did

I redesigned the processing around:

- Oracle tables that drive batch decisions
- multithreading
- queue-based C++ workers
- improved file handling

## Results

These are two related but separate measurements.

- **FNMA workload.** The FNMA (Fannie Mae) monthly-file workload went from approximately 20–24 days to approximately 2 days.
- **System-wide throughput.** Separately, database analysis measured approximately 4× throughput across the whole reference-data system.
