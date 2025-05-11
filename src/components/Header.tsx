'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

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
              Profile
            </Link>
            <Link href="/protected" className="nav-link">
              Protected
            </Link>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })} 
              className="btn btn-secondary"
            >
              Sign Out
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
