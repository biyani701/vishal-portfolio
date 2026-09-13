// src/components/auth/AuthServerDebug.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  Divider,
  useTheme,
} from '@mui/material';

/**
 * Debug component for Auth.js server
 * Tests various endpoints and displays the results
 */
const AuthServerDebug = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [serverUrl, setServerUrl] = useState(window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://my-oauth-proxy.vercel.app');

  // Test endpoints
  const endpoints = [
    { name: 'Root', path: '/' },
    { name: 'API Root', path: '/api' },
    { name: 'Auth Root', path: '/auth' },
    { name: 'Auth API Root', path: '/api/auth' },
    { name: 'Providers', path: '/api/auth/providers' },
    { name: 'Session', path: '/api/auth/session' },
    { name: 'CSRF', path: '/api/auth/csrf' },
    { name: 'Google Sign-In', path: '/api/auth/signin/google' },
    { name: 'GitHub Sign-In', path: '/api/auth/signin/github' },
  ];

  // Run tests
  const runTests = async () => {
    setLoading(true);
    setResults([]);

    const newResults = [];

    for (const endpoint of endpoints) {
      try {
        const url = `${serverUrl}${endpoint.path}`;
        console.log(`[Auth Debug] Testing endpoint: ${url}`);

        const startTime = Date.now();
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          },
        });
        const endTime = Date.now();

        const responseText = await response.text();
        let responseData = null;
        let isJson = false;

        try {
          responseData = JSON.parse(responseText);
          isJson = true;
        } catch (e) {
          responseData = responseText;
        }

        newResults.push({
          name: endpoint.name,
          url,
          status: response.status,
          time: endTime - startTime,
          contentType: response.headers.get('content-type'),
          cors: {
            allowOrigin: response.headers.get('access-control-allow-origin'),
            allowCredentials: response.headers.get('access-control-allow-credentials'),
          },
          isJson,
          data: responseData,
        });
      } catch (error) {
        newResults.push({
          name: endpoint.name,
          url: `${serverUrl}${endpoint.path}`,
          error: error.message,
        });
      }
    }

    setResults(newResults);
    setLoading(false);
  };

  // Format the response data for display
  const formatData = (result) => {
    if (result.error) {
      return <Typography color="error">{result.error}</Typography>;
    }

    if (result.isJson) {
      return (
        <Box
          component="pre"
          sx={{
            maxHeight: '200px',
            overflow: 'auto',
            p: 1,
            backgroundColor: theme.palette.grey[100],
            borderRadius: 1,
            fontSize: '0.75rem',
          }}
        >
          {JSON.stringify(result.data, null, 2)}
        </Box>
      );
    }

    return (
      <Box
        component="div"
        sx={{
          maxHeight: '200px',
          overflow: 'auto',
          p: 1,
          backgroundColor: theme.palette.grey[100],
          borderRadius: 1,
          fontSize: '0.75rem',
          whiteSpace: 'pre-wrap',
        }}
      >
        {typeof result.data === 'string' && result.data.length > 500
          ? `${result.data.substring(0, 500)}...`
          : result.data}
      </Box>
    );
  };

  return (
    <Container
          maxWidth="md"
          id="about"
          sx={{
            scrollMarginTop: theme.spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 },
            marginTop: { xs: 8, sm: 10, md: 12 },
          }}
        >
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Auth.js Server Diagnostics
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <input
          type="text"
          value={serverUrl}
          onChange={(e) => setServerUrl(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '300px'
          }}
          placeholder="Auth server URL"
        />
        <Button
          variant="contained"
          onClick={runTests}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Run Tests'}
        </Button>
      </Box>

      {results.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Endpoint</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>CORS</TableCell>
                <TableCell>Response</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {result.name}
                    </Typography>
                    <Typography variant="caption" component="div">
                      {result.url}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {result.error ? (
                      <Chip label="Error" color="error" size="small" />
                    ) : (
                      <Chip
                        label={result.status}
                        color={result.status >= 200 && result.status < 300 ? 'success' : 'warning'}
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {result.time ? `${result.time}ms` : '-'}
                  </TableCell>
                  <TableCell>
                    {result.cors ? (
                      <>
                        <Typography variant="caption" component="div">
                          Allow-Origin: {result.cors.allowOrigin || 'none'}
                        </Typography>
                        <Typography variant="caption" component="div">
                          Allow-Credentials: {result.cors.allowCredentials || 'none'}
                        </Typography>
                      </>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell sx={{ maxWidth: '400px' }}>
                    {formatData(result)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
    </Container>
  );
};

export default AuthServerDebug;
