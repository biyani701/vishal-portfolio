'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AuthV5TestPage() {
  const [provider, setProvider] = useState('google');
  const [callbackUrl, setCallbackUrl] = useState('/auth-v5-test');

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Auth.js v5 Test</h1>

      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/" style={{ marginRight: '1rem', textDecoration: 'underline' }}>Home</Link>
        <Link href="/login" style={{ marginRight: '1rem', textDecoration: 'underline' }}>Login</Link>
        <Link href="/auth-test" style={{ marginRight: '1rem', textDecoration: 'underline' }}>Auth Test</Link>
        <Link href="/auth-flow-test" style={{ marginRight: '1rem', textDecoration: 'underline' }}>Auth Flow Test</Link>
        <Link href="/protected" style={{ textDecoration: 'underline' }}>Protected Page</Link>
      </div>

      <div style={{
        padding: '1.5rem',
        backgroundColor: '#f0f4f8',
        borderRadius: '0.5rem',
        marginBottom: '2rem',
        border: '1px solid #d0e1f9'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Direct Auth.js v5 API Test</h2>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Provider:
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              style={{
                marginLeft: '0.5rem',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid #ccc'
              }}
            >
              <option value="google">Google</option>
              <option value="github">GitHub</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Callback URL:
            <input
              type="text"
              value={callbackUrl}
              onChange={(e) => setCallbackUrl(e.target.value)}
              style={{
                marginLeft: '0.5rem',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid #ccc',
                width: '300px'
              }}
            />
          </label>
          <p style={{
            fontSize: '0.85rem',
            color: '#666',
            marginTop: '0.25rem',
            marginLeft: '0.5rem'
          }}>
            This is the URL where you'll be redirected after signing in or out.
            For testing, it's best to set this to the current page URL.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={async () => {
              try {
                // Import dynamically to avoid server-side issues
                const { signIn } = await import('@/lib/auth-client');
                await signIn(provider, { redirectTo: callbackUrl });
              } catch (err) {
                console.error('Error signing in:', err);
                alert('Error signing in: ' + (err instanceof Error ? err.message : 'Unknown error'));
              }
            }}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4285F4',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Sign In with {provider.charAt(0).toUpperCase() + provider.slice(1)}
          </button>

          <Link
            href={`/logout?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              textDecoration: 'none'
            }}
          >
            Sign Out
          </Link>
        </div>
      </div>

      <div style={{
        padding: '1.5rem',
        backgroundColor: '#f8f0f4',
        borderRadius: '0.5rem',
        border: '1px solid #f9d0e1'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Auth.js v5 Migration Notes</h2>

        <p style={{ marginBottom: '1rem' }}>
          Auth.js v5 has a different API structure than previous versions. Here are some key changes:
        </p>

        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Redirect Handling:</strong> Auth.js v5 uses Next.js's built-in redirect mechanism, which throws a NEXT_REDIRECT error.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Dynamic Routes:</strong> When using dynamic routes, you need to properly handle the params object.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>signIn/signOut:</strong> These functions now return a URL instead of redirecting directly.
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>Configuration:</strong> The trustHost option is now required for production.
          </li>
        </ul>

        <p>
          <a
            href="https://authjs.dev/getting-started/migrating-to-v5"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0070f3', textDecoration: 'underline' }}
          >
            Read the full migration guide
          </a>
        </p>
      </div>
    </div>
  );
}
