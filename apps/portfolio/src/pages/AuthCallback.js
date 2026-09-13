import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Auth Callback Page
 * 
 * This component handles the callback from the Auth.js server after authentication.
 * It extracts the session information and redirects the user to the appropriate page.
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to handle the authentication callback
    const handleAuthCallback = async () => {
      try {
        console.log('[AuthCallback] Processing authentication callback');
        
        // Fetch the session to verify authentication was successful
        const response = await fetch('/api/auth/session', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const session = await response.json();
          console.log('[AuthCallback] Session data:', session);
          
          if (session && session.user) {
            // Authentication successful, redirect to home or stored redirect path
            const redirectPath = sessionStorage.getItem('auth_redirect') || '/';
            console.log(`[AuthCallback] Authentication successful, redirecting to: ${redirectPath}`);
            navigate(redirectPath);
          } else {
            // No session found, authentication may have failed
            console.error('[AuthCallback] No session found after authentication');
            setError('Authentication failed. Please try again.');
            // Redirect to home after a delay
            setTimeout(() => navigate('/'), 3000);
          }
        } else {
          // Error fetching session
          console.error('[AuthCallback] Failed to fetch session:', response.status);
          setError('Failed to verify authentication. Please try again.');
          // Redirect to home after a delay
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (error) {
        console.error('[AuthCallback] Error processing callback:', error);
        setError('An error occurred during authentication. Please try again.');
        // Redirect to home after a delay
        setTimeout(() => navigate('/'), 3000);
      }
    };

    // Process the callback
    handleAuthCallback();
  }, [navigate]);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '50vh',
        padding: 4
      }}
    >
      {error ? (
        <Typography color="error" variant="h6" align="center">
          {error}
        </Typography>
      ) : (
        <>
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="h6" align="center">
            Completing authentication...
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary">
            Please wait while we redirect you.
          </Typography>
        </>
      )}
    </Box>
  );
};

export default AuthCallback;
