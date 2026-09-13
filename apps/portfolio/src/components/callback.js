import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  Paper,
  Alert,
  Container
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import HomeIcon from '@mui/icons-material/Home';

const GitHubCallback = () => {
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // Extract the code from URL search params
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');

        if (!code) {
          setError('No authorization code found in URL');
          setLoading(false);
          return;
        }

        setStatus('Exchanging code for token...');

        // Send code to your proxy server
        const response = await fetch('https://auth.vishal.biyani.xyz/api/github-token.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ code })
        });

        const data = await response.json();
        console.log('Response from server:', data);

        if (data.access_token) {
          setStatus('Authentication successful!');
          
          // Store token securely
          localStorage.setItem('github_token', data.access_token);
          if (data.scope) localStorage.setItem('github_scope', data.scope);
          if (data.token_type) localStorage.setItem('github_token_type', data.token_type);
          
          // Redirect to dashboard after successful login
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          setError(`Failed to obtain access token: ${JSON.stringify(data)}`);
          setLoading(false);
        }
      } catch (err) {
        setError(`Error during authentication: ${err.message}`);
        setLoading(false);
        console.error('Authentication error:', err);
      }
    };

    processOAuthCallback();
  }, [location, navigate]);

  return (
    <Container maxWidth="sm">
      <Paper 
        elevation={3} 
        sx={{ 
          mt: 8, 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center'
        }}
      >
        <GitHubIcon sx={{ fontSize: 40, mb: 2, color: 'text.secondary' }} />
        
        <Typography component="h1" variant="h5" gutterBottom>
          GitHub Authentication
        </Typography>
        
        {error ? (
          <Box sx={{ width: '100%', mt: 2 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              fullWidth
              sx={{ mt: 2 }}
            >
              Return to Home
            </Button>
          </Box>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            mt: 2 
          }}>
            {loading && (
              <CircularProgress size={40} sx={{ mb: 2 }} />
            )}
            <Typography variant="body1" color="text.secondary">
              {status}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default GitHubCallback;