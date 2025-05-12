'use client';

import Link from 'next/link';

export default function SignOutPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '1rem'
    }}>
      <h1 style={{ marginBottom: '1rem' }}>Sign Out</h1>

      <p style={{ marginBottom: '2rem' }}>Click the button below to sign out of your account.</p>

      {/* Simple HTML form that submits a POST request to the Auth.js signout endpoint */}
      <form action="/api/auth/signout" method="post" style={{ marginBottom: '1rem' }}>
        <input type="hidden" name="callbackUrl" value="/" />
        <button type="submit" style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          Sign Out
        </button>
      </form>

      <div style={{ marginTop: '1rem' }}>
        <Link href="/" style={{
          display: 'inline-block',
          padding: '0.5rem 1rem',
          backgroundColor: '#757575',
          color: 'white',
          borderRadius: '0.25rem',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          Cancel
        </Link>
      </div>
    </div>
  );
}
