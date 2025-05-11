'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const message = searchParams.get('message');
  const provider = searchParams.get('provider');

  // Use state to store the timestamp to avoid hydration mismatch
  const [timestamp, setTimestamp] = useState('');

  // Set the timestamp only on the client side after initial render
  useEffect(() => {
    setTimestamp(new Date().toISOString());

    // Log error details for debugging
    console.error('[auth-error]', {
      error,
      message,
      provider,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    });
  }, [error, message, provider]);

  // Map error codes to user-friendly messages
  const errorMessages: Record<string, string> = {
    // Auth.js standard errors
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have permission to sign in.',
    Verification: 'The verification link may have been used or has expired.',
    OAuthSignin: 'Could not initiate OAuth sign-in.',
    OAuthCallback: 'Error in OAuth callback.',
    OAuthCreateAccount: 'Could not create OAuth provider account.',
    EmailCreateAccount: 'Could not create email provider account.',
    Callback: 'Error in callback.',
    OAuthAccountNotLinked: 'Email already associated with another account.',
    EmailSignin: 'Error sending email.',
    CredentialsSignin: 'Sign in failed. Check the details you provided are correct.',
    SessionRequired: 'Please sign in to access this page.',

    // Custom errors
    InvalidProvider: 'The authentication provider is not supported.',
    SignInError: 'An error occurred during the sign-in process.',
    SignOutError: 'An error occurred during the sign-out process.',
    UnexpectedError: 'An unexpected error occurred.',
    UnknownAction: 'The requested authentication action is not supported.',

    // Default fallback
    Default: 'Unable to sign in.',
  };

  const errorMessage = error ? (errorMessages[error] || errorMessages.Default) : errorMessages.Default;

  return (
    <div className="auth-container">
      <h1 className="auth-heading">Authentication Error</h1>

      <div style={{
        padding: '1rem',
        backgroundColor: 'var(--secondary)',
        borderRadius: '0.5rem',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{ marginBottom: '0.5rem', color: 'var(--error)' }}>Error: {error}</h2>
        <p>{errorMessage}</p>

        {message && (
          <div style={{
            marginTop: '0.5rem',
            padding: '0.5rem',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            borderRadius: '0.25rem',
            border: '1px solid rgba(255, 0, 0, 0.2)'
          }}>
            <p><strong>Error Message:</strong> {message}</p>
          </div>
        )}

        {provider && (
          <div style={{ marginTop: '0.5rem' }}>
            <p><strong>Provider:</strong> {provider}</p>
          </div>
        )}

        <div style={{ marginTop: '1rem' }}>
          <details>
            <summary>Technical Details</summary>
            <pre style={{
              marginTop: '0.5rem',
              padding: '1rem',
              backgroundColor: 'var(--background)',
              borderRadius: '0.25rem',
              overflow: 'auto',
              fontSize: '0.8rem'
            }}>
              {JSON.stringify({
                error,
                message,
                provider,
                timestamp,
                url: typeof window !== 'undefined' ? window.location.href : null
              }, null, 2)}
            </pre>
          </details>
        </div>
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
