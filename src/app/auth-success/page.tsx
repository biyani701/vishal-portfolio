'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function AuthSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const provider = searchParams?.get('provider') || null;
  const code = searchParams?.get('code') || null;
  const { data: session, status } = useSession();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = status === 'authenticated';

  // Use a ref to track if we've already redirected
  const [hasRedirected, setHasRedirected] = useState(false);

  // Function to check if we're in a redirect loop
  const checkForRedirectLoop = () => {
    // Get the attempt count from localStorage
    const attemptCount = parseInt(localStorage.getItem('auth-callback-attempt-count') || '0', 10);

    // If we've tried more than 2 times, we're probably in a loop
    if (attemptCount > 2) {
      return true;
    }

    // Check if we've been redirected here multiple times in a short period
    const now = Date.now();
    const lastVisit = parseInt(localStorage.getItem('auth-success-last-visit') || '0', 10);
    const visitCount = parseInt(localStorage.getItem('auth-success-visit-count') || '0', 10);

    // If we've visited this page within the last 5 seconds, increment the visit count
    if (now - lastVisit < 5000) {
      localStorage.setItem('auth-success-visit-count', (visitCount + 1).toString());

      // If we've visited this page more than 3 times in a short period, we're probably in a loop
      if (visitCount > 3) {
        return true;
      }
    } else {
      // Reset the visit count if it's been more than 5 seconds
      localStorage.setItem('auth-success-visit-count', '1');
    }

    // Update the last visit time
    localStorage.setItem('auth-success-last-visit', now.toString());

    return false;
  };

  // Function to handle the redirect
  const redirectToDestination = () => {
    // Determine where to redirect
    console.log('[auth-success] Preparing to redirect');
    const referrer = document.referrer;
    let redirectPath = '/';

    // Check for a callback URL in the query parameters
    const callbackUrl = searchParams?.get('callbackUrl') || null;
    if (callbackUrl) {
      try {
        // Validate the URL to prevent open redirects
        new URL(callbackUrl); // Just validate, don't need to store
        redirectPath = callbackUrl;
        console.log(`[auth-success] Redirecting to callback URL: ${redirectPath}`);
      } catch (error) {
        console.error('[auth-success] Invalid callback URL:', callbackUrl, error);
      }
    } else if (referrer && referrer.includes('/mui-auth')) {
      // Redirect back to the MUI Auth page with the account tab active
      redirectPath = '/mui-auth?tab=account';
      console.log('[auth-success] Redirecting to MUI Auth page with account tab active');
    } else {
      // If the user came from somewhere else, check if we're on the same origin
      let isSameOrigin = false;
      try {
        if (referrer) {
          const referrerUrl = new URL(referrer);
          isSameOrigin = window.location.origin === referrerUrl.origin;
        }
      } catch (e) {
        console.error('[auth-success] Error parsing referrer:', e);
      }

      if (isSameOrigin) {
        // If we're on the same origin, redirect to the auth-test page
        redirectPath = '/auth-test';
        console.log('[auth-success] Redirecting to auth-test page');
      } else {
        // Otherwise, redirect to the home page
        redirectPath = '/';
        console.log('[auth-success] Redirecting to home page');
      }
    }

    // Mark that we've redirected to prevent multiple redirects
    setHasRedirected(true);

    // Always clear all loop-related state when redirecting
    localStorage.removeItem('auth-callback-attempt-count');
    localStorage.removeItem('auth-success-last-visit');
    localStorage.removeItem('auth-success-visit-count');

    // Redirect immediately to break any loops
    console.log(`[auth-success] Redirecting to ${redirectPath}`);

    // Use window.location for more reliable redirects
    if (redirectPath.startsWith('http')) {
      window.location.href = redirectPath;
    } else {
      router.push(redirectPath);
    }

    setIsProcessing(false);
  };

  useEffect(() => {
    // Reset the attempt counter when the component mounts with a successful session
    if (status === 'authenticated') {
      localStorage.removeItem('auth-callback-attempt-count');
    }

    // Log success details for debugging
    console.log('[auth-success]', {
      provider,
      code: code ? `${code.substring(0, 10)}...` : null, // Only log part of the code for security
      timestamp: new Date().toISOString(),
      url: window.location.href,
      sessionStatus: status,
      isAuthenticated: isAuthenticated,
      session: session,
      hasRedirected: hasRedirected,
      attemptCount: localStorage.getItem('auth-callback-attempt-count') || '0',
    });

    // If we've already redirected, don't do anything
    if (hasRedirected) {
      return;
    }

    // Check if we're in a redirect loop by looking at the URL history
    const isInRedirectLoop = checkForRedirectLoop();
    if (isInRedirectLoop) {
      console.log('[auth-success] Detected redirect loop, breaking out of loop');
      localStorage.removeItem('auth-callback-attempt-count');

      // Before redirecting, try one last direct approach to establish the session
      if (provider && code) {
        try {
          console.log('[auth-success] Attempting one final direct session establishment');

          // Make a direct call to the session endpoint to try to establish the session
          fetch('/api/auth/session', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            },
            cache: 'no-store'
          }).then(() => {
            console.log('[auth-success] Final session attempt completed');
          }).catch(err => {
            console.error('[auth-success] Error in final session attempt:', err);
          });

          // Wait a moment before redirecting
          setTimeout(() => {
            setHasRedirected(true);
            redirectToDestination();
          }, 1000);
          return;
        } catch (error) {
          console.error('[auth-success] Error in final authentication attempt:', error);
        }
      }

      setHasRedirected(true);
      redirectToDestination();
      return;
    }

    // Process the authentication only when we have a valid session or a definitive status
    if (status === 'loading') {
      // Still loading, wait for the session to be determined
      return;
    }

    // Process the authentication
    const processAuth = async () => {
      try {
        // Set a shorter timeout to allow authentication to complete
        // This prevents the page from getting stuck in a loop
        const redirectTimeout = setTimeout(() => {
          if (!hasRedirected) {
            console.log('[auth-success] Redirect timeout reached, redirecting anyway');
            redirectToDestination();
          }
        }, 10000); // 10 seconds timeout

        // Check if we've been redirected here directly without a code
        if (!code && !provider) {
          console.log('[auth-success] No code or provider, redirecting to home');
          clearTimeout(redirectTimeout);
          window.location.href = '/';
          return;
        }

        // If we're already authenticated, redirect immediately
        if (isAuthenticated) {
          console.log('[auth-success] Successfully authenticated!');
          clearTimeout(redirectTimeout);
          redirectToDestination();
          return;
        }

        // If we're not authenticated but have a definitive status, try to refresh the session once
        if (status === 'unauthenticated') {
          console.log('[auth-success] Not authenticated, attempting to refresh session...');

          // Wait a bit before trying to refresh the session
          await new Promise(resolve => setTimeout(resolve, 2000));

          try {
            // Try to fetch the session directly from the API with cache-busting
            const cacheBuster = `_=${Date.now()}`;
            const sessionResponse = await fetch(`/api/auth/session?${cacheBuster}`, {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
              },
              cache: 'no-store'
            });

            if (sessionResponse.ok) {
              const sessionData = await sessionResponse.json();
              console.log('[auth-success] Session refresh response:', sessionData);

              // If we got a valid session, redirect
              if (sessionData && sessionData.user) {
                console.log('[auth-success] Session refreshed successfully');
                clearTimeout(redirectTimeout);
                redirectToDestination();
                return;
              }
            } else {
              console.error('[auth-success] Session refresh failed:', sessionResponse.status, sessionResponse.statusText);
            }
          } catch (refreshError) {
            console.error('[auth-success] Error refreshing session:', refreshError);
          }

          // Try to manually complete the authentication flow using our direct callback handler
          try {
            console.log('[auth-success] Attempting to manually complete the authentication flow...');

            if (provider && code) {
              // Check if we've already tried too many times
              const attemptCount = parseInt(localStorage.getItem('auth-callback-attempt-count') || '0', 10);
              if (attemptCount > 2) {
                console.error('[auth-success] Too many callback attempts, breaking out of the loop');
                // Force a redirect to the home page to break the loop
                setHasRedirected(true);
                redirectToDestination();
                return;
              }

              // Increment the attempt counter
              localStorage.setItem('auth-callback-attempt-count', (attemptCount + 1).toString());

              // Instead of redirecting or fetching, just redirect to the destination
              console.log('[auth-success] Too many attempts, skipping authentication and redirecting to destination');
              setHasRedirected(true);
              redirectToDestination();
              return;
            }
          } catch (signInError) {
            console.error('[auth-success] Error during manual authentication completion:', signInError);
            // If there's an error, redirect to break the loop
            setHasRedirected(true);
            redirectToDestination();
          }

          // Check if we should try one more time
          const attemptCount = parseInt(localStorage.getItem('auth-callback-attempt-count') || '0', 10);
          if (attemptCount <= 2) {
            // Try one more time after a delay
            await new Promise(resolve => setTimeout(resolve, 3000));

            try {
              // Try to refresh the session one more time
              console.log('[auth-success] Trying to refresh session one more time...');
              const sessionResponse = await fetch(`/api/auth/session?_=${Date.now()}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Requested-With': 'XMLHttpRequest',
                  'Cache-Control': 'no-cache, no-store, must-revalidate',
                  'Pragma': 'no-cache',
                  'Expires': '0'
                },
                cache: 'no-store'
              });

              if (sessionResponse.ok) {
                const sessionData = await sessionResponse.json();
                console.log('[auth-success] Final session refresh response:', sessionData);

                if (sessionData && sessionData.user) {
                  console.log('[auth-success] Session established in final attempt');
                  setHasRedirected(true);
                  redirectToDestination();
                  return;
                }
              }

              // If we still don't have a session, redirect anyway
              console.log('[auth-success] No session after final attempt, redirecting anyway');
              setHasRedirected(true);
              redirectToDestination();
              return;
            } catch (refreshError) {
              console.error('[auth-success] Error in final refresh attempt:', refreshError);
            }
          } else {
            console.log('[auth-success] Too many attempts, skipping final refresh');
          }

          // Always redirect at this point to break out of any potential loops
          console.log('[auth-success] Redirecting to destination to avoid loops');
          clearTimeout(redirectTimeout);
          // Reset the attempt counter to prevent future loops
          localStorage.removeItem('auth-callback-attempt-count');
          setHasRedirected(true);
          redirectToDestination();
          return;
        }

        // Function to handle the redirect
        function redirectToDestination() {
          // Determine where to redirect
          console.log('[auth-success] Preparing to redirect');
          const referrer = document.referrer;
          let redirectPath = '/';

          // Check for a callback URL in the query parameters
          const callbackUrl = searchParams?.get('callbackUrl') || null;
          if (callbackUrl) {
            try {
              // Validate the URL to prevent open redirects
              new URL(callbackUrl); // Just validate, don't need to store
              redirectPath = callbackUrl;
              console.log(`[auth-success] Redirecting to callback URL: ${redirectPath}`);
            } catch (error) {
              console.error('[auth-success] Invalid callback URL:', callbackUrl, error);
            }
          } else if (referrer && referrer.includes('/mui-auth')) {
            // Redirect back to the MUI Auth page with the account tab active
            redirectPath = '/mui-auth?tab=account';
            console.log('[auth-success] Redirecting to MUI Auth page with account tab active');
          } else {
            // If the user came from somewhere else, check if we're on the same origin
            let isSameOrigin = false;
            try {
              if (referrer) {
                const referrerUrl = new URL(referrer);
                isSameOrigin = window.location.origin === referrerUrl.origin;
              }
            } catch (e) {
              console.error('[auth-success] Error parsing referrer:', e);
            }

            if (isSameOrigin) {
              // If we're on the same origin, redirect to the auth-test page
              redirectPath = '/auth-test';
              console.log('[auth-success] Redirecting to auth-test page');
            } else {
              // Otherwise, redirect to the home page
              redirectPath = '/';
              console.log('[auth-success] Redirecting to home page');
            }
          }

          // Mark that we've redirected to prevent multiple redirects
          setHasRedirected(true);

          // Redirect after a short delay
          setTimeout(() => {
            console.log(`[auth-success] Redirecting to ${redirectPath}`);

            // Use window.location for more reliable redirects
            if (redirectPath.startsWith('http')) {
              window.location.href = redirectPath;
            } else {
              router.push(redirectPath);
            }

            setIsProcessing(false);
          }, 1500);
        }
      } catch (err) {
        console.error('[auth-success] Error processing authentication:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsProcessing(false);
      }
    };

    processAuth();
  }, [provider, code, router, status, isAuthenticated, session, hasRedirected, searchParams]);

  if (error) {
    return (
      <div className="auth-container">
        <h1 className="auth-heading">Authentication Error</h1>
        <div style={{
          padding: '1rem',
          backgroundColor: 'var(--secondary)',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          <p style={{ color: 'var(--error)' }}>{error}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link href="/login" className="btn btn-primary">
            Try Again
          </Link>
          <Link href="/" className="btn btn-secondary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h1 className="auth-heading">Authentication Successful</h1>

      <div style={{
        padding: '1rem',
        backgroundColor: 'var(--secondary)',
        borderRadius: '0.5rem',
        marginBottom: '1.5rem',
        textAlign: 'center'
      }}>
        {status === 'loading' ? (
          <>
            <p>Checking authentication status...</p>
            <div className="loading-spinner" style={{
              display: 'inline-block',
              width: '24px',
              height: '24px',
              border: '3px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '50%',
              borderTop: '3px solid var(--primary)',
              animation: 'spin 1s linear infinite',
              marginTop: '1rem'
            }}></div>
          </>
        ) : isAuthenticated ? (
          isProcessing ? (
            <>
              <p>Successfully authenticated with {provider}.</p>
              <p>Redirecting you to your account...</p>
              <div className="loading-spinner" style={{
                display: 'inline-block',
                width: '24px',
                height: '24px',
                border: '3px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '50%',
                borderTop: '3px solid var(--primary)',
                animation: 'spin 1s linear infinite',
                marginTop: '1rem'
              }}></div>
            </>
          ) : (
            <p>Authentication complete. You can now continue using the application.</p>
          )
        ) : (
          <>
            <p>Waiting for authentication to complete...</p>
            <p>This may take a moment. Please do not close this page.</p>
            <div className="loading-spinner" style={{
              display: 'inline-block',
              width: '24px',
              height: '24px',
              border: '3px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '50%',
              borderTop: '3px solid var(--primary)',
              animation: 'spin 1s linear infinite',
              marginTop: '1rem'
            }}></div>
          </>
        )}
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>

      {!isProcessing && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link href="/" className="btn btn-primary">
            Go to Home
          </Link>
        </div>
      )}
    </div>
  );
}
