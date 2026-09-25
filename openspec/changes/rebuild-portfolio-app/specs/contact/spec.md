## Purpose

Defines the application-owned Contact experience that replaces the Tally embed: intent selection, the message form, submission, confirmation and failure handling.

## ADDED Requirements

### Requirement: Contact form
`/contact` SHALL present an intent choice (A role; A programme or engagement; Something else), then name, email and message fields. The form uses Programme Field components with labels above and errors below. The owner's email SHALL also be shown as selectable text with a Copy button. No third-party form embed SHALL be used.

#### Scenario: Validation
- **WHEN** a visitor submits without an email address
- **THEN** the email field shows "Enter an email address so he can reply" and focus moves to it

### Requirement: Submission
Submitting SHALL POST to the API service's `POST /contact` endpoint (production: `https://api.vishal.biyani.xyz/contact`, built from `VITE_API_BASE_URL` + `/contact`). On success, the page SHALL show a confirmation stating that the message was sent and received. The confirmation SHALL appear only after the service acknowledges receipt.

#### Scenario: Successful send
- **WHEN** the service acknowledges the message
- **THEN** a confirmation replaces the form, and the message is announced to assistive technology

### Requirement: Failure handling
If submission fails, the form SHALL keep all values and show an inline alert explaining that nothing was sent, with Try again. The alert SHALL be announced assertively.

#### Scenario: Service unavailable
- **WHEN** the endpoint returns an error or times out
- **THEN** the values are kept, the alert says nothing was sent, and Try again resubmits

### Requirement: Abuse protection
The form SHALL include a honeypot field and SHALL respect server-side rate limits. When rate-limited, it SHALL show a message explaining when to try again.

#### Scenario: Rate limited
- **WHEN** the service responds with a rate-limit error
- **THEN** the form explains to try again later and keeps the message

### Requirement: Shared with Ask
Contact requests drafted by Ask SHALL use the same endpoint and the same validation rules as the Contact page.

#### Scenario: Ask draft
- **WHEN** a visitor confirms "Send request" in Ask
- **THEN** the message is delivered through the same contact endpoint
