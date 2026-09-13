'use client';

/**
 * Client-side authentication utilities
 * This file provides client-safe wrappers for authentication functions
 *
 * IMPORTANT: This file is now just a re-export of next-auth/react functions
 * with some additional logging. Use these functions instead of importing
 * directly from next-auth/react to ensure consistent behavior.
 */

import {
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
  useSession as nextAuthUseSession,
  getSession as nextAuthGetSession
} from 'next-auth/react';

/**
 * Sign in with a specific provider
 * @param provider The provider to sign in with (e.g., 'google', 'github')
 * @param options Additional options for the sign-in process
 */
export async function signIn(provider: string, options?: { redirectTo?: string }) {
  try {
    // Validate the provider
    if (!provider || !['google', 'github', 'facebook', 'linkedin', 'auth0'].includes(provider)) {
      throw new Error(`Invalid provider: ${provider}`);
    }

    // Add state with client information
    const state = JSON.stringify({
      clientOrigin: window.location.origin,
      callbackUrl: options?.redirectTo || `${window.location.origin}/auth-success`,
      timestamp: new Date().toISOString()
    });

    console.log(`[auth-client] Signing in with ${provider} using next-auth/react`);

    // Create the callback URL
    const callbackUrl = options?.redirectTo || `${window.location.origin}/auth-success`;

    // Instead of using the signIn function directly, we'll construct the URL and redirect
    // This avoids CORS issues when the browser tries to make an XHR request to the OAuth provider
    if (typeof window !== 'undefined') {
      // Construct the sign-in URL
      const baseUrl = window.location.origin;
      const signInUrl = new URL(`/api/auth/signin/${provider}`, baseUrl);

      // Add the callback URL and state as query parameters
      signInUrl.searchParams.set('callbackUrl', callbackUrl);
      signInUrl.searchParams.set('state', state);
      signInUrl.searchParams.set('x-client-origin', window.location.origin);

      console.log(`[auth-client] Redirecting to: ${signInUrl.toString()}`);

      // Redirect to the sign-in URL
      window.location.href = signInUrl.toString();

      // Return a promise that never resolves since we're redirecting
      return new Promise(() => {});
    } else {
      // Fallback to the next-auth/react signIn function for SSR
      return nextAuthSignIn(provider, {
        callbackUrl,
        redirect: true,
        state
      });
    }
  } catch (error) {
    console.error('[auth-client] Error during sign-in:', error);
    throw error;
  }
}

/**
 * Sign out the current user
 * @param options Additional options for the sign-out process
 */
export async function signOut(options?: { redirectTo?: string }) {
  try {
    console.log(`[auth-client] Signing out using next-auth/react`);

    // Use next-auth/react signOut function
    return nextAuthSignOut({
      callbackUrl: options?.redirectTo || '/',
      redirect: true
    });
  } catch (error) {
    console.error('[auth-client] Error during sign-out:', error);
    throw error;
  }
}

/**
 * Get the current session status
 * This is a client-side function that fetches the session from the server
 */
export async function getSession() {
  try {
    console.log('[auth-client] Getting session using next-auth/react');

    // Use next-auth/react getSession function
    const session = await nextAuthGetSession();
    console.log('[auth-client] Session retrieved:', session);
    return session;
  } catch (error) {
    console.error('[auth-client] Error getting session:', error);
    return null;
  }
}

/**
 * Re-export useSession hook from next-auth/react
 */
export const useSession = nextAuthUseSession;
