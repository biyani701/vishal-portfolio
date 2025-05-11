'use client';

import Link from 'next/link';
import { useState } from 'react';

interface LogoutButtonProps {
  callbackUrl?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function LogoutButton({
  callbackUrl = '/',
  className = 'btn btn-secondary',
  style,
  children = 'Sign Out'
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <Link
      href={`/logout?callbackUrl=${encodeURIComponent(callbackUrl)}`}
      className={className}
      style={style}
      onClick={() => setIsLoading(true)}
    >
      {isLoading ? 'Signing Out...' : children}
    </Link>
  );
}
