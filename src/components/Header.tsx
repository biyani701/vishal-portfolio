'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Header() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const [isSigningOut, setIsSigningOut] = useState(false);

  return (
    <header className="header">
      <div>
        <Link href="/" className="logo">
          OAuth Provider
        </Link>
      </div>
      <nav className="header-nav">
        <Link href="/" className="nav-link">
          Home
        </Link>
        {isAuthenticated ? (
          <>
            <Link href="/profile" className="nav-link">
              {session?.user?.image ? (
                <div className="user-avatar-container">
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={24}
                    height={24}
                    className="user-avatar"
                  />
                  <span>{session.user.name?.split(' ')[0] || 'User'}</span>
                </div>
              ) : (
                <span>Profile</span>
              )}
            </Link>
            <Link href="/protected" className="nav-link">
              Protected
            </Link>
            <button
              onClick={() => {
                setIsSigningOut(true);
                // Use a direct approach to sign out
                signOut({
                  callbackUrl: '/',
                  redirect: true
                });
              }}
              disabled={isSigningOut}
              className="btn btn-secondary"
            >
              {isSigningOut ? 'Signing Out...' : 'Sign Out'}
            </button>
          </>
        ) : (
          <Link href="/login" className="btn btn-primary">
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
}
