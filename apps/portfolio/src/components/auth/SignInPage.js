import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthProvider';

// MUI components
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faLock, faUnlock } from '@fortawesome/free-solid-svg-icons';

// Config
import config from '../../config';

const SignInPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthContext();

  // Get the redirect path from location state or default to '/'
  const from = location.state?.from?.pathname || '/';

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleGitHubSignIn = () => {
    // Store the redirect path in sessionStorage
    sessionStorage.setItem('auth_redirect', from);

    // Redirect to GitHub OAuth
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${config.github.clientId}&redirect_uri=${config.github.redirectUri}&scope=user,repo`;
    window.location.href = githubAuthUrl;
  };

  const handleGoogleSignIn = () => {
    // Store the redirect path in sessionStorage
    sessionStorage.setItem('auth_redirect', from);

    // Redirect to Google OAuth
    const googleAuthUrl = `https://my-oauth-proxy.vercel.app/api/auth/signin/google`;
    window.location.href = googleAuthUrl;
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

        <Box sx={{ width: '100%', mt: 2 }}>
          <Stack spacing={2} width="100%">
            <Button
              variant="contained"
              fullWidth
              onClick={handleGitHubSignIn}
              startIcon={<FontAwesomeIcon icon={faGithub} />}
              sx={{
                backgroundColor: '#24292e',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#2c3440',
                },
              }}
            >
              Sign in with GitHub
            </Button>

            <Button
              variant="contained"
              fullWidth
              onClick={handleGoogleSignIn}
              startIcon={<FontAwesomeIcon icon={faGoogle} />}
              sx={{
                backgroundColor: '#4285F4',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#3367D6',
                },
              }}
            >
              Sign in with Google
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }}>
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
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </Typography>
      </Paper>
    </Container>
  );
};

export default SignInPage;
