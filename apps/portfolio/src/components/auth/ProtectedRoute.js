import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthProvider';
import { Box, CircularProgress, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import AuthJsClient from './AuthJsClient';
import PropTypes from "prop-types";

/**
 * ProtectedRoute component that redirects to the sign-in page if the user is not authenticated
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {boolean} props.requireAuth - Whether authentication is required (default: true)
 * @returns {React.ReactNode} - The protected route component
 */
const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading } = useAuthContext();
  const [authJsAuthenticated, setAuthJsAuthenticated] = useState(false);
  const location = useLocation();

  // Check if we have a valid session from Auth.js
  useEffect(() => {
    const checkAuthJsAuthentication = async () => {
      const isAuthJsAuthenticated = await AuthJsClient.isAuthenticated();
      setAuthJsAuthenticated(isAuthJsAuthenticated);
    };

    checkAuthJsAuthentication();
  }, []);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body1">Checking authentication...</Typography>
      </Box>
    );
  }

  // If authentication is required and user is not authenticated, redirect to sign-in
  if (requireAuth && !(isAuthenticated || authJsAuthenticated)) {
    // Pass the current location to the sign-in page so we can redirect back after login
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Create a wrapper component that adds the lock icon
  const ProtectedContent = () => {
    return (
      <Box sx={{ position: 'relative' }}>
        {children}
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            zIndex: 1000,
            backgroundColor: (isAuthenticated || authJsAuthenticated) ? 'success.light' : 'warning.light',
            borderRadius: '50%',
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 2,
            opacity: 0.9,
          }}
        >
          <FontAwesomeIcon
            icon={(isAuthenticated || authJsAuthenticated) ? faLockOpen : faLock}
            size="sm"
            style={{ color: '#fff' }}
          />
        </Box>
      </Box>
    );
  };

  // If we have a child component with its own authentication status indicator,
  // add lock/unlock icon to it
  const childrenWithAuthStatus = React.Children.map(children, child => {
    // Only add props to valid elements
    if (React.isValidElement(child)) {
      const isAuth = isAuthenticated || authJsAuthenticated;
      return React.cloneElement(child, {
        authStatus: {
          isAuthenticated: isAuth,
          icon: isAuth ? faLockOpen : faLock,
        },
      });
    }
    return child;
  });

  // If authenticated or auth not required, render the children with lock icon
  return <ProtectedContent>{childrenWithAuthStatus || children}</ProtectedContent>;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
  requireAuth: PropTypes.bool,
};

export default ProtectedRoute;
