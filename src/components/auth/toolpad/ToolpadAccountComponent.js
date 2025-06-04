import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticationContext, LocalizationProvider, SessionContext, AppProvider } from "@toolpad/core/AppProvider";
import { Account } from "@toolpad/core/Account";
import {
  Typography,
  Box,
  CircularProgress,
  useTheme,
  Button,
  FormControlLabel,
  Switch,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Login,
  Logout,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Palette as PaletteIcon,
} from "@mui/icons-material";
import { useAuthContext } from "../../../context/AuthProvider";

import { SignOutButton } from '@toolpad/core/Account';

import PropTypes from "prop-types";
import AuthJsClient from "../AuthJsClient";
/**
 * ToolpadAccountComponent
 * Uses the @toolpad/core Account component to provide a sign-in/sign-out experience
 * that connects to the my-auth-backend server
 */
const ToolpadAccountComponent = ({
  variant = "default",
  isDarkMode,
  toggleDarkMode,
  availablePalettes = [],
  currentPaletteIndex = 0,
  changePalette,
  ...props
}) => {
  const theme = useTheme();
  // const { user, isAuthenticated } = useAuthContext();

  const { isAuthenticated, user, signOut } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [authJsAuthenticated, setAuthJsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // State to store Auth.js user data
  const [authJsUser, setAuthJsUser] = useState(null);

  // Check if we have a valid session from Auth.js
  useEffect(() => {
    const checkAuthJsAuthentication = async () => {
      try {
        const isAuthJsAuthenticated = await AuthJsClient.isAuthenticated();
        setAuthJsAuthenticated(isAuthJsAuthenticated);

        if (isAuthJsAuthenticated) {
          // Get the session data to extract user info
          const session = await AuthJsClient.getSession();
          if (session && session.user) {
            console.log(
              "[ToolpadAccountComponent] Got Auth.js user data:",
              session.user
            );
            setAuthJsUser(session.user);
          }
        } else {
          setAuthJsUser(null);
        }
      } catch (error) {
        console.error(
          "[ToolpadAccountComponent] Error checking Auth.js authentication:",
          error
        );
        setAuthJsAuthenticated(false);
        setAuthJsUser(null);
      }
    };

    checkAuthJsAuthentication();

    // Set up an interval to periodically check authentication status
    const intervalId = setInterval(checkAuthJsAuthentication, 10000); // Check every 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  console.log("[Account Component] Debug:", {
    isAuthenticated,
    user,
    loading,
    userKeys: user ? Object.keys(user) : null,
  });

  console.log("variant = ", variant);
  // Define the branding
  const branding = {
    logo: (
      <img src="/logo192.png" alt="Portfolio Logo" style={{ height: 40 }} />
    ),
    title: "Portfolio",
  };

  // Handle sign-in
  const handleSignIn = React.useCallback(async () => {
    try {
      setLoading(true);

      // Navigate to the sign-in page
      navigate("/signin-toolpad");

      return { success: true };
    } catch (error) {
      console.error("[Auth Error]", error);
      return { error: error.message || "An error occurred during sign-in" };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Handle sign-out
  const handleSignOut = React.useCallback(async () => {
    try {
      setLoading(true);

      console.log("[Auth] Signing out with AuthJsClient");

      // Update local state immediately to provide immediate feedback
      setAuthJsAuthenticated(false);
      setAuthJsUser(null);

      // Also call the context signOut if available
      if (signOut) {
        await signOut();
      }

      // Call the signOut function from AuthJsClient with the current URL as the callback
      // This will handle the redirect and server-side cleanup
      await AuthJsClient.signOut(window.location.origin);

      return { success: true };
    } catch (error) {
      console.error("[Auth Error]", error);
      return { error: error.message || "An error occurred during sign-out" };
    } finally {
      setLoading(false);
    }
  }, [signOut]);

  // Prepare user data for the Account component
  // Prioritize Auth.js user data if available, fallback to context user data
  const currentUser = authJsUser || user;
  const userData =
    (isAuthenticated || authJsAuthenticated) && currentUser
      ? {
          id: currentUser.id || currentUser.sub,
          name: currentUser.name || currentUser.login || "User",
          email: currentUser.email || "",
          image: currentUser.image || currentUser.avatar_url || currentUser.avatarUrl || "",
        }
      : null;

  const session = useMemo(() => {
    if ((isAuthenticated || authJsAuthenticated) && userData) {
      return {
        user: {
          name: userData.name,
          email: userData.email,
          image: userData.image,
        },
      };
    }
    return null;
  }, [isAuthenticated, authJsAuthenticated, userData]);

  // Create authentication object with sign-in/sign-out handlers
  const authentication = useMemo(() => {
    return {
      signIn: handleSignIn,
      signOut: handleSignOut,
    };
  }, [handleSignIn, handleSignOut]);

  // More debug logging
  console.log("[Account Component] currentUser:", currentUser);
  console.log("[Account Component] User Data:", userData);
  console.log(
    "[Account Component] Authenticated:",
    isAuthenticated || authJsAuthenticated
  );

  // Debug logging
  // console.log('[ToolpadAccountComponent] Authentication state:', {
  //   isAuthenticated,
  //   authJsAuthenticated,
  //   hasContextUser: !!user,
  //   hasAuthJsUser: !!authJsUser,
  //   userData
  // });

  // Debug: Log what we're passing to the Account component
  // console.log('[ToolpadAccountComponent] Rendering with:', {
  //   userData,
  //   variant,
  //   loading,
  //   isAuthenticated,
  //   authJsAuthenticated
  // });

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CircularProgress size={16} />
        <Typography variant="body2" color="text.secondary">
          Loading account...
        </Typography>
      </Box>
    );
  }

  return (
    // <AppProvider
    // branding={branding}
    // theme={theme}
    // >
    //   <Account
    //     user={userData}
    //     signIn={handleSignIn}
    //     signOut={handleSignOut}
    //     loading={loading}
    //     variant={variant}
    //   />
    // </AppProvider>
    <Box
      sx={{
        width: "100%",
        p: 1,
      }}
    >
      {(isAuthenticated || authJsAuthenticated) && userData ? (
        <Box sx={{ p: 1 }}>
          <AppProvider
            branding={branding}
            theme={theme}
            authentication={authentication}
            session={session}
          >
            <Account
              user={userData}
              signIn={handleSignIn}
              signOut={handleSignOut}
              loading={loading}
              variant={variant}
              slotProps={{
                // signInButton: {
                //   color: 'primary',
                //   variant: 'contained',
                //   startIcon: <Login />,
                //   sx: {
                //     textTransform: 'none',
                //     backgroundColor: theme.palette.primary.main,
                //     '&:hover': {
                //       backgroundColor: theme.palette.primary.dark,
                //     }
                //   }
                // },
                signOutButton: {
                  color: "success",
                  variant: "outlined",
                  startIcon: <Logout />,
                  sx: {
                    textTransform: "none",
                    borderColor: theme.palette.divider,
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: theme.palette.action.hover,
                    },
                  },
                },
                preview: {
                  variant: variant === "expanded" ? "expanded" : "condensed",
                  slotProps: {
                    avatarIconButton: {
                      sx: {
                        width: variant === "expanded" ? 64 : 40,
                        height: variant === "expanded" ? 64 : 40,
                        border: "1px solid green",
                      },
                    },
                    avatar: {
                      variant: "rounded",
                      sx: {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        border: "1px solid orange", // Debug border
                      },
                    },
                  },
                },
              }}
              sx={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                // minHeight: "100px",
                "& .MuiTypography-root": {
                  color: theme.palette.text.primary,
                },
                "& .MuiButton-root": {
                  borderRadius: theme.shape.borderRadius,
                },
              }}
              {...props}
            />
          </AppProvider>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 2,
          }}
        >
          {/* Sign In Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Please sign in to access your account
            </Typography>
            <Button
              variant="contained"
              startIcon={<Login />}
              onClick={handleSignIn}
              sx={{
                textTransform: "none",
                backgroundColor: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              Sign In
            </Button>
          </Box>

          {/* Theme and Settings Section */}
          {/* {(toggleDarkMode || (availablePalettes && availablePalettes.length > 0)) && (
            <>
              <Divider sx={{ my: 1 }} />
              
              {toggleDarkMode && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={isDarkMode}
                      onChange={(e) => toggleDarkMode(e.target.checked)}
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {isDarkMode ? (
                        <Brightness7Icon fontSize="small" />
                      ) : (
                        <Brightness4Icon fontSize="small" />
                      )}
                      <Typography variant="body2">
                        {isDarkMode ? "Light Mode" : "Dark Mode"}
                      </Typography>
                    </Box>
                  }
                  sx={{ ml: 0, mb: 1 }}
                />
              )}
              
              {availablePalettes && availablePalettes.length > 0 && changePalette && (
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <PaletteIcon fontSize="small" />
                    Color Theme
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
                    {availablePalettes.map((palette, index) => (
                      <Tooltip key={palette.name} title={palette.name} arrow>
                        <Box
                          onClick={() => changePalette(index)}
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            bgcolor: palette.primary,
                            border: "2px solid",
                            borderColor:
                              index === currentPaletteIndex
                                ? "primary.main"
                                : "transparent",
                            cursor: "pointer",
                            transition: "transform 0.2s",
                            "&:hover": {
                              transform: "scale(1.2)",
                            },
                          }}
                        />
                      </Tooltip>
                    ))}
                  </Box>
                </Box>
              )}
            </>
          )} */}
        </Box>
      )}
    </Box>
  );
};

ToolpadAccountComponent.propTypes = {
  variant: PropTypes.string,
  isDarkMode: PropTypes.bool,
  toggleDarkMode: PropTypes.func,
  availablePalettes: PropTypes.array,
  currentPaletteIndex: PropTypes.number,
  changePalette: PropTypes.func,
};

export default ToolpadAccountComponent;
