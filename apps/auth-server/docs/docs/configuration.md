---
sidebar_position: 3
---

# Configuration

This guide explains how to configure the Auth.js Multi-Client system for your specific needs.

## Environment Variables

The Auth.js Multi-Client system uses environment variables for configuration. These should be set in your `.env.local` file during development and in your hosting platform's environment variables for production.

### Required Environment Variables

```bash
# Auth.js secret - used to encrypt cookies and tokens
AUTH_SECRET="your-auth-secret-here"

# URL configuration
NEXTAUTH_URL="https://your-auth-server-url.com"
```

### OAuth Provider Credentials

```bash
# Google OAuth credentials
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Default GitHub credentials (fallback)
GITHUB_CLIENT_ID_DEFAULT="default-github-client-id"
GITHUB_CLIENT_SECRET_DEFAULT="default-github-client-secret"

# Facebook OAuth credentials
FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"

# LinkedIn OAuth credentials
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"

# Auth0 credentials
AUTH0_CLIENT_ID="your-auth0-client-id"
AUTH0_CLIENT_SECRET="your-auth0-client-secret"
AUTH0_ISSUER="https://your-auth0-domain.auth0.com"
```

### Client-Specific GitHub Credentials

If you have multiple clients that need different GitHub OAuth credentials:

```bash
# Client 1 specific GitHub credentials
GITHUB_CLIENT_ID_CLIENT1="client1-github-client-id"
GITHUB_CLIENT_SECRET_CLIENT1="client1-github-client-secret"

# Client 2 specific GitHub credentials
GITHUB_CLIENT_ID_CLIENT2="client2-github-client-id"
GITHUB_CLIENT_SECRET_CLIENT2="client2-github-client-secret"

# Portfolio specific GitHub credentials
GITHUB_CLIENT_ID_PORTFOLIO="portfolio-github-client-id"
GITHUB_CLIENT_SECRET_PORTFOLIO="portfolio-github-client-secret"
```

### Debug Configuration

```bash
# Comma-separated list of email addresses that can access the debug page
AUTHORIZED_DEBUG_EMAILS="your-email@example.com,another-email@example.com"
```

## Client Identification

The system identifies clients based on their origin (domain). This is configured in the `identifyClient` function in `auth.config.ts`:

```typescript
export const identifyClient = (origin?: string): ClientId => {
  if (!origin) return ClientId.DEFAULT;

  // Map origins to client IDs
  if (origin.includes('client1.com') || origin.includes('localhost:3001')) {
    return ClientId.CLIENT1;
  } else if (origin.includes('client2.com') || origin.includes('localhost:3002')) {
    return ClientId.CLIENT2;
  } else if (origin.includes('vishal.biyani.xyz') || origin.includes('github.io')) {
    return ClientId.PORTFOLIO;
  } else if (origin.includes('my-oauth-proxy.vercel.app')) {
    // Vercel deployment domain
    return ClientId.DEFAULT;
  }

  // Default fallback
  return ClientId.DEFAULT;
};
```

You should modify this function to match your specific client domains.

## Cookie Configuration

The system configures cookies for cross-origin authentication. This is set in the `auth.ts` file:

```typescript
cookies: {
  sessionToken: {
    name: `next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'none',
      path: '/',
      secure: true,
      domain: process.env.COOKIE_DOMAIN,
    }
  },
  // ... other cookies
}
```

If you need to set a specific cookie domain, you can add the `COOKIE_DOMAIN` environment variable.

## Adding New OAuth Providers

To add a new OAuth provider:

1. Install the provider package if needed
2. Import the provider in `auth.config.ts`
3. Add environment variables for the provider credentials
4. Add the provider to the `createAuthConfig` function
5. Update the provider validation in `src/app/api/auth/signin/[provider]/route.ts`
