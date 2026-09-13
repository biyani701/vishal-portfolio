// src/components/auth/GitHubCallback.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useAuthContext } from '../../context/AuthProvider';
import config from '../../config';

/**
 * GitHub Callback component for Auth.js
 * This component handles the callback from GitHub OAuth via Auth.js
 */
const GitHubCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing GitHub login...');
  const { checkSession } = useAuthContext();

  useEffect(() => {
    // For Auth.js, we don't need to exchange the code ourselves
    // Auth.js handles the OAuth flow and sets the session cookie

    const getAuthSession = async () => {
      try {
        // Get the session from Auth.js
        const sessionResponse = await fetch(config.auth.sessionUrl, {
          credentials: 'include' // Important for cookies to be sent
        });

        if (!sessionResponse.ok) {
          throw new Error('Failed to fetch session information');
        }

        const session = await sessionResponse.json();
        console.log('Auth.js session:', session);

        if (!session || !session.user) {
          setStatus('No session found. Authentication may have failed.');
          setTimeout(() => navigate('/signin'), 3000);
          return;
        }

        // Log session info for debugging
        console.log('Session user:', session.user);

        // Check the session to update the auth context
        await checkSession();

        // Check if there's a redirect URL stored from a protected route
        const redirectPath = sessionStorage.getItem('auth_redirect') || '/';
        sessionStorage.removeItem('auth_redirect'); // Clear it after use

        // Redirect to the stored path or home page
        setStatus('Login successful! Redirecting...');
        setTimeout(() => navigate(redirectPath), 1500);
      } catch (error) {
        console.error('Authentication error:', error);
        setStatus(`Authentication failed: ${error.message}. Redirecting to sign-in page in 5 seconds.`);
        setTimeout(() => navigate('/signin'), 5000);
      }
    };

    // Execute the function
    getAuthSession();
  }, [navigate, checkSession]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh'
      }}
    >
      <CircularProgress sx={{ mb: 3 }} />
      <Typography variant="h6">{status}</Typography>
    </Box>
  );
};

export default GitHubCallback;