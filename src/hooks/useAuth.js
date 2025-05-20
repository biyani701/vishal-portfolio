// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import config from '../config';

/**
 * Custom hook for authentication with Auth.js
 * Handles session checking, sign-in, and sign-out
 */
export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to check the current session
  const checkSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the auth server URL from config or runtime config
      const authServerUrl = (window.runtimeConfig && window.runtimeConfig.AUTH_SERVER_URL) ||
                           config.auth.serverUrl;

      // Use the direct URL to the auth server
      const sessionEndpoint = `${authServerUrl}/api/auth/session`;

      console.log('[Auth Debug] Checking session at:', sessionEndpoint);

      try {
        const response = await fetch(sessionEndpoint, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          },
        });

        console.log('[Auth Debug] Session response status:', response.status);
        console.log('[Auth Debug] Session response headers:', {
          contentType: response.headers.get('content-type'),
          setCookie: response.headers.get('set-cookie')
        });

        // Get the raw text first to debug
        const responseText = await response.text();
        console.log('[Auth Debug] Session response text:', responseText);

        if (response.ok) {
          try {
            // Try to parse the response as JSON
            const sessionData = responseText ? JSON.parse(responseText) : null;
            console.log('[Auth Debug] Parsed session data:', sessionData);

            if (sessionData && sessionData.user) {
              // Set a flag to indicate that we have a valid session
              sessionStorage.setItem('auth_session_valid', 'true');

              // Update the session state
              setSession(sessionData);
              return sessionData;
            } else {
              console.warn('[Auth Debug] Empty session data or no user');
              sessionStorage.removeItem('auth_session_valid');
              setSession(null);
              return null;
            }
          } catch (parseError) {
            console.error('[Auth Debug] Error parsing session response:', parseError);
            console.error('[Auth Debug] Raw response:', responseText);
            setError(`Error parsing session response: ${parseError.message}`);
            sessionStorage.removeItem('auth_session_valid');
            setSession(null);
            return null;
          }
        } else {
          // If response is not OK, clear the session
          sessionStorage.removeItem('auth_session_valid');
          setSession(null);

          // Check if the response contains an error message
          try {
            const errorData = JSON.parse(responseText);
            if (errorData.error && errorData.message) {
              console.error(`[Auth Debug] Server error: ${errorData.error} - ${errorData.message}`);

              // Special handling for "handler.auth is not a function" error
              if (errorData.message.includes("handler.auth is not a function")) {
                console.error('[Auth Debug] This error suggests an issue with the Auth.js configuration on the server.');
                console.error('[Auth Debug] Please check the AUTH_INTEGRATION_README.md file for instructions on fixing this issue.');
                setError(`Server error: ${errorData.error} - ${errorData.message}. Please check the server configuration.`);
              } else {
                setError(`Server error: ${errorData.error} - ${errorData.message}`);
              }
            } else {
              // Only set error for non-404 responses (404 just means not authenticated)
              if (response.status !== 404) {
                console.error('[Auth Debug] Error response:', response.status, response.statusText);
                console.error('[Auth Debug] Response body:', responseText);
                setError(`Error fetching session: ${response.status} ${response.statusText}`);
              } else {
                console.log('[Auth Debug] Not authenticated (404 response)');
              }
            }
          } catch (e) {
            // If we can't parse the error as JSON, just use the status
            if (response.status !== 404) {
              console.error('[Auth Debug] Error response:', response.status, response.statusText);
              console.error('[Auth Debug] Response body:', responseText);
              setError(`Error fetching session: ${response.status} ${response.statusText}`);
            } else {
              console.log('[Auth Debug] Not authenticated (404 response)');
            }
          }

          return null;
        }
      } catch (fetchError) {
        console.error('[Auth Debug] Error fetching session:', fetchError);
        setError(`Error fetching session: ${fetchError.message}`);
        sessionStorage.removeItem('auth_session_valid');
        setSession(null);
        return null;
      }
    } catch (error) {
      console.error('[Auth Debug] Error checking session:', error);
      setError(`Error checking session: ${error.message}`);
      sessionStorage.removeItem('auth_session_valid');
      setSession(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to sign in with a provider - updated for Auth.js V5
  const signIn = useCallback((provider) => {
    // Store the current URL to redirect back after authentication
    const currentPath = window.location.pathname;
    sessionStorage.setItem('auth_redirect', currentPath);

    // Get the auth server URL from runtime config or config
    const authServerUrl = (window.runtimeConfig && window.runtimeConfig.AUTH_SERVER_URL) ||
                         config.auth.serverUrl;

    // For Auth.js V5, we need to use the correct callback URL format
    // This should be a URL that Auth.js can redirect back to after authentication
    // It should be a URL that's registered with the OAuth provider
    const callbackUrl = encodeURIComponent(`${window.location.origin}/auth-callback`);

    // Include the origin as a query parameter for CORS handling
    const origin = encodeURIComponent(window.location.origin);

    // Construct the sign-in URL according to Auth.js V5 format
    // The format is /api/auth/signin/[provider]?callbackUrl=[url]
    const signInUrl = `${authServerUrl}/api/auth/signin/${provider}?callbackUrl=${callbackUrl}&origin=${origin}`;

    console.log('[Auth Debug] Signing in with provider:', provider);
    console.log('[Auth Debug] Current path:', currentPath);
    console.log('[Auth Debug] Auth server URL:', authServerUrl);
    console.log('[Auth Debug] Callback URL:', callbackUrl);
    console.log('[Auth Debug] Sign-in URL:', signInUrl);

    // Directly redirect to the auth server URL
    window.location.href = signInUrl;
  }, []);

  // Function to sign out - simplified for Auth.js v5 with CORS error handling
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      console.log('[Auth Debug] Starting sign out process');

      // Get the auth server URL from runtime config or config
      const authServerUrl = (window.runtimeConfig && window.runtimeConfig.AUTH_SERVER_URL) ||
                           config.auth.serverUrl;

      console.log('[Auth Debug] Auth server URL:', authServerUrl);

      // Step 1: Clear all client-side storage
      sessionStorage.clear();
      localStorage.removeItem('auth_redirect');

      // Step 2: Clear the local session state
      setSession(null);

      // Step 3: Try to make a direct POST request to the Auth.js signout endpoint
      let serverSignOutSuccessful = false;

      try {
        console.log('[Auth Debug] Making direct POST request to signout endpoint');

        // First, try with a preflight OPTIONS request to check CORS
        try {
          const preflightResponse = await fetch(`${authServerUrl}/api/auth/signout`, {
            method: 'OPTIONS',
            headers: {
              'Origin': window.location.origin,
              'Access-Control-Request-Method': 'POST',
              'Access-Control-Request-Headers': 'Content-Type',
            },
          });

          if (preflightResponse.ok) {
            console.log('[Auth Debug] CORS preflight successful');
          } else {
            console.warn('[Auth Debug] CORS preflight failed, but continuing with signout attempt');
          }
        } catch (preflightError) {
          console.warn('[Auth Debug] CORS preflight error:', preflightError);
        }

        // Now make the actual signout request
        const response = await fetch(`${authServerUrl}/api/auth/signout`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Origin': window.location.origin,
          },
          body: JSON.stringify({ callbackUrl: '/' }),
        });

        if (response.ok) {
          console.log('[Auth Debug] Signout request successful');
          serverSignOutSuccessful = true;
        } else {
          console.error('[Auth Debug] Signout request failed:', response.status);
        }
      } catch (fetchError) {
        console.error('[Auth Debug] Error making signout request:', fetchError);

        // If we get a CORS error, try a fallback approach
        if (fetchError.message.includes('NetworkError') || fetchError.message.includes('CORS')) {
          console.log('[Auth Debug] CORS error detected, trying fallback approach');

          try {
            // Try to clear Auth.js cookies manually
            const cookiesToClear = [
              'next-auth.session-token',
              'next-auth.callback-url',
              'next-auth.csrf-token'
            ];

            const cookiePaths = ['/', '/api', '/api/auth', '/auth'];

            cookiesToClear.forEach(cookieName => {
              cookiePaths.forEach(path => {
                document.cookie = `${cookieName}=;expires=${new Date().toUTCString()};path=${path}`;
              });
            });

            console.log('[Auth Debug] Manually cleared Auth.js cookies');
          } catch (cookieError) {
            console.error('[Auth Debug] Error clearing cookies:', cookieError);
          }
        }
      }

      // If server-side signout failed, try to redirect to the signout page
      if (!serverSignOutSuccessful) {
        console.log('[Auth Debug] Server-side signout failed, trying redirect approach');

        // Create an invisible iframe to load the signout page
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = `${authServerUrl}/api/auth/signout?callbackUrl=/`;

        // Remove the iframe after it loads
        iframe.onload = () => {
          console.log('[Auth Debug] Signout iframe loaded');
          document.body.removeChild(iframe);
        };

        // Add the iframe to the page
        document.body.appendChild(iframe);
      }

      return { success: true };
    } catch (error) {
      console.error('[Auth Debug] Error signing out:', error);
      setError(`Error signing out: ${error.message}`);
      setSession(null);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  // Check the session when the component mounts and when the URL changes
  useEffect(() => {
    const checkAndUpdateSession = async () => {
      console.log('[Auth Debug] Checking session on mount or URL change');

      // Check if we already have a valid session flag
      const hasValidSessionFlag = sessionStorage.getItem('auth_session_valid') === 'true';

      if (hasValidSessionFlag) {
        console.log('[Auth Debug] Found valid session flag, skipping session check');
        // Still update the session state if we have a valid session flag
        if (!session || !session.user) {
          // Try to get the session from the server
          await checkSession();
        }
      } else {
        // No valid session flag, check the session
        await checkSession();
      }

      // Check if we need to redirect after authentication
      const redirectPath = sessionStorage.getItem('auth_redirect');
      if (redirectPath) {
        console.log('[Auth Debug] Found redirect path:', redirectPath);
        // Clear the stored path
        sessionStorage.removeItem('auth_redirect');

        // Only redirect if we're not already on that path
        if (window.location.pathname !== redirectPath) {
          console.log('[Auth Debug] Redirecting to:', redirectPath);
          window.location.href = redirectPath;
        }
      }
    };

    // Check session immediately
    checkAndUpdateSession();

    // Also check when the URL hash changes (common after OAuth redirects)
    const handleHashChange = () => {
      console.log('[Auth Debug] URL hash changed, checking session');
      checkAndUpdateSession();
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Check session periodically (every 5 minutes)
    const intervalId = setInterval(() => {
      console.log('[Auth Debug] Periodic session check');
      checkSession();
    }, 5 * 60 * 1000);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      clearInterval(intervalId);
    };
  }, [checkSession, session]);

  // Function to manually set the user data
  const setUser = useCallback((userData) => {
    if (!userData) {
      setSession(null);
      return;
    }

    // If we already have a session, update the user data
    if (session) {
      setSession({
        ...session,
        user: userData
      });
    } else {
      // Create a new session with the user data
      setSession({
        user: userData
      });
    }
  }, [session]);

  // Check if we have a valid session flag in sessionStorage
  const hasValidSessionFlag = sessionStorage.getItem('auth_session_valid') === 'true';

  return {
    session,
    user: session?.user || null,
    loading,
    error,
    isAuthenticated: !!session?.user || hasValidSessionFlag,
    signIn,
    signOut,
    checkSession,
    setUser,
  };
}

export default useAuth;
