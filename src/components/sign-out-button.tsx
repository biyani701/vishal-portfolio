'use client';

import { signOut } from '@/lib/auth-client';
import { useState } from 'react';

interface SignOutButtonProps {
  callbackUrl?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function SignOutButton({
  callbackUrl = '/',
  className = '',
  style = {}
}: SignOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const defaultStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: isLoading ? 'wait' : 'pointer',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center',
    opacity: isLoading ? 0.7 : 1,
    ...style
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut({ redirectTo: callbackUrl });
    } catch (error) {
      console.error('Error signing out:', error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className={className}
      style={className ? undefined : defaultStyle}
      disabled={isLoading}
    >
      {isLoading ? 'Signing out...' : 'Sign out'}
    </button>
  );
}
