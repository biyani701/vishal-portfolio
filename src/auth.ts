import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

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
    };
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  debug: true, // Force debug mode on
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'none',  // 'none' is required for cross-origin requests
        path: '/',
        secure: true,      // Must be true when sameSite is 'none'
        // No domain restriction for debugging cross-origin issues
        domain: undefined  // Let the browser handle it for local development
      }
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'none',  // 'none' is required for cross-origin requests
        path: '/',
        secure: true,      // Must be true when sameSite is 'none'
        // No domain restriction for debugging cross-origin issues
        domain: undefined  // Let the browser handle it for local development
      }
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'none',  // 'none' is required for cross-origin requests
        path: '/',
        secure: true,      // Must be true when sameSite is 'none'
        // No domain restriction for debugging cross-origin issues
        domain: undefined  // Let the browser handle it for local development
      }
    }
  }
});
