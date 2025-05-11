'use client';

import Link from 'next/link';

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
  const defaultStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center',
    ...style
  };

  return (
    <Link
      href={`/logout?callbackUrl=${encodeURIComponent(callbackUrl)}`}
      className={className}
      style={className ? undefined : defaultStyle}
    >
      Sign out
    </Link>
  );
}
