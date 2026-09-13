// src/components/auth/AuthTestPage.js
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

// MUI components
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Divider,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';

// Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import ImageIcon from '@mui/icons-material/Image';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import config from '../../config';

/**
 * Auth Test Page component
 * This component tests the integration with the Auth.js server
 */
const AuthTestPage = () => {
  const { user, isAuthenticated, loading, error, checkSession, signOut } = useAuthContext();
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState([]);
  const [testRunning, setTestRunning] = useState(false);

  // Function to run tests
  const runTests = async () => {
    setTestRunning(true);
    setTestResults([]);

    try {
      // Test 1: Check if runtime config is loaded
      const runtimeConfig = window.runtimeConfig || {};
      const authServerUrl = runtimeConfig.AUTH_SERVER_URL || config.auth.serverUrl;
      const clientId = runtimeConfig.CLIENT_ID || process.env.REACT_APP_CLIENT_ID || 'portfolio';

      setTestResults(prev => [...prev, {
        name: 'Runtime Config',
        status: !!runtimeConfig ? 'success' : 'warning',
        message: !!runtimeConfig
          ? `Runtime config loaded. Auth server URL: ${authServerUrl}, Client ID: ${clientId}`
          : 'Runtime config not found. Using fallback configuration.'
      }]);

      // Test 2: Check if we can connect to the auth server
      try {
        const response = await fetch(`${authServerUrl}/api/auth/providers`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const providers = await response.json();
          setTestResults(prev => [...prev, {
            name: 'Auth Server Connection',
            status: 'success',
            message: `Connected to auth server. Available providers: ${Object.keys(providers).join(', ')}`,
            data: providers
          }]);
        } else {
          setTestResults(prev => [...prev, {
            name: 'Auth Server Connection',
            status: 'error',
            message: `Failed to connect to auth server: ${response.status} ${response.statusText}`
          }]);
        }
      } catch (error) {
        setTestResults(prev => [...prev, {
          name: 'Auth Server Connection',
          status: 'error',
          message: `Error connecting to auth server: ${error.message}`
        }]);
      }

      // Test 3: Check if we're authenticated
      await checkSession();
      setTestResults(prev => [...prev, {
        name: 'Authentication Status',
        status: isAuthenticated ? 'success' : 'info',
        message: isAuthenticated
          ? `Authenticated as ${user?.name || user?.email || 'Unknown User'}`
          : 'Not authenticated'
      }]);

      // Test 4: Check if auth-callback.html is accessible
      try {
        const response = await fetch('/auth-callback.html');
        setTestResults(prev => [...prev, {
          name: 'Auth Callback Page',
          status: response.ok ? 'success' : 'error',
          message: response.ok
            ? 'Auth callback page is accessible'
            : `Auth callback page is not accessible: ${response.status} ${response.statusText}`
        }]);
      } catch (error) {
        setTestResults(prev => [...prev, {
          name: 'Auth Callback Page',
          status: 'error',
          message: `Error accessing auth callback page: ${error.message}`
        }]);
      }
    } catch (error) {
      setTestResults(prev => [...prev, {
        name: 'Test Runner',
        status: 'error',
        message: `Error running tests: ${error.message}`
      }]);
    } finally {
      setTestRunning(false);
    }
  };

  // Run tests on mount
  useEffect(() => {
    runTests();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Auth Integration Test
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          This page tests the integration with the Auth.js server.
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Button
            variant="contained"
            onClick={runTests}
            disabled={testRunning}
            sx={{ mr: 2 }}
          >
            {testRunning ? <CircularProgress size={24} sx={{ mr: 1 }} /> : 'Run Tests'}
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate('/signin')}
            sx={{ mr: 2 }}
          >
            Sign In
          </Button>

          {isAuthenticated && (
            <Button
              variant="outlined"
              color="error"
              onClick={signOut}
            >
              Sign Out
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h6" gutterBottom>
          Test Results
        </Typography>

        {testRunning ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {testResults.map((test, index) => (
              <ListItem key={index} divider={index < testResults.length - 1}>
                <ListItemIcon>
                  {test.status === 'success' && <CheckCircleIcon color="success" />}
                  {test.status === 'error' && <ErrorIcon color="error" />}
                  {test.status === 'warning' && <ErrorIcon color="warning" />}
                  {test.status === 'info' && <InfoIcon color="info" />}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {test.name}
                      <Chip
                        label={test.status}
                        color={
                          test.status === 'success' ? 'success' :
                          test.status === 'error' ? 'error' :
                          test.status === 'warning' ? 'warning' : 'info'
                        }
                        size="small"
                        sx={{ ml: 2 }}
                      />
                    </Box>
                  }
                  secondary={test.message}
                />
              </ListItem>
            ))}
          </List>
        )}

        {isAuthenticated && user && (
          <>
            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              User Information
            </Typography>

            <List>
              <ListItem>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Name" secondary={user.name || 'Not available'} />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText primary="Email" secondary={user.email || 'Not available'} />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <ImageIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Image"
                  secondary={
                    user.image ? (
                      <Box sx={{ mt: 1 }}>
                        <img
                          src={user.image}
                          alt={user.name || 'User'}
                          style={{ width: 50, height: 50, borderRadius: '50%' }}
                        />
                      </Box>
                    ) : 'Not available'
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <VerifiedUserIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Provider"
                  secondary={user.provider || 'Not available'}
                />
              </ListItem>
            </List>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default AuthTestPage;
