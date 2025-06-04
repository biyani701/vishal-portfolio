import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppProvider } from '@toolpad/core/AppProvider';
import { Account } from '@toolpad/core/Account';
import { 
  Typography, 
  Box, 
  CircularProgress, 
  useTheme,
  Button 
} from '@mui/material';
import { Login, Logout } from '@mui/icons-material';
import { useAuthContext } from '../../../context/AuthProvider';

import config from '../../../config';
import PropTypes from "prop-types";
import AuthJsClient from '../AuthJsClient';
/**
 * ToolpadAccountComponent
 * Uses the @toolpad/core Account component to provide a sign-in/sign-out experience
 * that connects to the my-auth-backend server
 */
const ToolpadAccountComponent = ({ variant = 'default' }) => {
  // const { user, isAuthenticated } = useAuthContext();
  const { 
      isAuthenticated, 
      user, 
      loading, 
      signOut 
    } = useAuthContext();
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
            console.log('[ToolpadAccountComponent] Got Auth.js user data:', session.user);
            setAuthJsUser(session.user);
          }
        } else {
          setAuthJsUser(null);
        }
      } catch (error) {
        console.error('[ToolpadAccountComponent] Error checking Auth.js authentication:', error);
        setAuthJsAuthenticated(false);
        setAuthJsUser(null);
      }
    };

    checkAuthJsAuthentication();

    // Set up an interval to periodically check authentication status
    const intervalId = setInterval(checkAuthJsAuthentication, 10000); // Check every 10 seconds

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
  // Prioritize Auth.js user data if available, fallback to context user data
  const currentUser = authJsUser || user;
  const userData = (isAuthenticated || authJsAuthenticated) && currentUser ? {
    id: currentUser.id || currentUser.sub,
    name: currentUser.name || currentUser.login || 'User',
    email: currentUser.email || '',
    avatarUrl: currentUser.image || currentUser.avatar_url || '',
  } : null;

  // Debug logging
  console.log('[ToolpadAccountComponent] Authentication state:', {
    isAuthenticated,
    authJsAuthenticated,
    hasContextUser: !!user,
    hasAuthJsUser: !!authJsUser,
    userData
  });



  // Debug: Log what we're passing to the Account component
  console.log('[ToolpadAccountComponent] Rendering with:', {
    userData,
    variant,
    loading,
    isAuthenticated,
    authJsAuthenticated
  });

  return (
    <AppProvider branding={branding}>
      <Account
        user={userData}
        signIn={handleSignIn}
        signOut={handleSignOut}
        loading={loading}
        variant={variant}
      />
    </AppProvider>
  );
};

ToolpadAccountComponent.propTypes = {
  variant: PropTypes.string,
};

export default ToolpadAccountComponent;
