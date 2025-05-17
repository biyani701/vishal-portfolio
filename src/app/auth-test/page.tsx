'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthStatus from '@/components/auth-status';
import { SignInButton, SignOutButton, AuthStatus as NewAuthStatus } from '@/components/AuthButtons';

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
        <h2 style={{ marginTop: 0 }}>Authentication Status (Legacy)</h2>
        <AuthStatus />
      </div>

      <div style={{
        padding: '1rem',
        backgroundColor: '#f0f4f8',
        borderRadius: '0.5rem',
        marginBottom: '1.5rem',
        border: '1px solid #d0e1f9'
      }}>
        <h2 style={{ marginTop: 0 }}>Authentication Status (New)</h2>
        <NewAuthStatus />
      </div>

      <div style={{
        padding: '1rem',
        backgroundColor: '#e8f5e9',
        borderRadius: '0.5rem',
        marginBottom: '1.5rem',
        border: '1px solid #c8e6c9'
      }}>
        <h2 style={{ marginTop: 0 }}>Next-Auth Sign In Buttons</h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <SignInButton provider="google" />
          <SignInButton provider="github" />
          <SignInButton provider="facebook" />
          <SignInButton provider="linkedin" />
          <SignInButton provider="auth0" />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <SignOutButton />
        </div>
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

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f8ff', borderRadius: '0.5rem', border: '1px solid #d0e1f9' }}>
        <h2 style={{ marginTop: 0 }}>Sign In with Next-Auth Buttons</h2>
        <p>These buttons use the next-auth/react signIn function directly:</p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <SignInButton provider="google" redirectTo={`${window.location.origin}/auth-success?provider=google`} />
          <SignInButton provider="github" redirectTo={`${window.location.origin}/auth-success?provider=github`} />
          <SignInButton provider="facebook" redirectTo={`${window.location.origin}/auth-success?provider=facebook`} />
          <SignInButton provider="linkedin" redirectTo={`${window.location.origin}/auth-success?provider=linkedin`} />
          <SignInButton provider="auth0" redirectTo={`${window.location.origin}/auth-success?provider=auth0`} />
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fff8e1', borderRadius: '0.5rem', border: '1px solid #ffe082' }}>
        <h2 style={{ marginTop: 0 }}>Direct Sign-In (Emergency Fallback)</h2>
        <p>This button uses a direct approach that bypasses the normal flow:</p>

        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={() => {
              // Reset the attempt counter
              localStorage.removeItem('auth-callback-attempt-count');

              // Construct the sign-in URL directly
              const url = new URL('/api/auth/signin/google', window.location.origin);

              // Add callback to our direct handler
              url.searchParams.set('callbackUrl', `${window.location.origin}/api/auth/direct-callback/google`);

              // Add state with timestamp to prevent caching
              const state = JSON.stringify({
                timestamp: new Date().toISOString(),
                origin: window.location.origin
              });
              url.searchParams.set('state', state);

              console.log(`[auth-test] Direct sign-in, redirecting to: ${url.toString()}`);

              // Redirect to the sign-in URL
              window.location.href = url.toString();
            }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Emergency Google Sign-In
          </button>
        </div>
      </div>
    </div>
  );
}
