// src/components/auth/ModernSignIn.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthProvider";

// MUI components
import {
  Box,
  Container,
  Typography,
  useTheme,
  Paper,
  Button,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  ThemeProvider,
} from "@mui/material";

// MUI Toolpad Core components
import { AppProvider } from "@toolpad/core/AppProvider";
// import { Account } from '@toolpad/core/Account';
import { SignInPage } from "@toolpad/core/SignInPage";
import AuthJsClient from "./AuthJsClient";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faGoogle,
  faFacebookF,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import { faLock, faShieldAlt } from "@fortawesome/free-solid-svg-icons";
// import { Logout, Login } from '@mui/icons-material';

// Config
import config from "../../config";

/**
 * Modern Sign In component that integrates with Auth.js v5
 * This component uses the Auth.js v5 client functions to handle authentication
 */
const ModernSignIn = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { checkSession, isAuthenticated } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  // Get the redirect path from location state or default to '/'
  const from = location.state?.from?.pathname || "/";

  // Define the providers for the Toolpad SignInPage component
  const providers = [
    { id: "github", name: "GitHub" },
    { id: "google", name: "Google" },
    { id: "facebook", name: "Facebook" },
    { id: "linkedin", name: "LinkedIn" },
    { id: "auth0", name: "Auth0" },
  ];

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Helper function to handle sign-in with a provider
  const handleSignIn = async (provider) => {
    try {
      // Validate provider
      if (!provider) {
        console.error("[Auth] No provider specified for sign-in");
        setSnackbarMessage("Error: No authentication provider specified");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      setLoading(true);

      // Store the redirect path in sessionStorage
      sessionStorage.setItem("auth_redirect", from);

      // Also store a flag to indicate we're in the authentication process
      sessionStorage.setItem("auth_in_progress", "true");
      sessionStorage.setItem("auth_provider", provider);
      sessionStorage.setItem("auth_timestamp", Date.now().toString());

      // Show loading message
      setSnackbarMessage(`Redirecting to ${provider} authentication...`);
      setSnackbarSeverity("info");
      setSnackbarOpen(true);

      // Get the auth server URL from runtime config or config
      const authServerUrl =
        (window.runtimeConfig && window.runtimeConfig.AUTH_SERVER_URL) ||
        config.auth.serverUrl;

      // Use the full URL as the callback URL - this is crucial for Auth.js to redirect back correctly
      const callbackUrl = encodeURIComponent(
        `${window.location.origin}/auth-callback`
      );

      // Get the client ID from runtime config, environment variables, or default to 'portfolio'
      const clientId =
        (window.runtimeConfig && window.runtimeConfig.CLIENT_ID) ||
        process.env.REACT_APP_CLIENT_ID ||
        "portfolio";

      // Construct the sign-in URL with client ID and origin as query parameters
      const origin = encodeURIComponent(window.location.origin);

      // Make sure provider is a string and properly formatted
      const providerParam = encodeURIComponent(
        String(provider).toLowerCase().trim()
      );

      const signInUrl = `${authServerUrl}/api/auth/signin/${providerParam}?callbackUrl=${callbackUrl}&clientId=${clientId}&origin=${origin}`;

      console.log(`[Auth] Signing in with ${provider}`);
      console.log(`[Auth] Provider parameter: ${providerParam}`);
      console.log(`[Auth] Auth server URL: ${authServerUrl}`);
      console.log(`[Auth] Callback URL: ${callbackUrl}`);
      console.log(`[Auth] Client ID: ${clientId}`);
      console.log(`[Auth] Origin: ${window.location.origin}`);
      console.log(`[Auth] Sign-in URL: ${signInUrl}`);

      // Direct redirect to the auth server
      window.location.href = signInUrl;
    } catch (error) {
      console.error(`[Auth] Error during ${provider} sign-in:`, error);
      setSnackbarMessage(`Error during sign-in: ${error.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  // Define the branding for the Toolpad Account component
  const branding = {
    logo: (
      <img src="/logo192.png" alt="Portfolio Logo" style={{ height: 40 }} />
    ),
    title: "Portfolio",
  };

  // Prepare user data for the Account component if authenticated
  // const { user } = useAuthContext();
  // const userData = isAuthenticated && user ? {
  //   id: user.id || user.sub,
  //   name: user.name || user.login || 'User',
  //   email: user.email || '',
  //   avatarUrl: user.image || user.avatar_url || '',
  // } : null;

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Sign In
          </Typography>

          <Typography variant="body1" color="text.secondary" align="center">
            {location.state?.from ? (
              <>
                <FontAwesomeIcon icon={faLock} style={{ marginRight: "8px" }} />
                You need to sign in to access this protected content
              </>
            ) : (
              "Sign in to access exclusive features"
            )}
          </Typography>
        </Box>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              my: 3,
            }}
          >
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body1">
              Redirecting to authentication provider...
            </Typography>
          </Box>
        ) : (
          <Box sx={{ width: "100%", mt: 2 }}>
            {/* MUI Toolpad Core Account Component */}
            <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
              <ThemeProvider theme={theme}>
                <AppProvider
                  branding={branding}
                  theme={theme}
                  authentication={{
                    signIn: handleSignIn,
                    signOut: () => {}, // Not needed for sign-in page
                  }}
                >
                  <SignInPage
                    providers={providers}
                    // signIn={handleSignIn}
                    signIn={async (provider) => {
                                            // Call the signIn function from AuthJsClient
                                            if (provider && provider.id) {
                                              console.log(
                                                `[Navbar] Signing in with ${provider.id}`
                                              );
                                              try {
                                                await AuthJsClient.signIn(provider.id);
                                              } catch (error) {
                                                console.error(
                                                  `[Navbar] Error signing in with ${provider.id}:`,
                                                  error
                                                );
                                              }
                                            }
                                          }}
                    slotProps={{
                      emailField: {
                        variant: "outlined",
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: theme.palette.background.paper,
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        },
                      },
                      passwordField: {
                        variant: "outlined",
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: theme.palette.background.paper,
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        },
                      },
                      submitButton: {
                        variant: "contained",
                        sx: {
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                          "&:hover": {
                            backgroundColor: theme.palette.primary.dark,
                          },
                        },
                      },
                    }}
                    sx={{
                      backgroundColor: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                      "& .MuiButton-root": {
                        borderRadius: theme.shape.borderRadius,
                      },
                      "& .MuiPaper-root": {
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                      },
                      "& .MuiTypography-root": {
                        color: theme.palette.text.primary,
                      },
                      "& .MuiDivider-root": {
                        borderColor: theme.palette.divider,
                      },
                    }}
                  />
                </AppProvider>
              </ThemeProvider>
              {/* <AppProvider branding={branding} authentication={{ signIn: (provider) => handleSignIn(provider.id) }}>
                <Account
                  user={userData}
                  signIn={() => navigate('/signin-toolpad')}
                  signOut={() => handleSignIn('signout')}
                  loading={loading}
                  variant="default"
                  slotProps={{
                    signInButton: {
                      color: 'primary',
                      variant: 'contained',
                      startIcon: <Login />,
                      sx: { width: '100%', py: 1.5 }
                    },
                    signOutButton: {
                      color: 'primary',
                      startIcon: <Logout />,
                    },
                    preview: {
                      variant: 'expanded',
                      slotProps: {
                        avatarIconButton: {
                          sx: {
                            width: 'fit-content',
                            margin: 'auto',
                          },
                        },
                        avatar: {
                          variant: 'rounded',
                        },
                      },
                    },
                  }}
                />
              </AppProvider> */}
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR SIGN IN WITH
              </Typography>
            </Divider>

            {/* Social Sign-in Buttons */}
            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleSignIn("github")}
                startIcon={<FontAwesomeIcon icon={faGithub} />}
                sx={{
                  backgroundColor: "#24292e",
                  color: "#fff",
                  py: 1.5,
                  mb: 2,
                  "&:hover": {
                    backgroundColor: "#2c3440",
                  },
                }}
              >
                Continue with GitHub
              </Button>

              <Button
                variant="contained"
                fullWidth
                onClick={() => handleSignIn("google")}
                startIcon={<FontAwesomeIcon icon={faGoogle} />}
                sx={{
                  backgroundColor: "#4285F4",
                  color: "#fff",
                  py: 1.5,
                  mb: 2,
                  "&:hover": {
                    backgroundColor: "#3367D6",
                  },
                }}
              >
                Continue with Google
              </Button>

              <Button
                variant="contained"
                fullWidth
                onClick={() => handleSignIn("facebook")}
                startIcon={<FontAwesomeIcon icon={faFacebookF} />}
                sx={{
                  backgroundColor: "#1877F2",
                  color: "#fff",
                  py: 1.5,
                  mb: 2,
                  "&:hover": {
                    backgroundColor: "#166FE5",
                  },
                }}
              >
                Continue with Facebook
              </Button>

              <Button
                variant="contained"
                fullWidth
                onClick={() => handleSignIn("linkedin")}
                startIcon={<FontAwesomeIcon icon={faLinkedinIn} />}
                sx={{
                  backgroundColor: "#0077B5",
                  color: "#fff",
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "#006699",
                  },
                }}
              >
                Continue with LinkedIn
              </Button>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/")}
              sx={{ mt: 1 }}
            >
              Continue as Guest
            </Button>

            {/* Footer */}
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <FontAwesomeIcon
                  icon={faShieldAlt}
                  style={{ marginRight: "8px" }}
                />
                Your information is securely handled
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ModernSignIn;
