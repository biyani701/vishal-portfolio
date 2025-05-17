'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function AuthSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status } = useSession();
  const [isProcessing, setIsProcessing] = useState(true);

  // Function to handle the redirect
  const redirectToDestination = useCallback(() => {
    // Determine where to redirect
    console.log('[auth-success] Preparing to redirect');
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
    } else {
      // Default to auth-test page
      redirectPath = '/auth-test';
    }

    // Redirect immediately
    console.log(`[auth-success] Redirecting to ${redirectPath}`);

    // Use window.location for more reliable redirects
    if (redirectPath.startsWith('http')) {
      window.location.href = redirectPath;
    } else {
      router.push(redirectPath);
    }

    setIsProcessing(false);
  }, [searchParams, router]);

  useEffect(() => {
    // Simple authentication flow
    console.log('[auth-success] Authentication status:', status);

    // If we're still loading, wait
    if (status === 'loading') {
      return;
    }

    // If we're authenticated, redirect to destination
    if (status === 'authenticated') {
      console.log('[auth-success] Successfully authenticated!');
      redirectToDestination();
      return;
    }

    // If we're not authenticated after a short delay, redirect to home
    if (status === 'unauthenticated') {
      // Wait a bit to see if the session gets established
      const timer = setTimeout(() => {
        console.log('[auth-success] Not authenticated, redirecting to home');
        window.location.href = '/';
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [status, redirectToDestination]);



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
        ) : status === 'authenticated' ? (
          <>
            <p>Successfully authenticated!</p>
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
