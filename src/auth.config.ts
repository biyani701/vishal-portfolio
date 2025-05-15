import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import LinkedIn from "next-auth/providers/linkedin";
import Auth0Provider from "next-auth/providers/auth0";

/**
 * @fileoverview Auth.js configuration for multi-client support
 *
 * This file contains the configuration for Auth.js with support for multiple clients.
 * It provides functions to identify clients based on their origin and to select
 * the appropriate OAuth credentials for each client.
 *
 * @module auth.config
 */

/**
 * Enum representing different client identifiers
 * Used to map origins to specific client configurations
 *
 * @enum {string}
 */
export enum ClientId {
  /** Default client when no specific client is identified */
  DEFAULT = 'default',
  /** Client 1 - typically running on localhost:3001 in development */
  CLIENT1 = 'client1',
  /** Client 2 - typically running on localhost:3002 in development */
  CLIENT2 = 'client2',
  /** Portfolio client - running on GitHub Pages or vishal.biyani.xyz */
  PORTFOLIO = 'portfolio'
}

/**
 * Identifies the client based on the request origin
 *
 * @param {string} [origin] - The origin header from the request
 * @returns {ClientId} The identified client ID
 *
 * @example
 * // Returns ClientId.PORTFOLIO
 * identifyClient('https://vishal.biyani.xyz')
 *
 * @example
 * // Returns ClientId.CLIENT1
 * identifyClient('http://localhost:3001')
 */
export const identifyClient = (origin?: string): ClientId => {
  if (!origin) return ClientId.DEFAULT;

  // Map origins to client IDs
  if (origin.includes('client1.com')) {
    return ClientId.CLIENT1;
  } else if (origin.includes('client2.com') || origin.includes('localhost:3002')) {
    return ClientId.CLIENT2;
  } else if (origin.includes('vishal.biyani.xyz') || origin.includes('github.io') ||
             origin.includes('localhost:3000') || origin.includes('localhost:3001')) {
    console.log('portfolio', ClientId.PORTFOLIO);
    return ClientId.PORTFOLIO;
  } else if (origin.includes('my-oauth-proxy.vercel.app')) {
    // Vercel deployment domain
    return ClientId.DEFAULT;
  }

  // Default fallback
  return ClientId.DEFAULT;
};

// Helper function to get OAuth credentials based on origin
export const getProviderCredentials = (origin?: string) => {
  const clientId = identifyClient(origin);
  console.log('clientId', clientId);

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

  // Log which client credentials we're using (always log in Vercel)
  console.log(`[auth] Using ${clientId} credentials for origin: ${origin || 'unknown'}, githubClientId: ${githubClientId}`);

  // Log Auth0 configuration to help debug
  if (process.env.AUTH0_ISSUER) {
    console.log(`[auth] Auth0 issuer configured: ${process.env.AUTH0_ISSUER}`);
  } else {
    console.log(`[auth] Warning: Auth0 issuer not configured`);
  }

  return {
    // GitHub credentials
    githubClientId,
    githubClientSecret,

    // Google credentials
    googleClientId: process.env.GOOGLE_CLIENT_ID!,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,

    // Facebook credentials
    facebookClientId: process.env.FACEBOOK_CLIENT_ID!,
    facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET!,

    // LinkedIn credentials
    linkedinClientId: process.env.LINKEDIN_CLIENT_ID!,
    linkedinClientSecret: process.env.LINKEDIN_CLIENT_SECRET!,

    // Auth0 credentials
    auth0ClientId: process.env.AUTH0_CLIENT_ID!,
    auth0ClientSecret: process.env.AUTH0_CLIENT_SECRET!,
    auth0Issuer: process.env.AUTH0_ISSUER!,

    // Return the identified client ID for reference
    clientId: clientId
  };
};

// Helper function to check if a user is authorized for debug access
const isAuthorizedForDebug = (email?: string | null): boolean => {
  if (!email) return false;

  const authorizedEmails = process.env.AUTHORIZED_DEBUG_EMAILS?.split(',') || [];
  return authorizedEmails.includes(email);
};

