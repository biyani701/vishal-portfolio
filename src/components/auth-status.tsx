'use client';

import { useState, useEffect } from 'react';
import { getSession } from '@/lib/auth-client';
import Link from 'next/link';
import SignOutButton from './sign-out-button';

export default function AuthStatus() {
  // Define a proper type for the session
  interface UserSession {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      provider?: string;
    } | null;
  }

  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSession() {
      try {
        setLoading(true);
        const sessionData = await getSession();
        setSession(sessionData);
        setError(null);
      } catch (err) {
        console.error('Error loading session:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, []);

  if (loading) {
    return <div>Loading authentication status...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!session || !session.user) {
    return (
      <div>
        <p>Not signed in</p>
        <Link href="/login">
          <button style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4285F4',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Sign in
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p>Signed in as: {session.user.name || session.user.email}</p>
      <SignOutButton callbackUrl="/" />
    </div>
  );
}
