// src/pages/auth-callback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';

/**
 * Auth Callback Page
 * This page is the target of the callbackUrl parameter in the Auth.js sign-in URL
 * It simply redirects to the /auth-callback route which is handled by the AuthCallback component
 */
const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the /auth-callback route after a short delay
    // This ensures that the URL is properly updated in the browser
    setTimeout(() => {
      console.log('[Auth] Redirecting from /auth-callback page to /auth-callback route');
      navigate('/auth-callback', { replace: true });
    }, 100);
  }, [navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <CircularProgress sx={{ mb: 2 }} />
      <Typography variant="h6">Processing authentication...</Typography>
    </Box>
  );
};

export default AuthCallbackPage;
