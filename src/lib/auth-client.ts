'use client';

/**
 * Client-side authentication utilities
 * This file provides client-safe wrappers for authentication functions
 */

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

    // Construct the sign-in URL using our custom route
    const customSignInUrl = `/api/auth/signin/${provider}`;

    // Add redirectTo parameter if provided
    const redirectTo = options?.redirectTo || window.location.href;
    const url = new URL(customSignInUrl, window.location.origin);
    url.searchParams.set('callbackUrl', redirectTo);

    console.log(`[auth-client] Redirecting to ${url.toString()}`);

    // Redirect to the sign-in URL
    window.location.href = url.toString();

    // Return a promise that never resolves since we're redirecting
    return new Promise<void>(() => {});
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
    // Construct the sign-out URL using our custom route
    const customSignOutUrl = '/api/auth/signout';

    // Add redirectTo parameter if provided
    const redirectTo = options?.redirectTo || window.location.href;
    const url = new URL(customSignOutUrl, window.location.origin);
    url.searchParams.set('callbackUrl', redirectTo);

    console.log(`[auth-client] Redirecting to ${url.toString()}`);

    // Use direct window.location.href instead of fetch to avoid JSON parsing issues
    window.location.href = url.toString();

    // Return a promise that never resolves since we're redirecting
    return new Promise<void>(() => {});
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
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get session: ${response.status} ${response.statusText}`);
    }

    const session = await response.json();
    return session;
  } catch (error) {
    console.error('[auth-client] Error getting session:', error);
    return null;
  }
}
