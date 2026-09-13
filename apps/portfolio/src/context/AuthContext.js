// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [provider, setProvider] = useState(null); // 'github' or 'google'

  useEffect(() => {
    // Check for existing auth on component mount
    const checkAuth = () => {
      try {
        // Check for GitHub auth
        const githubToken = sessionStorage.getItem('github_token');
        const githubUser = sessionStorage.getItem('github_user');

        if (githubToken && githubUser) {
          setToken(githubToken);
          setUser(JSON.parse(githubUser));
          setProvider('github');
          setLoading(false);
          return;
        }

        // Check for Google auth
        const googleToken = sessionStorage.getItem('google_token');
        const googleUser = sessionStorage.getItem('google_user');

        if (googleToken && googleUser) {
          setToken(googleToken);
          setUser(JSON.parse(googleUser));
          setProvider('google');
          setLoading(false);
          return;
        }

        // No auth found
        setLoading(false);
      } catch (error) {
        console.error('Error restoring auth state:', error);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function for GitHub
  const loginWithGitHub = (token, userInfo) => {
    sessionStorage.setItem('github_token', token);
    sessionStorage.setItem('github_user', JSON.stringify(userInfo));
    setToken(token);
    setUser(userInfo);
    setProvider('github');
  };

  // Login function for Google
  const loginWithGoogle = (token, userInfo) => {
    sessionStorage.setItem('google_token', token);
    sessionStorage.setItem('google_user', JSON.stringify(userInfo));
    setToken(token);
    setUser(userInfo);
    setProvider('google');
  };

  // Generic login function that determines provider from user data
  const login = (token, userInfo) => {
    // Determine provider based on user data structure
    if (userInfo.login) {
      // GitHub user has 'login' property
      loginWithGitHub(token, userInfo);
    } else if (userInfo.email) {
      // Google user typically has email
      loginWithGoogle(token, userInfo);
    } else {
      console.error('Unknown auth provider for user:', userInfo);
    }
  };

  // Logout function
  const logout = () => {
    // Clear all auth data
    sessionStorage.removeItem('github_token');
    sessionStorage.removeItem('github_user');
    sessionStorage.removeItem('google_token');
    sessionStorage.removeItem('google_user');
    setUser(null);
    setToken(null);
    setProvider(null);
  };

  // Function to get user's repos (GitHub specific)
  const fetchUserRepos = async () => {
    if (!token || provider !== 'github') return null;

    try {
      const response = await fetch('https://api.github.com/user/repos', {
        headers: {
          Authorization: `token ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch repositories');

      return await response.json();
    } catch (error) {
      console.error('Error fetching repos:', error);
      return null;
    }
  };

  const value = {
    user,
    token,
    provider,
    loading,
    login,
    loginWithGitHub,
    loginWithGoogle,
    logout,
    fetchUserRepos,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};