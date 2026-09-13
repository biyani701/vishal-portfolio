import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useAuthContext } from '../../context/AuthProvider';
import config from '../../config';

/**
 * Google Callback component for Auth.js
 * This component handles the callback from Google OAuth via Auth.js
 */
const GoogleCallback = () => {
  const navigate = useNavigate();
  const { checkSession } = useAuthContext();
  const [status, setStatus] = useState('Processing Google login...');

  useEffect(() => {
    const getAuthSession = async () => {
      try {
        // Debug: Log the current URL and search parameters
        console.log('[Auth Debug] GoogleCallback - Current URL:', window.location.href);
        console.log('[Auth Debug] GoogleCallback - Search params:', new URLSearchParams(window.location.search).toString());

        // Check for error parameters in the URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('error')) {
          const errorType = urlParams.get('error');
          const errorDescription = urlParams.get('error_description') || 'No description provided';
          console.error(`[Auth Debug] OAuth Error: ${errorType} - ${errorDescription}`);
          setStatus(`Authentication error: ${errorType} - ${errorDescription}. Redirecting to sign-in page in 5 seconds.`);
          setTimeout(() => navigate('/signin'), 5000);
          return;
        }

        // Debug: Log the session URL we're about to fetch
        console.log('[Auth Debug] Fetching session from:', config.auth.sessionUrl);
        console.log('[Auth Debug] Session fetch timestamp:', new Date().toISOString());

        // For Auth.js, we need to get the session directly
        // The callback should have already set the session cookie
        const sessionResponse = await fetch(config.auth.sessionUrl, {
          credentials: 'include', // Important for cookies to be sent
          headers: {
            'Accept': 'application/json',
            'Origin': window.location.origin
          },
          // Add mode: 'cors' to explicitly request CORS
          mode: 'cors'
        });

        // Debug: Log the response status
        console.log('[Auth Debug] Session response status:', sessionResponse.status);
        console.log('[Auth Debug] Session response headers:', {
          contentType: sessionResponse.headers.get('content-type'),
          setCookie: sessionResponse.headers.get('set-cookie')
        });

        if (!sessionResponse.ok) {
          // Try to get more details about the error
          let errorDetails = '';
          try {
            const errorData = await sessionResponse.json();
            errorDetails = JSON.stringify(errorData);
          } catch (e) {
            errorDetails = await sessionResponse.text();
          }

          console.error('[Auth Debug] Session fetch error details:', errorDetails);
          throw new Error(`Failed to fetch session information: ${sessionResponse.status} ${sessionResponse.statusText}`);
        }

        const session = await sessionResponse.json();
        console.log('[Auth Debug] Auth.js session details:', session);

        if (!session || !session.user) {
          console.error('[Auth Debug] No user in session:', session);
          setStatus('No session found. Authentication may have failed.');
          setTimeout(() => navigate('/signin'), 3000);
          return;
        }

        // Extract user info and token from session
        const { user, accessToken } = session;
        console.log('[Auth Debug] User info:', user);
        console.log('[Auth Debug] Access token present:', !!accessToken);

        // Update the auth context with the new session
        await checkSession();

        // Check if there's a redirect URL stored from a protected route
        const redirectPath = sessionStorage.getItem('auth_redirect') || '/';
        sessionStorage.removeItem('auth_redirect'); // Clear it after use
        console.log('[Auth Debug] Redirecting to:', redirectPath);

        // Redirect to the stored path or home page
        setStatus('Login successful! Redirecting...');
        setTimeout(() => navigate(redirectPath), 1500);
      } catch (error) {
        console.error('[Auth Debug] Authentication error:', error);
        setStatus(`Authentication failed: ${error.message}. Redirecting to sign-in page in 5 seconds.`);
        setTimeout(() => navigate('/signin'), 5000);
      }
    };

    getAuthSession();
  }, [navigate, checkSession]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: 3,
      }}
    >
      <CircularProgress sx={{ mb: 2 }} />
      <Typography variant="h6">{status}</Typography>
    </Box>
  );
};

export default GoogleCallback;
