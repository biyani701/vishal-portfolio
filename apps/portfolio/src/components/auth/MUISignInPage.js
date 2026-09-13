import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthProvider';

// MUI components
import {
  Box,
  Container,
  Typography,
  useTheme,
  Paper,
  Button,
  Divider,
} from '@mui/material';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';

// Config
import config from '../../config';

// Auth Debug Utilities
import { logCompleteDebugReport, diagnoseAuthIssues, testAuthServerConnection } from './AuthDebugUtils';

/**
 * MUI Sign In Page component
 * Uses the MUI Sign In component styling with GitHub and Google OAuth providers
 */
const MUISignInPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Get the redirect path from location state or default to '/'
  const from = location.state?.from?.pathname || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }

    // Log complete debug information on component mount
    logCompleteDebugReport(config);

    // Check for potential issues
    const issues = diagnoseAuthIssues(config);
    if (issues.length > 0) {
      console.warn('[Auth Debug] Potential issues detected:');
      issues.forEach(issue => console.warn(`- ${issue}`));
    }
  }, [isAuthenticated, navigate, from]);

  // Helper function to open authentication popup and handle the result
  const openAuthPopup = (authUrl, windowName) => {
    // Add a special parameter to indicate this is a popup
    const popupAuthUrl = `${authUrl}&isPopup=true`;
    console.log('[Auth Debug] Popup auth URL:', popupAuthUrl);

    // Open a popup window for authentication
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const authWindow = window.open(
      popupAuthUrl,
      windowName,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );

    // If popup was blocked, fall back to redirect
    if (!authWindow) {
      console.warn('[Auth Debug] Popup was blocked. Falling back to redirect.');
      window.location.href = authUrl;
      return;
    }

    // Set up message listener for cross-window communication
    const messageListener = (event) => {
      // Verify the message is from our popup
      if (event.source === authWindow) {
        console.log('[Auth Debug] Received message from popup:', event.data);

        // Check if the message indicates successful authentication
        if (event.data && event.data.type === 'auth-success') {
          // Remove the message listener
          window.removeEventListener('message', messageListener);

          // Close the popup
          authWindow.close();

          // Check the session
          checkSession();
        }
      }
    };

    // Add the message listener
    window.addEventListener('message', messageListener);

    // Function to check the session
    const checkSession = () => {
      console.log('[Auth Debug] Checking session...');

      // Fetch the session to check if authentication was successful
      fetch(config.auth.sessionUrl, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Origin': window.location.origin
        },
        mode: 'cors'
      })
      .then(response => response.json())
      .then(session => {
        console.log('[Auth Debug] Session check result:', session);
        if (session && session.user) {
          // Authentication successful, redirect to the stored path
          const redirectPath = sessionStorage.getItem('auth_redirect') || '/';
          console.log('[Auth Debug] Authentication successful. Redirecting to:', redirectPath);
          navigate(redirectPath, { replace: true });
        } else {
          console.warn('[Auth Debug] No session found after authentication.');
        }
      })
      .catch(error => {
        console.error('[Auth Debug] Error fetching session:', error);
      });
    };

    // Poll for changes to the popup window as a fallback
    const checkPopup = setInterval(() => {
      try {
        // Check if the popup is closed
        if (authWindow.closed) {
          clearInterval(checkPopup);
          // Remove the message listener
          window.removeEventListener('message', messageListener);
          console.log('[Auth Debug] Auth popup closed. Checking for session...');

          // Check the session
          checkSession();
        }
      } catch (error) {
        // Error accessing the popup window (likely due to cross-origin restrictions)
        // This is normal and can be ignored
      }
    }, 500);
  };

  const handleGitHubSignIn = () => {
    // Store the redirect path in sessionStorage
    sessionStorage.setItem('auth_redirect', from);

    // For Auth.js, we need to include the callbackUrl parameter
    // We'll use the auth-callback.html page as the callback URL
    const callbackUrl = encodeURIComponent(`${window.location.origin}/auth-callback.html`);
    const githubAuthUrl = `${config.github.signInUrl}?callbackUrl=${callbackUrl}`;

    console.log('[Auth Debug] GitHub auth URL:', githubAuthUrl);

    // Use the helper function to open the auth popup
    openAuthPopup(githubAuthUrl, 'githubAuth');
  };

  const handleGoogleSignIn = () => {
    // Store the redirect path in sessionStorage
    sessionStorage.setItem('auth_redirect', from);

    // For Auth.js, we need to include the callbackUrl parameter
    // We'll use the auth-callback.html page as the callback URL
    const callbackUrl = encodeURIComponent(`${window.location.origin}/auth-callback.html`);

    // Debug: Log the configuration values
    console.log('[Auth Debug] Google Sign-In Configuration:', {
      serverUrl: config.auth.serverUrl,
      signInUrl: config.google.signInUrl,
      callbackUrl: callbackUrl,
      windowOrigin: window.location.origin
    });

    // Try different URL formats based on a query parameter for debugging
    const urlParams = new URLSearchParams(window.location.search);
    const urlFormat = urlParams.get('auth_format') || '1'; // Default to format 1

    let googleAuthUrl;

    switch(urlFormat) {
      case '1':
        // Format 1: Standard format with callbackUrl as query parameter
        googleAuthUrl = `${config.google.signInUrl}?callbackUrl=${callbackUrl}`;
        break;
      case '2':
        // Format 2: Try with redirect_uri instead of callbackUrl
        googleAuthUrl = `${config.google.signInUrl}?redirect_uri=${callbackUrl}`;
        break;
      case '3':
        // Format 3: Try with both parameters
        googleAuthUrl = `${config.google.signInUrl}?callbackUrl=${callbackUrl}&redirect_uri=${callbackUrl}`;
        break;
      case '4':
        // Format 4: Try with no parameters (Auth.js might use defaults)
        googleAuthUrl = `${config.google.signInUrl}`;
        break;
      case '5':
        // Format 5: Try with a different path structure
        googleAuthUrl = `${config.auth.serverUrl}/api/auth/signin?provider=google&callbackUrl=${callbackUrl}`;
        break;
      default:
        // Default to format 1
        googleAuthUrl = `${config.google.signInUrl}?callbackUrl=${callbackUrl}`;
    }

    console.log(`[Auth Debug] Using URL format ${urlFormat}:`, googleAuthUrl);
    console.log('[Auth Debug] Timestamp:', new Date().toISOString());

    // Use the helper function to open the auth popup
    openAuthPopup(googleAuthUrl, 'googleAuth');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Sign In
        </Typography>

        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          {location.state?.from ? (
            <>
              <FontAwesomeIcon icon={faLock} style={{ marginRight: '8px' }} />
              You need to sign in to access this protected content
            </>
          ) : (
            'Sign in to access exclusive features'
          )}
        </Typography>

        {/* GitHub Sign In Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleGitHubSignIn}
          startIcon={<FontAwesomeIcon icon={faGithub} />}
          sx={{
            backgroundColor: '#24292e',
            color: '#fff',
            py: 1.5,
            mb: 2,
            '&:hover': {
              backgroundColor: '#2c3440',
            },
          }}
        >
          Continue with GitHub
        </Button>

        {/* Google Sign In Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleGoogleSignIn}
          startIcon={<FontAwesomeIcon icon={faGoogle} />}
          sx={{
            backgroundColor: '#4285F4',
            color: '#fff',
            py: 1.5,
            '&:hover': {
              backgroundColor: '#3367D6',
            },
          }}
        >
          Continue with Google
        </Button>

        <Divider sx={{ width: '100%', my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate('/')}
          sx={{ mt: 1 }}
        >
          Continue as Guest
        </Button>

        {/* Debug button - only visible in development */}
        {process.env.NODE_ENV === 'development' && (
          <Button
            variant="text"
            fullWidth
            onClick={() => {
              console.clear();
              logCompleteDebugReport(config);
              const issues = diagnoseAuthIssues(config);
              if (issues.length > 0) {
                console.warn('[Auth Debug] Potential issues detected:');
                issues.forEach(issue => console.warn(`- ${issue}`));
              } else {
                console.log('[Auth Debug] No obvious issues detected in configuration');
              }

              // Run comprehensive tests on the Auth.js server
              testAuthServerConnection(config)
                .then(results => {
                  console.log('[Auth Debug] Auth server test results:', results);

                  // Display a summary of the test results
                  const successfulTests = results.tests.filter(test => test.success).length;
                  const totalTests = results.tests.length;

                  console.log(`[Auth Debug] Test summary: ${successfulTests}/${totalTests} tests passed`);

                  // Check for CORS issues specifically
                  const corsTest = results.tests.find(test => test.name === 'CORS headers');
                  if (corsTest && !corsTest.success) {
                    console.error('[Auth Debug] CORS headers are missing. You need to configure CORS on your Auth.js server.');
                    console.log('[Auth Debug] See the Auth.js documentation on CORS: https://next-auth.js.org/configuration/options#cookies');
                  }
                })
                .catch(error => {
                  console.error('[Auth Debug] Error running tests:', error);
                });
            }}
            sx={{ mt: 2, color: 'text.secondary' }}
          >
            Run Auth Diagnostics
          </Button>
        )}

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default MUISignInPage;
