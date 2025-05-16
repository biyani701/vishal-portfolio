import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { authConfig } from "./auth.config";
import { createAuthConfig } from "./auth.config";
import { headers } from "next/headers";

export type { Session } from "next-auth";

// Extend the Session type to include custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      provider?: string;
      clientOrigin?: string; // Add this to track which client the user came from
      clientId?: string; // Add client identifier (default, client1, client2, etc.)
    };
  }

  // Extend JWT type to include client information
  interface JWT {
    userId?: string;
    provider?: string;
    clientOrigin?: string; // Origin of the client that initiated auth
    clientId?: string; // Client identifier
  }

  // Extend Account type to include clientOrigin
  interface Account {
    clientOrigin?: string; // Add this to track which client the user came from
    [key: string]: unknown; // Add index signature to allow additional properties
  }
}

// Helper function to get the request origin from headers
const getOriginFromRequest = async (req?: Request | NextRequest) => {
  try {
    // If we have a request object, check for query parameters first
    if (req) {
      const url = new URL(req.url);
      const originParam = url.searchParams.get("origin");
      if (originParam) {
        console.log("[auth] Using origin from query parameter:", originParam);
        return originParam;
      }
    }

    // Otherwise, check headers
    const headersList = await headers();
    // Check for origin header first
    const origin = headersList.get("origin");
    if (origin) return origin;

    const clientOrigin = headersList.get("x-client-origin");
    if (clientOrigin) return clientOrigin;

    const referer = headersList.get("referer");
    return referer;
  } catch (error) {
    console.error("Failed to get headers:", error);
    return null;
  }
};

// Create a dynamic Auth.js handler based on the request origin
const createDynamicHandler = async (req: Request | NextRequest) => {
  // const origin = await getOriginFromRequest(req);
  const origin = req.headers.get("origin") ||
                req.headers.get("x-client-origin") ||
                req.headers.get("referer");

  console.log("[auth] Request from origin:", origin);

  // Create dynamic config based on origin
  const dynamicAuthConfig = createAuthConfig(origin || undefined);

  // Create the Auth.js handler with dynamic config
  const handler = NextAuth({
    ...dynamicAuthConfig,
    session: { strategy: "jwt" },
    secret: process.env.AUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
    cookies: {
      sessionToken: {
        name: `next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: "none", // Use none to allow cross-site cookies
          path: "/",
          secure: true, // Always use secure for cross-site cookies
        },
      },
      callbackUrl: {
        name: `next-auth.callback-url`,
        options: {
          httpOnly: true,
          sameSite: "none", // Use none to allow cross-site cookies
          path: "/",
          secure: true, // Always use secure for cross-site cookies
        },
      },
      csrfToken: {
        name: `next-auth.csrf-token`,
        options: {
          httpOnly: true,
          sameSite: "none", // Use none to allow cross-site cookies
          path: "/",
          secure: true, // Always use secure for cross-site cookies
        },
      },
    },
    // Add callbacks to debug and fix authentication issues
    callbacks: {
      async signIn({ user, account, profile }) {
        console.log('[auth][callbacks] Sign in callback:', {
          user: user ? { id: user.id, email: user.email } : null,
          provider: account?.provider,
          profile: profile ? { email: profile.email } : null
        });

        return true;
      },
      async jwt({ token, user, account }) {
        console.log('[auth][callbacks] JWT callback:', {
          tokenSub: token?.sub,
          user: user ? { id: user.id } : null,
          provider: account?.provider
        });

        // Initial sign in
        if (account && user) {
          token.userId = user.id;
          token.provider = account.provider;
          token.clientOrigin = account.clientOrigin as string | undefined;
        }

        return token;
      },
      async session({ session, token }) {
        console.log('[auth][callbacks] Session callback:', {
          user: session?.user ? { email: session.user.email } : null,
          tokenSub: token?.sub
        });

        if (token && session.user) {
          session.user.id = token.userId as string;
          session.user.provider = token.provider as string;
          session.user.clientOrigin = token.clientOrigin as string | undefined;
        }

        return session;
      },
    },
    // Add events to debug authentication issues
    events: {
      signIn: ({ account, user }) => {
        console.log('[auth][events] Sign in event:', {
          user: user ? { id: user.id, email: user.email } : null,
          provider: account?.provider,
          origin: origin
        });

        if (account && origin) {
          account.clientOrigin = origin;
        }
      },
      session: ({ session, token }) => {
        console.log('[auth][events] Session event:', {
          user: session?.user ? { email: session.user.email } : null,
          token: token ? { sub: token.sub } : null
        });
      },
    },
  });

  return handler;
};




// Create the route handlers for API routes
export async function GET(req: NextRequest) {
  const handler = await createDynamicHandler(req);
  return handler.handlers.GET(req);
  
}

export async function POST(req: NextRequest) {
  const handler = await createDynamicHandler(req);
  return handler.handlers.POST(req);  
}

// Create an auth function for use in server components
export async function auth() {
  // For server components, we need to use the headers() API
  const origin = await getOriginFromRequest();

  // Create the Auth.js handler with dynamic config
  // Don't use createDynamicHandler here, create a new NextAuth instance directly
  const handler = NextAuth({
    ...createAuthConfig(origin || undefined),
    session: { strategy: "jwt" },
    secret: process.env.AUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
    cookies: {
      sessionToken: {
        name: `next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: "none", // Use none to allow cross-site cookies
          path: "/",
          secure: true, // Always use secure for cross-site cookies
        },
      },
      callbackUrl: {
        name: `next-auth.callback-url`,
        options: {
          httpOnly: true,
          sameSite: "none", // Use none to allow cross-site cookies
          path: "/",
          secure: true, // Always use secure for cross-site cookies
        },
      },
      csrfToken: {
        name: `next-auth.csrf-token`,
        options: {
          httpOnly: true,
          sameSite: "none", // Use none to allow cross-site cookies
          path: "/",
          secure: true, // Always use secure for cross-site cookies
        },
      },
    },
    // Add callbacks to debug and fix authentication issues
    callbacks: {
      async signIn({ user, account, profile }) {
        console.log('[auth][callbacks] Sign in callback:', {
          user: user ? { id: user.id, email: user.email } : null,
          provider: account?.provider,
          profile: profile ? { email: profile.email } : null
        });

        return true;
      },
      async jwt({ token, user, account }) {
        console.log('[auth][callbacks] JWT callback:', {
          tokenSub: token?.sub,
          user: user ? { id: user.id } : null,
          provider: account?.provider
        });

        // Initial sign in
        if (account && user) {
          token.userId = user.id;
          token.provider = account.provider;
          token.clientOrigin = account.clientOrigin as string | undefined;
        }

        return token;
      },
      async session({ session, token }) {
        console.log('[auth][callbacks] Session callback:', {
          user: session?.user ? { email: session.user.email } : null,
          tokenSub: token?.sub
        });

        if (token && session.user) {
          session.user.id = token.userId as string;
          session.user.provider = token.provider as string;
          session.user.clientOrigin = token.clientOrigin as string | undefined;
        }

        return session;
      },
    },
    // Add events to debug authentication issues
    events: {
      signIn: ({ account, user }) => {
        console.log('[auth][events] Sign in event:', {
          user: user ? { id: user.id, email: user.email } : null,
          provider: account?.provider,
          origin: origin
        });

        if (account && origin) {
          account.clientOrigin = origin;
        }
      },
      session: ({ session, token }) => {
        console.log('[auth][events] Session event:', {
          user: session?.user ? { email: session.user.email } : null,
          token: token ? { sub: token.sub } : null
        });
      },
    },
  });

  // In Auth.js v5, we use the auth() function directly from the handler
  return await handler.auth();
}

