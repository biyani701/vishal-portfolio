'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LogoutPage() {
  const searchParams = useSearchParams();
  // Get the callback URL from the query parameters, defaulting to the home page
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function performLogout() {
      try {
        setIsLoading(true);

        // Use our custom logout API
        const logoutUrl = `/api/logout?callbackUrl=${encodeURIComponent(callbackUrl)}`;
        console.log(`[logout-page] Redirecting to ${logoutUrl}`);

        // Redirect to our custom logout API
        window.location.href = logoutUrl;
      } catch (err) {
        console.error('[logout-page] Error during logout:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
      }
    }

    performLogout();
  }, [callbackUrl]);

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '1rem'
      }}>
        <h1 style={{ marginBottom: '1rem' }}>Logout Error</h1>

        <div style={{
          padding: '1rem',
          backgroundColor: '#ffebee',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          maxWidth: '500px'
        }}>
          <h2 style={{ color: '#c62828', marginTop: 0 }}>Error</h2>
          <p>{error}</p>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <Link href="/" style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            backgroundColor: '#2196f3',
            color: 'white',
            borderRadius: '0.25rem',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '1rem'
    }}>
      <h1 style={{ marginBottom: '1rem' }}>Logging Out...</h1>
      <p>Please wait while we log you out.</p>

      <div style={{ marginTop: '2rem' }}>
        <a href={callbackUrl} style={{
          display: 'inline-block',
          padding: '0.5rem 1rem',
          backgroundColor: '#757575',
          color: 'white',
          borderRadius: '0.25rem',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          Cancel
        </a>
      </div>
    </div>
  );
}
