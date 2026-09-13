// src/pages/auth-error.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Paper, Container, Button, Alert } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * Auth Error Page
 * This page is displayed when an authentication error occurs
 * It shows the error message and provides options to retry or go home
 */
const AuthErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('An unknown error occurred during authentication');
  const [errorDetails, setErrorDetails] = useState('');

  useEffect(() => {
    // Parse error information from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const errorParam = searchParams.get('error');
    const messageParam = searchParams.get('message');
    const statusParam = searchParams.get('status');
    
    if (errorParam) {
      // Format the error message based on the error type
      switch (errorParam) {
        case 'AuthError':
          setError(`Authentication Error${statusParam ? ` (${statusParam})` : ''}`);
          break;
        case 'CallbackError':
          setError('Error during authentication callback');
          break;
        case 'MissingCode':
          setError('Missing authentication code');
          break;
        case 'InvalidProvider':
          setError(`Invalid authentication provider: ${searchParams.get('provider') || 'unknown'}`);
          break;
        case 'UnexpectedError':
          setError('Unexpected authentication error');
          break;
        default:
          setError(`Authentication error: ${errorParam}`);
      }
    }
    
    // Set error details if available
    if (messageParam) {
      setErrorDetails(messageParam);
    }
    
    console.error('[Auth Error]', { error: errorParam, message: messageParam, status: statusParam });
  }, [location.search]);

  // Handle retry authentication
  const handleRetry = () => {
    navigate('/signin-toolpad');
  };

  // Handle go home
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2
        }}
      >
        <ErrorOutlineIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
        
        <Typography variant="h4" component="h1" gutterBottom>
          Authentication Failed
        </Typography>
        
        <Alert severity="error" sx={{ width: '100%', my: 2 }}>
          {error}
          {errorDetails && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {errorDetails}
            </Typography>
          )}
        </Alert>
        
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRetry}
          >
            Try Again
          </Button>
          
          <Button
            variant="outlined"
            onClick={handleGoHome}
          >
            Go Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthErrorPage;
