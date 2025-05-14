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
const getOriginFromRequest = async () => {
  try {
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
const createDynamicHandler = (origin?: string | null) => {
  // Create dynamic config based on origin
  const dynamicAuthConfig = createAuthConfig(origin || undefined);

  // Create the Auth.js handler with dynamic config
  return NextAuth({
    ...dynamicAuthConfig,
    session: { strategy: "jwt" },
    secret: process.env.AUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
    cookies: {
      sessionToken: {
        name: `next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: 'none',
          path: '/',
          secure: true,
        }
      },
      callbackUrl: {
        name: `next-auth.callback-url`,
        options: {
          httpOnly: true,
          sameSite: 'none',
          path: '/',
          secure: true,
        }
      },
      csrfToken: {
        name: `next-auth.csrf-token`,
        options: {
          httpOnly: true,
          sameSite: 'none',
          path: '/',
          secure: true,
        }
      }
    },
    // Store the client origin in the account during sign in
    events: {
      signIn: ({ account }) => {
        if (account && origin) {
          account.clientOrigin = origin;
        }
      }
    }
  });
};

// Create the route handlers for API routes
export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin") ||
                req.headers.get("x-client-origin") ||
                req.headers.get("referer");

  console.log("[auth] Request from origin:", origin);

  const handler = createDynamicHandler(origin);
  return handler.handlers.GET(req);
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") ||
                req.headers.get("x-client-origin") ||
                req.headers.get("referer");

  console.log("[auth] Request from origin:", origin);

  const handler = createDynamicHandler(origin);
  return handler.handlers.POST(req);
}

// Create an auth function for use in server components
export async function auth() {
  // For server components, we need to use the headers() API
  const origin = await getOriginFromRequest();

  // Create the Auth.js handler with dynamic config
  const handler = createDynamicHandler(origin);

  // In Auth.js v5, we use the auth() function directly
  return handler.auth();
}

// Create a default handler for client-side usage
const handler = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      }
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      }
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      }
    }
  }
});

// Export functions for client-side usage
export const { signIn, signOut } = handler;