// export async function auth() {

// For server components, we need to use the headers() API
// const origin = await getOriginFromRequest();

// Create the Auth.js handler with dynamic config
// const handler = createDynamicHandler(origin);

// In Auth.js v5, we use the auth() function directly
// return handler.auth();
// }

// Create a default handler for client-side usage
const handler = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "none", // Use none to allow cross-site cookies
        path: "/",
        secure: true, // Always use secure for cross-site cookies
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "none", // Use none to allow cross-site cookies
        path: "/",
        secure: true, // Always use secure for cross-site cookies
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "none", // Use none to allow cross-site cookies
        path: "/",
        secure: true, // Always use secure for cross-site cookies
      },
    },
  },
  // Add callbacks to debug and fix authentication issues
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('[auth][callbacks] Sign in callback (client):', {
        user: user ? { id: user.id, email: user.email } : null,
        provider: account?.provider,
        profile: profile ? { email: profile.email } : null
      });

      return true;
    },
    async jwt({ token, user, account }) {
      console.log('[auth][callbacks] JWT callback (client):', {
        tokenSub: token?.sub,
        user: user ? { id: user.id } : null,
        provider: account?.provider
      });

      // Initial sign in
      if (account && user) {
        token.userId = user.id;
        token.provider = account.provider;
        token.clientOrigin = account.clientOrigin as string | undefined;
      }

      return token;
    },
    async session({ session, token }) {
      console.log('[auth][callbacks] Session callback (client):', {
        user: session?.user ? { email: session.user.email } : null,
        tokenSub: token?.sub
      });

      if (token && session.user) {
        session.user.id = token.userId as string;
        session.user.provider = token.provider as string;
        session.user.clientOrigin = token.clientOrigin as string | undefined;
      }

      return session;
    },
  },
});

// Export functions for client-side usage
export const { signIn, signOut } = handler;
