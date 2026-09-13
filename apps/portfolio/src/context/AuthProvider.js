// src/context/AuthProvider.js
import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import PropTypes from 'prop-types';

// Create the authentication context
const AuthContext = createContext(null);

/**
 * Provider component for authentication
 * Makes authentication state and functions available to all child components
 */
export function AuthProvider({ children }) {
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook to use the authentication context
 * @returns {Object} Authentication state and functions
 */
export function useAuthContext() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
}

export default AuthProvider;
