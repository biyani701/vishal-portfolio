# Multi-Client Auth.js Setup

This document explains how the Auth.js setup has been configured to handle multiple clients with different OAuth credentials.

## Overview

The authentication server is designed to:

1. Detect which client is making the authentication request based on the origin header
2. Use client-specific OAuth credentials for the authentication flow
3. Store the client origin in the user's session for future reference
4. Allow different clients to use their own GitHub OAuth applications

## How It Works

### Client Identification

Clients are identified by their origin (domain) using the `identifyClient` function in `auth.config.ts`. The function maps origins to client IDs:

```typescript
export enum ClientId {
  DEFAULT = 'default',
  CLIENT1 = 'client1',
  CLIENT2 = 'client2',
  PORTFOLIO = 'portfolio'
}

export const identifyClient = (origin?: string): ClientId => {
  if (!origin) return ClientId.DEFAULT;

  if (origin.includes('client1.com') || origin.includes('localhost:3001')) {
    return ClientId.CLIENT1;
  } else if (origin.includes('client2.com') || origin.includes('localhost:3002')) {
    return ClientId.CLIENT2;
  } else if (origin.includes('vishal.biyani.xyz') || origin.includes('github.io')) {
    return ClientId.PORTFOLIO;
  }

  return ClientId.DEFAULT;
};
```

### Credential Selection

Based on the identified client, the appropriate OAuth credentials are selected:

```typescript
export const getProviderCredentials = (origin?: string) => {
  const clientId = identifyClient(origin);

  let githubClientId: string;
  let githubClientSecret: string;

  switch (clientId) {
    case ClientId.CLIENT1:
      githubClientId = process.env.GITHUB_CLIENT_ID_CLIENT1!;
      githubClientSecret = process.env.GITHUB_CLIENT_SECRET_CLIENT1!;
      break;
    // ... other cases
  }

  return {
    githubClientId,
    githubClientSecret,
    // ... other credentials
  };
};
```

### Dynamic Auth.js Configuration

For each request, a dynamic Auth.js configuration is created based on the client origin:

```typescript
const createDynamicHandler = async (req: Request | NextRequest) => {
  const origin = req.headers.get("origin") ||
                req.headers.get("x-client-origin") ||
                req.headers.get("referer");

  const dynamicAuthConfig = createAuthConfig(origin || undefined);

  const handler = NextAuth({
    ...dynamicAuthConfig,
    // ... other configuration
    events: {
      signIn: ({ account }) => {
        if (account && origin) {
          account.clientOrigin = origin;
        }
      }
    }
  });

  return handler;
};
```

### Client Information in Session

The client information is stored in the JWT token and session:

```typescript
jwt({ token, user, account, profile }) {
  if (account && user) {
    const clientId = account.clientOrigin
      ? identifyClient(account.clientOrigin as string)
      : ClientId.DEFAULT;

    return {
      ...token,
      userId: user.id,
      provider: account.provider,
      clientOrigin: account.clientOrigin as string | undefined,
      clientId: clientId
    };
  }
  return token;
},
session({ session, token }) {
  if (token && session.user) {
    session.user.id = token.userId as string;
    session.user.provider = token.provider as string;

    // Add client information to the session
    session.user.clientOrigin = token.clientOrigin as string | undefined;
    session.user.clientId = token.clientId as string | undefined;
  }
  return session;
}
```

## Environment Variables

The following environment variables need to be set:

```
# Auth.js secret
AUTH_SECRET="your-auth-secret-here"

# Default GitHub credentials (fallback)
GITHUB_CLIENT_ID_DEFAULT="default-github-client-id"
GITHUB_CLIENT_SECRET_DEFAULT="default-github-client-secret"

# Client 1 specific GitHub credentials
GITHUB_CLIENT_ID_CLIENT1="client1-github-client-id"
GITHUB_CLIENT_SECRET_CLIENT1="client1-github-client-secret"

# Client 2 specific GitHub credentials
GITHUB_CLIENT_ID_CLIENT2="client2-github-client-id"
GITHUB_CLIENT_SECRET_CLIENT2="client2-github-client-secret"

# Portfolio specific GitHub credentials
GITHUB_CLIENT_ID_PORTFOLIO="portfolio-github-client-id"
GITHUB_CLIENT_SECRET_PORTFOLIO="portfolio-github-client-secret"

# Google credentials (common for all clients in this example)
GOOGLE_CLIENT_ID="google-client-id"
GOOGLE_CLIENT_SECRET="google-client-secret"
```

## Setting Up GitHub OAuth Apps

For each client, you need to create a separate GitHub OAuth App:

1. Go to GitHub Developer Settings > OAuth Apps > New OAuth App
2. Set the Homepage URL to the client's domain (e.g., https://client1.com)
3. Set the Authorization callback URL to your Auth.js server's callback URL (e.g., https://my-oauth-proxy.vercel.app/api/auth/callback/github)
4. Get the Client ID and Client Secret and add them to your environment variables

## Testing

To test different clients locally:

1. Run your Auth.js server on port 4002
2. Run client 1 on port 3001
3. Run client 2 on port 3002
4. The server will detect the origin and use the appropriate credentials
