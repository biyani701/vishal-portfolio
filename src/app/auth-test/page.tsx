'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthStatus from '@/components/auth-status';

export default function AuthTestPage() {
  // Define a proper type for the debug info
  interface DebugInfo {
    session: Record<string, unknown> | null;
    environment: Record<string, unknown>;
    authConfig: Record<string, unknown>;
    request: Record<string, unknown>;
    timestamp?: string;
    [key: string]: unknown;
  }

  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDebugInfo() {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching debug info from:', window.location.origin + '/api/auth/debug');

        const response = await fetch('/api/auth/debug', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Debug API error response:', errorText);
          throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText.substring(0, 100)}...`);
        }

        const data = await response.json();
        console.log('Debug info received:', data);
        setDebugInfo(data);
      } catch (err) {
        console.error('Error fetching debug info:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchDebugInfo();
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Authentication Test Page</h1>

      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/" style={{ marginRight: '1rem', textDecoration: 'underline' }}>Home</Link>
        <Link href="/login" style={{ marginRight: '1rem', textDecoration: 'underline' }}>Login</Link>
        <Link href="/protected" style={{ textDecoration: 'underline' }}>Protected Page</Link>
      </div>

      <div style={{
        padding: '1rem',
        backgroundColor: '#f0f4f8',
        borderRadius: '0.5rem',
        marginBottom: '1.5rem',
        border: '1px solid #d0e1f9'
      }}>
        <h2 style={{ marginTop: 0 }}>Authentication Status</h2>
        <AuthStatus />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Authentication Debug Information</h2>

        {loading && <p>Loading debug information...</p>}

        {error && (
          <div style={{ padding: '1rem', backgroundColor: '#ffebee', borderRadius: '0.5rem', marginBottom: '1rem' }}>
            <h3 style={{ color: '#c62828', marginTop: 0 }}>Error</h3>
            <p>{error}</p>
          </div>
        )}

        {debugInfo && (
          <div>
            <h3>Session Status</h3>
            <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '0.5rem', marginBottom: '1rem' }}>
              <p><strong>Authenticated:</strong> {debugInfo.session ? 'Yes' : 'No'}</p>
              {debugInfo.session && (
                <pre style={{ overflow: 'auto', maxHeight: '200px' }}>
                  {JSON.stringify(debugInfo.session, null, 2)}
                </pre>
              )}
            </div>

            <h3>Environment</h3>
            <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '0.5rem', marginBottom: '1rem' }}>
              <pre style={{ overflow: 'auto', maxHeight: '200px' }}>
                {JSON.stringify(debugInfo.environment, null, 2)}
              </pre>
            </div>

            <h3>Auth Configuration</h3>
            <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '0.5rem', marginBottom: '1rem' }}>
              <pre style={{ overflow: 'auto', maxHeight: '200px' }}>
                {JSON.stringify(debugInfo.authConfig, null, 2)}
              </pre>
            </div>

            <h3>Request Information</h3>
            <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '0.5rem' }}>
              <pre style={{ overflow: 'auto', maxHeight: '200px' }}>
                {JSON.stringify(debugInfo.request, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={async () => {
            try {
              // Import the signIn function from our client-side auth utility
              const { signIn } = await import('@/lib/auth-client');
              await signIn('google', { redirectTo: window.location.href });
            } catch (err) {
              console.error('Error signing in with Google:', err);
              alert('Error signing in with Google: ' + (err instanceof Error ? err.message : 'Unknown error'));
            }
          }}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4285F4',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
        >
          Sign In with Google
        </button>

        <button
          onClick={async () => {
            try {
              // Import the signIn function from our client-side auth utility
              const { signIn } = await import('@/lib/auth-client');
              await signIn('github', { redirectTo: window.location.href });
            } catch (err) {
              console.error('Error signing in with GitHub:', err);
              alert('Error signing in with GitHub: ' + (err instanceof Error ? err.message : 'Unknown error'));
            }
          }}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#333',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
        >
          Sign In with GitHub
        </button>
      </div>
    </div>
  );
}
