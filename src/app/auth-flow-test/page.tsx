'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AuthFlowTestPage() {
  const [provider, setProvider] = useState('google');
  const [callbackUrl, setCallbackUrl] = useState('/auth-flow-test');

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Authentication Flow Test</h1>

      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/" style={{ marginRight: '1rem', textDecoration: 'underline' }}>Home</Link>
        <Link href="/login" style={{ marginRight: '1rem', textDecoration: 'underline' }}>Login</Link>
        <Link href="/auth-test" style={{ marginRight: '1rem', textDecoration: 'underline' }}>Auth Test</Link>
        <Link href="/protected" style={{ textDecoration: 'underline' }}>Protected Page</Link>
      </div>

      <div style={{
        padding: '1.5rem',
        backgroundColor: '#f0f4f8',
        borderRadius: '0.5rem',
        marginBottom: '2rem',
        border: '1px solid #d0e1f9'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Direct Auth.js API Test</h2>

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
          <a
            href={`/api/auth/signin/${provider}?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4285F4',
              color: 'white',
              borderRadius: '0.25rem',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Sign In with {provider.charAt(0).toUpperCase() + provider.slice(1)}
          </a>

          <a
            href={`/logout?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f44336',
              color: 'white',
              borderRadius: '0.25rem',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Sign Out
          </a>
        </div>
      </div>

      <div style={{
        padding: '1.5rem',
        backgroundColor: '#f8f0f4',
        borderRadius: '0.5rem',
        border: '1px solid #f9d0e1'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Auth.js URLs</h2>

        <ul style={{ paddingLeft: '1.5rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <a href="/api/auth/signin" target="_blank" rel="noopener noreferrer">
              /api/auth/signin
            </a>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <a href="/api/auth/signin/google" target="_blank" rel="noopener noreferrer">
              /api/auth/signin/google
            </a>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <a href="/api/auth/signin/github" target="_blank" rel="noopener noreferrer">
              /api/auth/signin/github
            </a>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <a href="/api/auth/signout" target="_blank" rel="noopener noreferrer">
              /api/auth/signout
            </a>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <a href="/api/logout" target="_blank" rel="noopener noreferrer">
              /api/logout (Custom logout API)
            </a>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <a href="/api/auth/session" target="_blank" rel="noopener noreferrer">
              /api/auth/session
            </a>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            <a href="/api/auth/debug" target="_blank" rel="noopener noreferrer">
              /api/auth/debug
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
