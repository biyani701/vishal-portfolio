import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppProvider } from '@toolpad/core/AppProvider';
import { Account } from '@toolpad/core/Account';
import { useAuthContext } from '../../../context/AuthProvider';
import { Logout } from '@mui/icons-material';
import config from '../../../config';
import PropTypes from "prop-types";
import AuthJsClient from '../AuthJsClient';
/**
 * ToolpadAccountComponent
 * Uses the @toolpad/core Account component to provide a sign-in/sign-out experience
 * that connects to the my-auth-backend server
 */
const ToolpadAccountComponent = ({ variant = 'default' }) => {
  const { user, isAuthenticated } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authJsAuthenticated, setAuthJsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check if we have a valid session from Auth.js
  useEffect(() => {
    const checkAuthJsAuthentication = async () => {
      const isAuthJsAuthenticated = await AuthJsClient.isAuthenticated();
      setAuthJsAuthenticated(isAuthJsAuthenticated);
    };

    checkAuthJsAuthentication();

    // Set up an interval to periodically check authentication status
    const intervalId = setInterval(async () => {
      const isAuthJsAuthenticated = await AuthJsClient.isAuthenticated();
      setAuthJsAuthenticated(isAuthJsAuthenticated);
    }, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  // Define the branding
  const branding = {
    logo: (
      <img
        src="/logo192.png"
        alt="Portfolio Logo"
        style={{ height: 40 }}
      />
    ),
    title: 'Portfolio',
  };

  // Handle sign-in
  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      // Navigate to the sign-in page
      navigate('/signin-toolpad');

      return { success: true };
    } catch (error) {
      console.error('[Auth Error]', error);
      setError(error.message || 'An error occurred during sign-in');
      return { error: error.message || 'An error occurred during sign-in' };
    } finally {
      setLoading(false);
    }
  };

  // Handle sign-out
  const handleSignOut = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('[Auth] Signing out with AuthJsClient');

      // Call the signOut function from AuthJsClient with the current URL as the callback
      await AuthJsClient.signOut(window.location.origin);

      // The signOut function will handle the redirect
      // No need to navigate manually

      return { success: true };
    } catch (error) {
      console.error('[Auth Error]', error);
      setError(error.message || 'An error occurred during sign-out');
      return { error: error.message || 'An error occurred during sign-out' };
    } finally {
      setLoading(false);
    }
  };

  // Prepare user data for the Account component
  const userData = (isAuthenticated || authJsAuthenticated) && user ? {
    id: user.id || user.sub,
    name: user.name || user.login || 'User',
    email: user.email || '',
    avatarUrl: user.image || user.avatar_url || '',
  } : null;

  // If we have a valid Auth.js session but no user data, try to get it from sessionStorage
  useEffect(() => {
    if (authJsAuthenticated && !userData) {
      // Check if we have a valid session flag
      const hasValidSession = sessionStorage.getItem('auth_session_valid') === 'true';

      if (hasValidSession) {
        // Try to get the session data from AuthJsClient
        const getSessionData = async () => {
          const session = await AuthJsClient.getSession();
          if (session && session.user) {
            console.log('[ToolpadAccountComponent] Got session data from AuthJsClient:', session);
          }
        };

        getSessionData();
      }
    }
  }, [authJsAuthenticated, userData]);

  return (
    <AppProvider branding={branding}>
      <Account
        user={userData}
        signIn={handleSignIn}
        signOut={handleSignOut}
        loading={loading}
        variant={variant}
        slotProps={{
          signInButton: {
            color: 'primary',
            variant: 'contained',
            size: 'medium',
            fullWidth: true,
            sx: {
              py: 1,
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: 1,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.2s ease-in-out'
            }
          },
          signOutButton: {
            color: 'primary',
            startIcon: <Logout />,
            variant: 'outlined',
            size: 'small',
            sx: {
              mt: 1,
              textTransform: 'none'
            }
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
                sx: {
                  width: 40,
                  height: 40,
                  border: '2px solid',
                  borderColor: 'primary.main'
                }
              },
              userInfo: {
                sx: {
                  textAlign: 'center'
                }
              },
              signInButton: {
                color: 'primary',
                variant: 'contained',
                size: 'small',
                sx: {
                  textTransform: 'none',
                  borderRadius: 1,
                  boxShadow: 1,
                  '&:hover': {
                    boxShadow: 2
                  }
                }
              }
            },
          },
        }}
      />
    </AppProvider>
  );
};

ToolpadAccountComponent.propTypes = {
  variant: PropTypes.string,
};

export default ToolpadAccountComponent;
