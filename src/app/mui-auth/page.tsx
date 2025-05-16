'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { AuthProvider, AuthResponse } from '@toolpad/core/SignInPage';

// Dynamically import MUI Toolpad Core components to avoid hydration issues
const AppProvider = dynamic(() => import('@toolpad/core/AppProvider').then(mod => mod.AppProvider), { ssr: false });
const SignInPage = dynamic(() => import('@toolpad/core/SignInPage').then(mod => mod.SignInPage), { ssr: false });
const Account = dynamic(() => import('@toolpad/core/Account').then(mod => mod.Account), { ssr: false });

// Define the authentication providers according to MUI Toolpad Core documentation
const providers = [
  { id: 'google', name: 'Google' },
  { id: 'github', name: 'GitHub' },
  { id: 'facebook', name: 'Facebook' },
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'auth0', name: 'Auth0' },
];

// Define the tabs
enum AuthTab {
  SIGN_IN = 'sign-in',
  ACCOUNT = 'account',
}

export default function MuiAuthPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<AuthTab>(
    tabParam === 'account' ? AuthTab.ACCOUNT : AuthTab.SIGN_IN
  );
  const [isClient, setIsClient] = useState(false);
  const isAuthenticated = status === 'authenticated';

  // Use useEffect to ensure we only render MUI components on the client
  useEffect(() => {
    setIsClient(true);

    // Set the active tab based on the URL parameter
    if (tabParam === 'account') {
      setActiveTab(AuthTab.ACCOUNT);
    }
  }, [tabParam]);

  // Handle sign in with a provider according to MUI Toolpad Core API
  const handleSignIn = async (provider: AuthProvider) => {
    try {
      console.log(`[mui-auth] Signing in with ${provider.id}`);

      // Validate the provider
      if (!provider.id || !['google', 'github', 'facebook', 'linkedin', 'auth0'].includes(provider.id)) {
        throw new Error(`Invalid provider: ${provider.id}`);
      }

      // Use the current origin for the redirect
      const redirectTo = `${window.location.origin}/auth-success`;

      // Construct the sign-in URL directly
      // Use the Next.js API route directly instead of the Auth.js route
      const customSignInUrl = `/api/auth/signin/${provider.id}`;
      const url = new URL(customSignInUrl, window.location.origin);

      // Set the callback URL to the auth-success page to avoid middleware redirects
      url.searchParams.set('callbackUrl', redirectTo);

      // Add the client origin to help with cross-origin requests
      url.searchParams.set('x-client-origin', window.location.origin);

      console.log(`[mui-auth] Redirecting to ${url.toString()}`);

      // Redirect directly instead of using the signIn function
      window.location.href = url.toString();

      // Return a success response to satisfy the MUI Toolpad Core API
      return { success: 'success' } as AuthResponse;
    } catch (error) {
      console.error(`[mui-auth] Error signing in with ${provider.id}:`, error);
      return { error: error instanceof Error ? error.message : 'An error occurred during sign in' } as AuthResponse;
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: window.location.href });
    } catch (error) {
      console.error('[mui-auth] Error signing out:', error);
    }
  };

  return (
    <div className="mui-auth-container">
      <h1 className="auth-heading">MUI Toolpad Core Authentication</h1>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === AuthTab.SIGN_IN ? 'active' : ''}`}
          onClick={() => setActiveTab(AuthTab.SIGN_IN)}
        >
          Sign In
        </button>
        <button
          className={`tab-button ${activeTab === AuthTab.ACCOUNT ? 'active' : ''}`}
          onClick={() => setActiveTab(AuthTab.ACCOUNT)}
        >
          Account
        </button>
      </div>

      <div className="tab-content">
        {isClient ? (
          <>
            {activeTab === AuthTab.SIGN_IN && (
              <AppProvider>
                <SignInPage
                  providers={providers}
                  signIn={handleSignIn}
                />
              </AppProvider>
            )}

            {activeTab === AuthTab.ACCOUNT && (
              <AppProvider>
                {isAuthenticated ? (
                  <Account
                    slots={{
                      preview: () => (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {session?.user?.image && (
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundImage: `url(${session.user.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            />
                          )}
                          <span>{session?.user?.name || 'User'}</span>
                        </div>
                      ),
                      signOutButton: () => (
                        <button
                          onClick={handleSignOut}
                          className="sign-in-button"
                        >
                          Sign Out
                        </button>
                      )
                    }}
                  />
                ) : (
                  <div className="not-authenticated">
                    <p>You need to sign in to view your account.</p>
                    <button
                      className="sign-in-button"
                      onClick={() => setActiveTab(AuthTab.SIGN_IN)}
                    >
                      Go to Sign In
                    </button>
                  </div>
                )}
              </AppProvider>
            )}
          </>
        ) : (
          <div className="loading-container">
            <p>Loading authentication components...</p>
          </div>
        )}
      </div>

      <div className="navigation-links">
        <Link href="/" className="nav-link">
          Back to Home
        </Link>
        <Link href="/login" className="nav-link">
          Standard Login Page
        </Link>
      </div>
    </div>
  );
}
