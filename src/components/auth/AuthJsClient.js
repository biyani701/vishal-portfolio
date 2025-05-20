// src/components/auth/AuthJsClient.js
import config from '../../config';

/**
 * Client-side utility functions for Auth.js V5
 * These functions handle the client-side part of Auth.js V5 authentication
 */

/**
 * Redirects to the Auth.js sign-in page for the specified provider
 * @param {string} provider - The authentication provider (e.g., 'github', 'google')
 * @param {string} [callbackUrl] - Optional callback URL after authentication
 */
export const signIn = (provider, callbackUrl) => {
  // Store the current URL to redirect back after authentication
  const currentPath = window.location.pathname;
  sessionStorage.setItem('auth_redirect', callbackUrl || currentPath);

  // Store a timestamp for the authentication attempt
  sessionStorage.setItem('auth_timestamp', Date.now().toString());

  // Get the auth server URL from runtime config or config
  const authServerUrl = (window.runtimeConfig && window.runtimeConfig.AUTH_SERVER_URL) ||
                       config.auth.serverUrl;

  // For Auth.js V5, we need to use the correct callback URL format
  // This should be a URL that Auth.js can redirect back to after authentication
  const redirectUrl = encodeURIComponent(callbackUrl || `${window.location.origin}/auth-callback`);

  // Include the origin as a query parameter for CORS handling
  const origin = encodeURIComponent(window.location.origin);

  // Construct the sign-in URL according to Auth.js V5 format
  // The format is /api/auth/signin/[provider]?callbackUrl=[url]
  const signInUrl = `${authServerUrl}/api/auth/signin/${provider}?callbackUrl=${redirectUrl}&origin=${origin}`;

  console.log('[Auth.js Client] Signing in with provider:', provider);
  console.log('[Auth.js Client] Auth server URL:', authServerUrl);
  console.log('[Auth.js Client] Redirect URL:', redirectUrl);
  console.log('[Auth.js Client] Sign-in URL:', signInUrl);

  // Directly redirect to the auth server URL
  window.location.href = signInUrl;
};

/**
 * Signs out the user using Auth.js V5
 * @param {string} [callbackUrl] - Optional callback URL after sign-out
 */
export const signOut = async (callbackUrl) => {
  // Get the auth server URL from runtime config or config
  const authServerUrl = (window.runtimeConfig && window.runtimeConfig.AUTH_SERVER_URL) ||
                       config.auth.serverUrl;

  // For Auth.js V5, we need to use the correct callback URL format
  const redirectUrl = callbackUrl || window.location.origin;

  console.log('[Auth.js Client] Signing out');
  console.log('[Auth.js Client] Auth server URL:', authServerUrl);
  console.log('[Auth.js Client] Redirect URL:', redirectUrl);

  // Clear any auth-related data from sessionStorage
  sessionStorage.removeItem('auth_redirect');
  sessionStorage.removeItem('auth_timestamp');
  sessionStorage.removeItem('auth_just_completed');
  sessionStorage.removeItem('auth_session_valid');

  try {
    // Auth.js V5 requires a POST request to the signout endpoint
    const response = await fetch(`${authServerUrl}/api/auth/signout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ callbackUrl: redirectUrl }),
      credentials: 'include',
    });

    if (response.ok) {
      console.log('[Auth.js Client] Sign out successful');

      // Redirect to the home page
      window.location.href = redirectUrl;
    } else {
      console.error('[Auth.js Client] Sign out failed:', response.status, response.statusText);

      // Fallback: try to redirect to the home page anyway
      window.location.href = redirectUrl;
    }
  } catch (error) {
    console.error('[Auth.js Client] Error signing out:', error);

    // Fallback: try to redirect to the home page anyway
    window.location.href = redirectUrl;
  }
};

/**
 * Fetches the current session from the Auth.js server
 * @returns {Promise<Object|null>} The session object or null if not authenticated
 */
export const getSession = async () => {
  try {
    // Get the auth server URL from config or runtime config
    const authServerUrl = (window.runtimeConfig && window.runtimeConfig.AUTH_SERVER_URL) ||
                         config.auth.serverUrl;

    // Use the direct URL to the auth server
    const sessionEndpoint = `${authServerUrl}/api/auth/session`;

    console.log('[Auth.js Client] Checking session at:', sessionEndpoint);

    const response = await fetch(sessionEndpoint, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const responseText = await response.text();
      if (!responseText) {
        console.log('[Auth.js Client] Empty session response');
        return null;
      }

      try {
        const sessionData = JSON.parse(responseText);
        console.log('[Auth.js Client] Session data:', sessionData);

        // Check if the session has a user object
        if (sessionData && sessionData.user) {
          // Set a flag to indicate that we have a valid session
          sessionStorage.setItem('auth_session_valid', 'true');
        } else {
          sessionStorage.removeItem('auth_session_valid');
        }

        return sessionData;
      } catch (parseError) {
        console.error('[Auth.js Client] Error parsing session response:', parseError);
        sessionStorage.removeItem('auth_session_valid');
        return null;
      }
    } else {
      console.log('[Auth.js Client] Session response status:', response.status);
      sessionStorage.removeItem('auth_session_valid');
      return null;
    }
  } catch (error) {
    console.error('[Auth.js Client] Error checking session:', error);
    sessionStorage.removeItem('auth_session_valid');
    return null;
  }
};

/**
 * Checks if the user is authenticated based on the session
 * @returns {Promise<boolean>} True if authenticated, false otherwise
 */
export const isAuthenticated = async () => {
  // First check if we have a valid session flag
  const hasValidSession = sessionStorage.getItem('auth_session_valid') === 'true';

  if (hasValidSession) {
    return true;
  }

  // If not, check the session
  const session = await getSession();
  return !!(session && session.user);
};

export default {
  signIn,
  signOut,
  getSession,
  isAuthenticated,
};
