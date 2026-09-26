## Purpose

Defines `apps/api`, a new Vercel service that hosts the AG-UI runtime and portfolio agent, and the contact endpoint, with the security, privacy and cost limits a public personal site needs.

## ADDED Requirements

### Requirement: Service boundary
`apps/api` SHALL be a separate Vercel project exposing only:
- the CopilotKit/AG-UI runtime endpoint
- `POST /contact`
- `GET /health`
- scheduled job endpoints under `/cron/` (AI model discovery; contact email retry and retention purge), which run only when called with the `CRON_SECRET` bearer token

It SHALL accept browser requests only from the production site origin, and from preview origins in non-production environments. All secrets SHALL live only in its Vercel environment.

#### Scenario: Unauthorised job call
- **WHEN** `/cron/ai-models` is called without the `CRON_SECRET` bearer token
- **THEN** it answers 401 and does nothing

#### Scenario: Foreign origin
- **WHEN** a request to the runtime arrives with an origin other than the site
- **THEN** the request is rejected by CORS and not processed

### Requirement: Grounded agent
The portfolio agent SHALL use only read-only tools over the published `ai-context.json`:
- search_content, get_project, compare_projects, search_experience, get_skill_history
- `draft_contact_request` as a human-in-the-loop step that never sends by itself

Retrieved content SHALL be treated as data, never as instructions.

#### Scenario: Prompt injection in content
- **WHEN** retrieved text contains "ignore previous instructions"
- **THEN** the agent does not change behaviour and answers normally from the data

### Requirement: Cost and abuse limits
The runtime SHALL enforce per-IP request limits, a maximum answer length, and a daily spending budget. It SHALL degrade gracefully when limits are reached.

#### Scenario: Budget exhausted
- **WHEN** the daily budget is used up
- **THEN** Ask shows that answers are unavailable until tomorrow and offers search and Contact

### Requirement: Contact endpoint
`POST /contact` SHALL:
1. validate the payload
2. reject honeypot hits
3. rate-limit per IP
4. **store the message**
5. email the owner through a transactional email provider

It SHALL respond with success only after the message is stored. Messages whose email failed SHALL be retried until they succeed or are flagged for attention.

#### Scenario: Email provider outage
- **WHEN** the email provider is down during a submission
- **THEN** the message is stored, the visitor sees success, and delivery is retried later

#### Scenario: Retention
- **WHEN** a stored message is older than the retention period stated in the privacy policy
- **THEN** it is deleted by a scheduled job

### Requirement: Configurable limits and retention
- Contact retention, the daily AI budget, per-IP limits for Ask and Contact, the maximum answer length, and the model IDs SHALL be read from environment configuration, with documented defaults.
- Secrets (the email provider key, LLM key and database URL) SHALL come only from the environment. They MUST NOT be committed or exposed to the browser.
- The service SHALL refuse to start when a required variable is missing, naming it.

#### Scenario: Change retention
- **WHEN** `CONTACT_RETENTION_DAYS` is changed from 365 to 180 and the service redeploys
- **THEN** the next purge deletes stored messages older than 180 days, with no code change

#### Scenario: Missing email key
- **WHEN** the service starts without `RESEND_API_KEY`
- **THEN** it fails its start-up check with a message naming `RESEND_API_KEY`

### Requirement: Email from the owner's domain
Contact notifications SHALL be sent through Resend from a verified sender on the owner's domain (`biyani.xyz`), with SPF and DKIM configured, so they aren't sent from an unverified address.

#### Scenario: Deliverability
- **WHEN** a contact notification is sent
- **THEN** it passes SPF and DKIM checks for `biyani.xyz`

### Requirement: Observability without personal data
The service SHALL log request outcomes, latencies, tool usage and errors, but MUST NOT log message bodies, email addresses or AI conversation text.

#### Scenario: Error log
- **WHEN** a contact submission fails validation
- **THEN** the log records the failure reason without the submitted content
