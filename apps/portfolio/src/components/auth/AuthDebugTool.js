// src/components/auth/AuthDebugTool.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Divider,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import config from '../../config';

/**
 * Auth Debug Tool component
 * This component helps diagnose authentication issues
 */
const AuthDebugTool = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [customUrl, setCustomUrl] = useState('');
  const [provider, setProvider] = useState('github');

  // Get configuration values
  const runtimeConfig = window.runtimeConfig || {};
  const authServerUrl = runtimeConfig.AUTH_SERVER_URL || config.auth.serverUrl;
  const clientId = runtimeConfig.CLIENT_ID || process.env.REACT_APP_CLIENT_ID || 'portfolio';

  // Function to test the auth server connection
  const testAuthServer = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${authServerUrl}/api/auth/providers`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setResults(prev => [...prev, {
          name: 'Auth Server Connection',
          status: 'success',
          message: `Connected to auth server. Available providers: ${Object.keys(data).join(', ')}`,
          data
        }]);
      } else {
        // Try to parse the error response
        try {
          const text = await response.text();
          const errorData = JSON.parse(text);

          // Special handling for "handler.auth is not a function" error
          if (errorData.message && errorData.message.includes("handler.auth is not a function")) {
            setResults(prev => [...prev, {
              name: 'Auth Server Connection',
              status: 'error',
              message: `Server error: ${errorData.error} - ${errorData.message}. This suggests an issue with the Auth.js configuration on the server. Please check the AUTH_INTEGRATION_README.md file for instructions on fixing this issue.`,
              data: errorData
            }]);
          } else {
            setResults(prev => [...prev, {
              name: 'Auth Server Connection',
              status: 'error',
              message: `Server error: ${errorData.error} - ${errorData.message}`,
              data: errorData
            }]);
          }
        } catch (e) {
          // If we can't parse the error as JSON, just use the status
          setResults(prev => [...prev, {
            name: 'Auth Server Connection',
            status: 'error',
            message: `Failed to connect to auth server: ${response.status} ${response.statusText}`
          }]);
        }
      }
    } catch (error) {
      setResults(prev => [...prev, {
        name: 'Auth Server Connection',
        status: 'error',
        message: `Error connecting to auth server: ${error.message}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Function to test the client identification
  const testClientIdentification = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${authServerUrl}/api/auth/csrf`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setResults(prev => [...prev, {
          name: 'Client Identification',
          status: 'success',
          message: `CSRF token generated. Client identification working.`,
          data
        }]);
      } else {
        // Try to parse the error response
        try {
          const text = await response.text();
          const errorData = JSON.parse(text);

          // Special handling for "handler.auth is not a function" error
          if (errorData.message && errorData.message.includes("handler.auth is not a function")) {
            setResults(prev => [...prev, {
              name: 'Client Identification',
              status: 'error',
              message: `Server error: ${errorData.error} - ${errorData.message}. This suggests an issue with the Auth.js configuration on the server. Please check the AUTH_INTEGRATION_README.md file for instructions on fixing this issue.`,
              data: errorData
            }]);
          } else {
            setResults(prev => [...prev, {
              name: 'Client Identification',
              status: 'error',
              message: `Server error: ${errorData.error} - ${errorData.message}`,
              data: errorData
            }]);
          }
        } catch (e) {
          // If we can't parse the error as JSON, just use the status
          setResults(prev => [...prev, {
            name: 'Client Identification',
            status: 'error',
            message: `Failed to get CSRF token: ${response.status} ${response.statusText}`
          }]);
        }
      }
    } catch (error) {
      setResults(prev => [...prev, {
        name: 'Client Identification',
        status: 'error',
        message: `Error testing client identification: ${error.message}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Function to generate a sign-in URL
  const generateSignInUrl = (provider) => {
    // Use the full URL as the callback URL - this is crucial for Auth.js to redirect back correctly
    const callbackUrl = encodeURIComponent(`${window.location.origin}/auth-callback`);
    const origin = encodeURIComponent(window.location.origin);
    return `${authServerUrl}/api/auth/signin/${provider}?callbackUrl=${callbackUrl}&clientId=${clientId}&origin=${origin}`;
  };

  // Function to open a sign-in URL
  const openSignInUrl = (url) => {
    window.open(url, '_blank');
  };

  // Function to clear results
  const clearResults = () => {
    setResults([]);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Auth Debug Tool
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          This tool helps diagnose authentication issues with the Auth.js server.
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Configuration
          </Typography>

          <List>
            <ListItem>
              <ListItemText
                primary="Auth Server URL"
                secondary={authServerUrl}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Client ID"
                secondary={clientId}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Origin"
                secondary={window.location.origin}
              />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Test Tools
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              onClick={testAuthServer}
              disabled={loading}
            >
              Test Auth Server Connection
            </Button>

            <Button
              variant="contained"
              onClick={testClientIdentification}
              disabled={loading}
            >
              Test Client Identification
            </Button>

            <Button
              variant="contained"
              onClick={() => {
                // Open the auth server URL directly in a new tab
                window.open(`${authServerUrl}/api/auth/providers`, '_blank');
              }}
              disabled={loading}
            >
              Open Auth Server Directly
            </Button>

            <Button
              variant="outlined"
              onClick={clearResults}
              disabled={loading}
            >
              Clear Results
            </Button>
          </Box>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Generate Sign-In URLs</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    select
                    label="Provider"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    SelectProps={{
                      native: true,
                    }}
                    sx={{ minWidth: 120 }}
                  >
                    <option value="github">GitHub</option>
                    <option value="google">Google</option>
                    <option value="facebook">Facebook</option>
                    <option value="linkedin">LinkedIn</option>
                  </TextField>

                  <Button
                    variant="contained"
                    onClick={() => openSignInUrl(generateSignInUrl(provider))}
                  >
                    Open Sign-In URL
                  </Button>
                </Box>

                <TextField
                  fullWidth
                  label="Generated URL"
                  value={generateSignInUrl(provider)}
                  slotProps={{
                    input: {
                      readOnly: true,
                    }
                  }}
                />

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1">Custom URL</Typography>

                <TextField
                  fullWidth
                  label="Custom URL"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="Enter a custom URL to test"
                />

                <Button
                  variant="contained"
                  onClick={() => openSignInUrl(customUrl)}
                  disabled={!customUrl}
                >
                  Open Custom URL
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Test Results
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : results.length === 0 ? (
            <Alert severity="info">
              No test results yet. Run a test to see results.
            </Alert>
          ) : (
            <List>
              {results.map((result, index) => (
                <Paper key={index} elevation={1} sx={{ mb: 2, p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 2 }}>
                      {result.name}
                    </Typography>
                    <Chip
                      label={result.status}
                      color={result.status === 'success' ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {result.message}
                  </Typography>
                  {result.data && (
                    <Accordion sx={{ mt: 1 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="body2">View Data</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <pre style={{ overflow: 'auto', maxHeight: '200px' }}>
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </AccordionDetails>
                    </Accordion>
                  )}
                </Paper>
              ))}
            </List>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthDebugTool;
