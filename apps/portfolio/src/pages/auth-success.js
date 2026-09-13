// src/pages/auth-success.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, CircularProgress, Paper, Container } from '@mui/material';
import { useAuthContext } from '../context/AuthProvider';

/**
 * Auth Success Page
 * This page is displayed after a successful authentication
 * It retrieves the stored redirect URL from localStorage and redirects the user
 */
const AuthSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkSession } = useAuthContext();
  const [status, setStatus] = useState('Authentication successful! Redirecting...');

  useEffect(() => {
    const completeAuthentication = async () => {
      try {
        console.log('[Auth Success] Processing successful authentication');

        // Get the provider from the URL if available
        const searchParams = new URLSearchParams(location.search);
        const provider = searchParams.get('provider') || 'unknown';

        console.log(`[Auth Success] Provider: ${provider}`);

        // Check the session to update the auth context
        const session = await checkSession();
        console.log('[Auth Success] Session check result:', session);

        // Get the redirect URL from localStorage
        const redirectPath = localStorage.getItem('auth_redirect_path') || '/';
        const redirectUrl = localStorage.getItem('auth_redirect_url') || '/';
        const authTimestamp = localStorage.getItem('auth_timestamp');
        const authEnvironment = localStorage.getItem('auth_environment') || 'localhost';

        // Determine the current environment
        const isGitHubPages = window.location.hostname.includes('github.io');
        const isVercel = window.location.hostname.includes('vercel.app');
        const currentEnvironment = isGitHubPages ? 'github-pages' :
                                 isVercel ? 'vercel' : 'localhost';

        console.log('[Auth Success] Redirect path from localStorage:', redirectPath);
        console.log('[Auth Success] Redirect URL from localStorage:', redirectUrl);
        console.log('[Auth Success] Auth timestamp:', authTimestamp);
        console.log('[Auth Success] Auth environment:', authEnvironment);
        console.log('[Auth Success] Current environment:', currentEnvironment);

        // Check if the stored redirect info is still valid (less than 10 minutes old)
        const isValidTimestamp = authTimestamp &&
                               (Date.now() - parseInt(authTimestamp, 10)) < 10 * 60 * 1000;

        if (!isValidTimestamp) {
          console.warn('[Auth Success] Stored redirect info is too old or missing, using default');
        }

        // Clear the stored auth data
        localStorage.removeItem('auth_redirect_path');
        localStorage.removeItem('auth_redirect_url');
        localStorage.removeItem('auth_timestamp');
        localStorage.removeItem('auth_environment');

        // Always redirect to the home page
        const targetUrl = '/';

        // Redirect after a short delay
        setTimeout(() => {
          console.log('[Auth Success] Redirecting to home page');
          // Use the full URL with origin to ensure proper redirection
          window.location.href = `${window.location.origin}${targetUrl}`;
        }, 1500);
      } catch (error) {
        console.error('[Auth Success] Error:', error);
        setStatus(`Error: ${error.message}. Redirecting to home page...`);

        // Redirect to home page on error
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    };

    completeAuthentication();
  }, [navigate, checkSession, location.search]);

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
        <Typography variant="h4" component="h1" gutterBottom>
          Authentication Successful
        </Typography>

        <CircularProgress sx={{ my: 4 }} />

        <Typography variant="body1" align="center">
          {status}
        </Typography>
      </Paper>
    </Container>
  );
};

export default AuthSuccessPage;
