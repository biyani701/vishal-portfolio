## Purpose

Keeps sign-in working against the existing Auth.js server while presenting it in the Programme design, and preserves every path the auth server depends on.

## ADDED Requirements

### Requirement: Preserved auth contract
The new site SHALL keep the existing Auth.js flows and paths unchanged: `/api/auth/callback/github`, `/api/auth/callback/google`, `/auth-callback`, `/auth-callback.html`, `/auth-success`, `/auth-error`, `/callback`, `/logout`, plus session retrieval from the auth server. No change to `apps/auth-server` is required.

#### Scenario: GitHub round trip
- **WHEN** a visitor signs in with GitHub from `/signin`
- **THEN** they return through the existing callback path, signed in, to the page they started from

### Requirement: Sign-in page
`/signin` SHALL list the configured providers as labelled buttons (at least 44px tall, with provider icon), show a busy state while redirecting, and show a recoverable error if the redirect can't start.

#### Scenario: Misconfiguration
- **WHEN** the auth server URL is missing and a provider is chosen
- **THEN** an error message is shown and the page stays usable

### Requirement: Account menu and page
When signed in, the header (or the navigation drawer) SHALL show an account menu with name, email, Account and Sign out. `/account` SHALL show the account details and the visitor's GitHub repositories, as the current profile page does. `/profile` SHALL redirect to `/account`.

#### Scenario: Sign out
- **WHEN** a signed-in visitor chooses Sign out
- **THEN** the session ends, the header shows Sign in, and they are on `/`
