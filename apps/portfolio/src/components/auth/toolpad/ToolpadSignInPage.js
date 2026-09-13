import React, { useState } from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import config from '../../../config';

/**
 * ToolpadSignInPage component
 * Uses the @toolpad/core SignInPage component to provide a sign-in page
 * that connects to the my-auth-backend server
 */
const ToolpadSignInPage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Define the OAuth providers
  const providers = [
    { id: 'google', name: 'Google' },
    { id: 'github', name: 'GitHub' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'auth0', name: 'Auth0' }
  ];

  // Define the branding
  const branding = {
    logo: (
      <img
        src="/logo192.png"
        alt="Portfolio Logo"
        style={{ height: 40 }}
      />
    ),
    title: 'Portfolio',
  };

  // Handle sign-in with a provider
  const handleSignIn = async (provider) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`[Auth] Signing in with ${provider.id}`);

      // Get the auth server URL from runtime config or config
      const authServerUrl = (window.runtimeConfig && window.runtimeConfig.AUTH_SERVER_URL) ||
                           config.auth.serverUrl;

      // Determine the environment (GitHub Pages, Vercel, localhost)
      const isGitHubPages = window.location.hostname.includes('github.io');
      const isVercel = window.location.hostname.includes('vercel.app');
      const environment = isGitHubPages ? 'github-pages' :
                         isVercel ? 'vercel' : 'localhost';

      // Store the redirect information
      // Instead of storing the current URL, store '/' to redirect to home page
      localStorage.setItem('auth_redirect_path', '/');
      localStorage.setItem('auth_redirect_url', `${window.location.origin}/`);
      localStorage.setItem('auth_timestamp', Date.now().toString());
      localStorage.setItem('auth_environment', environment);

      console.log('[Auth] Will redirect to home page after authentication');
      console.log('[Auth] Environment:', environment);

      // Use auth-callback as the callback URL
      // This needs to work across all environments
      const callbackUrl = encodeURIComponent(`${window.location.origin}/auth-callback`);

      // Always use 'portfolio' as the client ID
      const clientId = 'portfolio';

      // Include the origin as a query parameter
      const origin = encodeURIComponent(window.location.origin);

      // Construct the sign-in URL with the callback URL, client ID, and origin
      const signInUrl = `${authServerUrl}/api/auth/signin/${provider.id}?callbackUrl=${callbackUrl}&clientId=${clientId}&origin=${origin}`;

      console.log('[Auth Debug] Auth server URL:', authServerUrl);
      console.log('[Auth Debug] Callback URL:', callbackUrl);
      console.log('[Auth Debug] Client ID:', clientId);
      console.log('[Auth Debug] Origin:', origin);
      console.log('[Auth Debug] Sign-in URL:', signInUrl);

      // Direct redirect to the auth server
      window.location.href = signInUrl;

      return { success: true };
    } catch (error) {
      console.error('[Auth Error]', error);
      setError(error.message || 'An error occurred during sign-in');
      return { error: error.message || 'An error occurred during sign-in' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppProvider branding={branding} theme={theme}>
      <SignInPage
        providers={providers}
        signIn={handleSignIn}
        loading={loading}
        sx={{
          maxWidth: '500px',
          margin: '0 auto',
          padding: '2rem',
          '& .MuiPaper-root': {
            padding: '2rem',
            borderRadius: '8px',
          },
        }}
      />
    </AppProvider>
  );
};

export default ToolpadSignInPage;
