// src/components/auth/AuthCallback.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Typography,
  CircularProgress,
  Paper,
  Container,
  Alert,
  Button
} from '@mui/material';
import { useAuthContext } from '../../context/AuthProvider';
import AuthJsClient from './AuthJsClient';

/**
 * Generic Auth Callback component
 * This component handles the callback from OAuth providers via Auth.js
 * Simplified to work with the MUI sign-in pattern
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkSession, setUser } = useAuthContext();
  const [status, setStatus] = useState('Processing authentication...');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processAuthentication = async () => {
      try {
        setLoading(true);
        console.log('[Auth] Processing authentication callback');

        // Extract error from URL if present
        const searchParams = new URLSearchParams(location.search);
        const urlError = searchParams.get('error');

        if (urlError) {
          console.error('[Auth] Error from URL:', urlError);
          setError(`Authentication error: ${urlError}`);
          setLoading(false);
          return;
        }

        // Add a small delay to ensure the session is established
        console.log('[Auth] Waiting for session to be established...');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check the session to update the auth context using AuthJsClient
        const session = await AuthJsClient.getSession();

        console.log('[Auth] Session check result:', session);

        if (!session || !session.user) {
          console.warn('[Auth] No session found after authentication');

          // Try one more time after a delay
          await new Promise(resolve => setTimeout(resolve, 2000));
          const retrySession = await AuthJsClient.getSession();

          if (!retrySession || !retrySession.user) {
            setError('No session found. Please try signing in again.');
            setLoading(false);
            return;
          }

          console.log('[Auth] Session found on retry:', retrySession);

          // Use the retry session
          if (retrySession.user && setUser) {
            // Ensure we have all the user data properly formatted
            const userData = {
              id: retrySession.user.id || retrySession.user.sub,
              name: retrySession.user.name || retrySession.user.login || 'User',
              email: retrySession.user.email || '',
              image: retrySession.user.image || retrySession.user.avatar_url || '',
              provider: retrySession.user.provider || 'unknown'
            };

            console.log('[Auth] Setting user data in context from retry session:', userData);
            setUser(userData);

            // Set a flag to indicate that we have a valid session
            sessionStorage.setItem('auth_session_valid', 'true');

            // Also update the session in the auth context
            await checkSession();
          }
        } else if (session.user && setUser) {
          // Ensure we have all the user data properly formatted
          const userData = {
            id: session.user.id || session.user.sub,
            name: session.user.name || session.user.login || 'User',
            email: session.user.email || '',
            image: session.user.image || session.user.avatar_url || '',
            provider: session.user.provider || 'unknown'
          };

          console.log('[Auth] Setting user data in context:', userData);
          setUser(userData);

          // Set a flag to indicate that we have a valid session
          sessionStorage.setItem('auth_session_valid', 'true');

          // Also update the session in the auth context
          await checkSession();
        }

        // Get the redirect path from sessionStorage (set by AuthJsClient)
        const redirectPath = sessionStorage.getItem('auth_redirect') || '/';

        console.log('[Auth] Redirect path from sessionStorage:', redirectPath);

        // Check if the stored redirect info is still valid (less than 10 minutes old)
        const authTimestamp = sessionStorage.getItem('auth_timestamp');
        const isValidTimestamp = authTimestamp &&
                               (Date.now() - parseInt(authTimestamp, 10)) < 10 * 60 * 1000;

        if (!isValidTimestamp) {
          console.warn('[Auth] Stored redirect info is too old or missing, using default');
        }

        // Update status and redirect
        setStatus(`Authentication successful! Redirecting...`);

        // Store a flag in sessionStorage to indicate we just completed authentication
        // This will be used by the home page to force a session check
        sessionStorage.setItem('auth_just_completed', 'true');
        sessionStorage.setItem('auth_timestamp', Date.now().toString());

        // Redirect after a short delay
        setTimeout(() => {
          // Use the stored redirect path or default to home page
          const targetUrl = redirectPath || '/';

          console.log('[Auth] Redirecting to:', targetUrl);

          // Use the navigate function for internal routes
          if (targetUrl.startsWith('/')) {
            navigate(targetUrl);
          } else {
            // For external URLs, use window.location
            window.location.href = targetUrl;
          }

          // Clear the redirect path
          sessionStorage.removeItem('auth_redirect');
        }, 1500);
      } catch (err) {
        console.error('[Auth] Error during authentication:', err);
        setError(`Authentication error: ${err.message}`);
        setLoading(false);
      }
    };

    processAuthentication();
  }, [navigate, checkSession, location.search]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Authentication
        </Typography>

        {loading ? (
          <>
            <CircularProgress sx={{ my: 4 }} />
            <Typography variant="body1">{status}</Typography>
          </>
        ) : error ? (
          <>
            <Alert severity="error" sx={{ width: '100%', my: 2 }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/signin')}
              sx={{ mt: 2 }}
            >
              Back to Sign In
            </Button>
          </>
        ) : (
          <>
            <Alert severity="success" sx={{ width: '100%', my: 2 }}>
              {status}
            </Alert>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default AuthCallback;
