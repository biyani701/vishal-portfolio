// src/components/auth/LogoutPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Paper, Container } from '@mui/material';
import { useAuthContext } from '../../context/AuthProvider';

/**
 * Dedicated logout page component
 * Handles the logout process and redirects the user
 * Simplified to use only Auth.js v5
 */
const LogoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get auth functions from Auth.js v5
  const { signOut } = useAuthContext();

  // Get the callback URL from the query parameters, defaulting to the home page
  const searchParams = new URLSearchParams(location.search);
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  // Flag to prevent infinite loops
  const [logoutPerformed, setLogoutPerformed] = useState(false);

  useEffect(() => {
    // Check if we've already performed logout to prevent infinite loops
    if (logoutPerformed) {
      return;
    }

    async function performLogout() {
      try {
        setIsLoading(true);
        console.log('[LogoutPage] Starting logout process');
        setLogoutPerformed(true); // Mark logout as performed to prevent loops

        // Step 1: Clear client-side storage
        try {
          console.log('[LogoutPage] Clearing storage');
          sessionStorage.clear();
          localStorage.clear();
        } catch (error) {
          console.error('[LogoutPage] Error clearing storage:', error);
        }

        // Step 2: Call Auth.js signOut - this is the primary logout method
        if (signOut) {
          try {
            console.log('[LogoutPage] Calling Auth.js signOut');
            await signOut();
          } catch (error) {
            console.error('[LogoutPage] Error calling Auth.js signOut:', error);
          }
        }

        // Step 3: Clear Auth.js specific cookies
        try {
          console.log('[LogoutPage] Clearing Auth.js cookies');

          // Clear Auth.js specific cookies with different paths
          const cookiesToClear = [
            'next-auth.session-token',
            'next-auth.callback-url',
            'next-auth.csrf-token'
          ];

          const cookiePaths = ['/', '/api', '/api/auth', '/auth'];

          cookiesToClear.forEach(cookieName => {
            cookiePaths.forEach(path => {
              document.cookie = `${cookieName}=;expires=${new Date().toUTCString()};path=${path}`;
            });
          });
        } catch (error) {
          console.error('[LogoutPage] Error clearing cookies:', error);
        }

        // Step 4: Navigate to the callback URL
        console.log('[LogoutPage] Logout successful, redirecting to:', callbackUrl);

        // Use React Router for navigation if possible
        if (callbackUrl === '/' || callbackUrl.startsWith('/')) {
          navigate(callbackUrl);
        } else {
          // For external URLs, use window.location
          window.location.href = callbackUrl;
        }
      } catch (err) {
        console.error('[LogoutPage] Error during logout:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
      }
    }

    performLogout();
  }, [callbackUrl, signOut, navigate, logoutPerformed]);

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Logout Error
          </Typography>

          <Box sx={{
            p: 2,
            bgcolor: 'error.light',
            borderRadius: 1,
            mb: 2,
            color: 'error.dark'
          }}>
            <Typography variant="h6" component="h2" sx={{ mt: 0 }}>
              Error
            </Typography>
            <Typography>{error}</Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/')}
            >
              Return Home
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Logging Out...
        </Typography>

        <CircularProgress sx={{ my: 4 }} />

        <Typography variant="body1" sx={{ mb: 2 }}>
          Please wait while we log you out.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate(callbackUrl)}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LogoutPage;
