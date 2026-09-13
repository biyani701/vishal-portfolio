// src/components/AuthSessionCheck.js
import { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthProvider';

/**
 * AuthSessionCheck component
 * This component checks for authentication session on mount and after redirects
 * It's designed to be included in the main layout to ensure auth state is always up-to-date
 */
const AuthSessionCheck = () => {
  const { checkSession, isAuthenticated } = useAuthContext();
  const [checkedOnLoad, setCheckedOnLoad] = useState(false);

  // Force a session check on every page load
  useEffect(() => {
    const forceSessionCheck = async () => {
      console.log('[Auth] Forcing session check on page load');

      try {
        const session = await checkSession();
        console.log('[Auth] Initial session check result:', session);
        setCheckedOnLoad(true);
      } catch (error) {
        console.error('[Auth] Error during initial session check:', error);
      }
    };

    forceSessionCheck();
  }, [checkSession]);

  // Check for authentication flags
  useEffect(() => {
    // Check if we just completed authentication
    const justAuthenticated = sessionStorage.getItem('auth_just_completed');
    const authInProgress = sessionStorage.getItem('auth_in_progress');
    const authTimestamp = sessionStorage.getItem('auth_timestamp');
    const authProvider = sessionStorage.getItem('auth_provider');

    // Check if the timestamp is recent (within the last 5 minutes)
    const isRecent = authTimestamp &&
      (Date.now() - parseInt(authTimestamp, 10)) < 5 * 60 * 1000;

    if ((justAuthenticated === 'true' || authInProgress === 'true') && isRecent) {
      console.log('[Auth] Authentication process detected, checking session');
      console.log('[Auth] Auth provider:', authProvider);
      console.log('[Auth] Auth timestamp:', new Date(parseInt(authTimestamp, 10)).toISOString());

      // Force multiple session checks with delays to ensure we catch the session
      const checkWithRetry = async () => {
        // First check
        let session = await checkSession();
        console.log('[Auth] First session check after authentication:', session);

        if (!session?.user) {
          // Wait and try again
          console.log('[Auth] No session found, retrying in 1 second...');
          await new Promise(resolve => setTimeout(resolve, 1000));

          session = await checkSession();
          console.log('[Auth] Second session check after authentication:', session);

          if (!session?.user) {
            // One more try
            console.log('[Auth] Still no session, final retry in 2 seconds...');
            await new Promise(resolve => setTimeout(resolve, 2000));

            session = await checkSession();
            console.log('[Auth] Final session check after authentication:', session);
          }
        }

        // Clear all auth flags
        sessionStorage.removeItem('auth_just_completed');
        sessionStorage.removeItem('auth_in_progress');
        sessionStorage.removeItem('auth_timestamp');
        sessionStorage.removeItem('auth_provider');

        return session;
      };

      checkWithRetry();
    } else if ((justAuthenticated === 'true' || authInProgress === 'true') && !isRecent) {
      // Clear old flags
      console.log('[Auth] Clearing stale authentication flags');
      sessionStorage.removeItem('auth_just_completed');
      sessionStorage.removeItem('auth_in_progress');
      sessionStorage.removeItem('auth_timestamp');
      sessionStorage.removeItem('auth_provider');
    }
  }, [checkSession, checkedOnLoad]);

  // This component doesn't render anything
  return null;
};

export default AuthSessionCheck;
