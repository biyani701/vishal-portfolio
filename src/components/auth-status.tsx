'use client';

import { useSession } from '@/lib/auth-client';
import Link from 'next/link';
import SignOutButton from './sign-out-button';

export default function AuthStatus() {
  // Use the useSession hook from next-auth/react
  const { data: session, status } = useSession();

  // Show loading state
  if (status === 'loading') {
    return <div>Loading authentication status...</div>;
  }

  // Show not signed in state
  if (status === 'unauthenticated' || !session) {
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