// Base configuration without providers (providers will be added dynamically)
export const baseAuthConfig: Omit<NextAuthConfig, "providers"> = {
  pages: {
    signIn: "/login",
    error: "/auth-error",
  },
  debug: process.env.NODE_ENV === 'development',
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtectedPage = nextUrl.pathname.startsWith("/protected");
      const isOnProfilePage = nextUrl.pathname.startsWith("/profile");
      const isOnDebugPage = nextUrl.pathname.startsWith("/protected/debug");

      // Special handling for debug page - only authorized users
      if (isOnDebugPage) {
        if (isLoggedIn && isAuthorizedForDebug(auth.user.email)) {
          return true;
        }
        return false; // Redirect to login page
      }

      // Regular protected pages
      if (isOnProtectedPage || isOnProfilePage) {
        if (isLoggedIn) return true;
        return false; // Redirect to login page
      }

      return true;
    },
    jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // Get the client ID from the account if available
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
    },
  },
};

// Create the full config with providers based on context
export const createAuthConfig = (origin?: string): NextAuthConfig => {
  const {
    githubClientId,
    githubClientSecret,
    googleClientId,
    googleClientSecret,
    facebookClientId,
    facebookClientSecret,
    linkedinClientId,
    linkedinClientSecret,
    auth0ClientId,
    auth0ClientSecret,
    auth0Issuer
  } = getProviderCredentials(origin);

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
      Facebook({
        clientId: facebookClientId,
        clientSecret: facebookClientSecret,
        // Add explicit redirect URI for Facebook
        authorization: {
          params: {
            redirect_uri: process.env.NEXTAUTH_URL
              ? `${process.env.NEXTAUTH_URL}/api/auth/callback/facebook`
              : `https://my-oauth-proxy.vercel.app/api/auth/callback/facebook`
          }
        }
      }),
      LinkedIn({
        clientId: linkedinClientId,
        clientSecret: linkedinClientSecret,
      }),
      Auth0Provider({
        clientId: auth0ClientId,
        clientSecret: auth0ClientSecret,
        // Ensure the issuer URL has https:// prefix
        issuer: auth0Issuer && auth0Issuer.startsWith('https://')
          ? auth0Issuer
          : `https://${auth0Issuer}`,
        // Explicitly define the well-known configuration endpoints
        wellKnown: auth0Issuer
          ? (auth0Issuer.startsWith('https://')
              ? `${auth0Issuer}/.well-known/openid-configuration`
              : `https://${auth0Issuer}/.well-known/openid-configuration`)
          : undefined,
        // Add explicit authorization and token endpoints
        authorization: { params: { scope: "openid email profile" } },
      }),
    ],
  };
};

export const authConfig = createAuthConfig();

// export const authConfig: NextAuthConfig = {
//   providers: [
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     GitHub({
//       clientId: process.env.GITHUB_CLIENT_ID!,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET!,
//     }),
//   ],
//   pages: {
//     signIn: "/login",
//     error: "/auth-error",
//   },
//   debug: process.env.NODE_ENV === 'development',
//   trustHost: true,
//   callbacks: {
//     authorized({ auth, request: { nextUrl } }) {
//       const isLoggedIn = !!auth?.user;
//       const isOnProtectedPage = nextUrl.pathname.startsWith("/protected");
//       const isOnProfilePage = nextUrl.pathname.startsWith("/profile");

//       if (isOnProtectedPage || isOnProfilePage) {
//         if (isLoggedIn) return true;
//         return false; // Redirect to login page
//       }

//       return true;
//     },
//     jwt({ token, user, account }) {
//       // Initial sign in
//       if (account && user) {
//         return {
//           ...token,
//           userId: user.id,
//           provider: account.provider,
//         };
//       }
//       return token;
//     },
//     session({ session, token }) {
//       if (token && session.user) {
//         session.user.id = token.userId as string;
//         session.user.provider = token.provider as string;
//       }
//       return session;
//     },
//   },
// };
