import React, { useState, useEffect } from 'react';
import { Button, Avatar, Box, Typography, CircularProgress } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LogoutIcon from '@mui/icons-material/Logout';

const GitHubLoginButton = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.user) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error('Failed to fetch session:', error);
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  // Handle login
  const handleLogin = () => {
    // Get the Auth server URL from environment variables or runtime config
    const authServerUrl = (window.runtimeConfig && window.runtimeConfig.AUTH_SERVER_URL) ||
                          process.env.REACT_APP_AUTH_SERVER_URL ||
                          'http://localhost:3000';

    // Use a specific callback path that we'll handle in our app
    const callbackUrl = encodeURIComponent(`${window.location.origin}/auth-callback`);

    // Get the client ID from environment variables or runtime config
    const clientId = (window.runtimeConfig && window.runtimeConfig.CLIENT_ID) ||
                     process.env.REACT_APP_CLIENT_ID ||
                     'portfolio';

    // Add the origin for CORS purposes
    const origin = encodeURIComponent(window.location.origin);

    // For Auth.js v5, we need to use the correct URL format
    // Use the GitHub provider directly
    const signInUrl = `${authServerUrl}/api/auth/signin/github?callbackUrl=${callbackUrl}`;

    // Store the current URL to redirect back to after authentication
    sessionStorage.setItem('auth_redirect', window.location.pathname);

    console.log('[Auth] Provider: github');
    console.log(`[Auth] Auth server URL: ${authServerUrl}`);
    console.log(`[Auth] Callback URL: ${callbackUrl}`);
    console.log(`[Auth] Client ID: ${clientId}`);
    console.log(`[Auth] Origin: ${window.location.origin}`);
    console.log(`[Auth] Sign-in URL: ${signInUrl}`);

    // Redirect to the sign-in page
    window.location.href = signInUrl;
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ callbackUrl: window.location.origin }),
      });

      if (response.ok) {
        // Reload the page after logout
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  if (loading) {
    return <CircularProgress size={24} />;
  }

  if (user) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {user.image && (
          <Avatar
            src={user.image}
            alt={user.name || 'User'}
          />
        )}
        <Box>
          <Typography variant="body2">
            {user.name || user.email || 'User'}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<GitHubIcon />}
      onClick={handleLogin}
      sx={{
        bgcolor: '#24292e',
        '&:hover': {
          bgcolor: '#2c3238'
        }
      }}
    >
      Login with GitHub
    </Button>
  );
};

export default GitHubLoginButton;