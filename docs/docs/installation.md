---
sidebar_position: 2
---

# Installation

This guide will walk you through the process of installing and setting up the Auth.js Multi-Client system.

## Prerequisites

Before you begin, make sure you have the following:

- Node.js 18.x or later
- npm or yarn
- A Next.js 14.x or later project
- GitHub and/or Google developer accounts for OAuth credentials

## Installing Dependencies

First, install the required dependencies in your Next.js project:

```bash
# Using npm
npm install next-auth@beta

# Using yarn
yarn add next-auth@beta
```

## Project Structure

Create the following file structure in your project:

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/
│   │       │   └── route.ts
│   │       ├── signin/
│   │       │   └── [provider]/
│   │       │       └── route.ts
│   │       └── error/
│   │           └── route.ts
│   └── auth-error/
│       └── page.tsx
├── auth.config.ts
├── auth.ts
└── middleware.ts
```

## Setting Up Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```bash
# Auth.js secret - used to encrypt cookies and tokens
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

# Node environment
NODE_ENV="development"
```

Replace the placeholder values with your actual OAuth credentials.

## Implementing Core Files

### 1. auth.config.ts

This file contains the configuration for Auth.js, including client identification and credential selection:

```typescript
import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

/**
 * Enum representing different client identifiers
 */
export enum ClientId {
  DEFAULT = 'default',
  CLIENT1 = 'client1',
  CLIENT2 = 'client2',
  PORTFOLIO = 'portfolio'
}

/**
 * Identifies the client based on the request origin
 */
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

// Helper function to get OAuth credentials based on origin
export const getProviderCredentials = (origin?: string) => {
  const clientId = identifyClient(origin);
  
  // Get GitHub credentials based on client ID
  let githubClientId: string;
  let githubClientSecret: string;
  
  switch (clientId) {
    case ClientId.CLIENT1:
      githubClientId = process.env.GITHUB_CLIENT_ID_CLIENT1!;
      githubClientSecret = process.env.GITHUB_CLIENT_SECRET_CLIENT1!;
      break;
    case ClientId.CLIENT2:
      githubClientId = process.env.GITHUB_CLIENT_ID_CLIENT2!;
      githubClientSecret = process.env.GITHUB_CLIENT_SECRET_CLIENT2!;
      break;
    case ClientId.PORTFOLIO:
      githubClientId = process.env.GITHUB_CLIENT_ID_PORTFOLIO!;
      githubClientSecret = process.env.GITHUB_CLIENT_SECRET_PORTFOLIO!;
      break;
    default:
      githubClientId = process.env.GITHUB_CLIENT_ID_DEFAULT!;
      githubClientSecret = process.env.GITHUB_CLIENT_SECRET_DEFAULT!;
  }
  
  return {
    githubClientId,
    githubClientSecret,
    googleClientId: process.env.GOOGLE_CLIENT_ID!,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    clientId: clientId
  };
};

// Base configuration without providers
export const baseAuthConfig: Omit<NextAuthConfig, "providers"> = {
  // Configuration details...
};

// Create the full config with providers based on context
export const createAuthConfig = (origin?: string): NextAuthConfig => {
  const { githubClientId, githubClientSecret, googleClientId, googleClientSecret } = 
    getProviderCredentials(origin);
  
  return {
    ...baseAuthConfig,
    providers: [
      Google({
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      }),
      GitHub({
        clientId: githubClientId,
        clientSecret: githubClientSecret,
      }),
    ],
  };
};

export const authConfig = createAuthConfig();
```

See the [Configuration](configuration.md) page for more details on configuring the system.

## Running the Server

Start your Next.js development server:

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

Your Auth.js Multi-Client server should now be running on http://localhost:3000 (or the port you've configured).
