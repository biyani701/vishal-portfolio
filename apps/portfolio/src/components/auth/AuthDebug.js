import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthProvider';
import { Box, Typography, Paper, TextField, Button, Divider, Alert, CircularProgress } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import config from '../../config';

const AuthDebug = () => {
  const { isAuthenticated, user, loading } = useAuthContext();
  const [authCode, setAuthCode] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [tokenResponse, setTokenResponse] = useState(null);
  const [userResponse, setUserResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract code from URL if present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    if (code) {
      setAuthCode(code);
    }
  }, [location]);

  // Function to exchange code for token
  const exchangeCodeForToken = async () => {
    if (!authCode) {
      setError('Please enter an authorization code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(config.github.tokenProxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: authCode }),
      });

      const data = await response.json();
      setTokenResponse(data);

      if (data.access_token) {
        setAuthToken(data.access_token);
      } else {
        setError('Failed to get access token');
      }
    } catch (err) {
      setError(`Error exchanging code for token: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch user data with token
  const fetchUserData = async () => {
    if (!authToken) {
      setError('Please enter an access token');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${authToken}`,
        },
      });

      const data = await response.json();
      setUserResponse(data);
    } catch (err) {
      setError(`Error fetching user data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate a new GitHub auth URL
  const generateAuthUrl = () => {
    return `https://github.com/login/oauth/authorize?client_id=${config.github.clientId}&redirect_uri=${config.github.redirectUri}&scope=user,repo`;
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        GitHub Authentication Debug
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Current Auth Status
          </Typography>
          <Typography>
            Authenticated: {isAuthenticated ? 'Yes' : 'No'}
          </Typography>
          {isAuthenticated && user && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">User Info:</Typography>
              <pre style={{
                backgroundColor: '#f5f5f5',
                padding: '10px',
                borderRadius: '4px',
                overflow: 'auto',
                maxHeight: '200px'
              }}>
                {JSON.stringify(user, null, 2)}
              </pre>
            </Box>
          )}
        </Paper>
      )}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Start New Authentication
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href={generateAuthUrl()}
          sx={{ mb: 2 }}
        >
          Authenticate with GitHub
        </Button>
        <Typography variant="body2" color="text.secondary">
          This will redirect you to GitHub for authorization and then back to this page with a code.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Exchange Code for Token
        </Typography>
        <TextField
          fullWidth
          label="Authorization Code"
          value={authCode}
          onChange={(e) => setAuthCode(e.target.value)}
          margin="normal"
          helperText="Enter the code from the URL after GitHub authorization"
        />
        <Button
          variant="contained"
          onClick={exchangeCodeForToken}
          disabled={isLoading || !authCode}
          sx={{ mt: 1 }}
        >
          Exchange Code for Token
        </Button>

        {tokenResponse && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Token Response:</Typography>
            <pre style={{
              backgroundColor: '#f5f5f5',
              padding: '10px',
              borderRadius: '4px',
              overflow: 'auto',
              maxHeight: '200px'
            }}>
              {JSON.stringify(tokenResponse, null, 2)}
            </pre>
          </Box>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Fetch User Data with Token
        </Typography>
        <TextField
          fullWidth
          label="Access Token"
          value={authToken}
          onChange={(e) => setAuthToken(e.target.value)}
          margin="normal"
          helperText="Enter the access token to fetch user data"
        />
        <Button
          variant="contained"
          onClick={fetchUserData}
          disabled={isLoading || !authToken}
          sx={{ mt: 1 }}
        >
          Fetch User Data
        </Button>

        {userResponse && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">User Data:</Typography>
            <pre style={{
              backgroundColor: '#f5f5f5',
              padding: '10px',
              borderRadius: '4px',
              overflow: 'auto',
              maxHeight: '200px'
            }}>
              {JSON.stringify(userResponse, null, 2)}
            </pre>
          </Box>
        )}
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default AuthDebug;
