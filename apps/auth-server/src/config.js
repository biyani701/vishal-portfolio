// Auth.js server URL - use runtime config, environment variable, or default to localhost during development
const getDefaultAuthServerUrl = () => {
  // In browser environment
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'localhost'
      ? `http://localhost:${process.env.PORT || '4000'}`
      : window.location.origin;
  }
  // In Node.js environment
  return `http://localhost:${process.env.PORT || '4000'}`;
};

console.log('[Config] getDefaultAuthServerUrl:', getDefaultAuthServerUrl());
console.log('[Config] process.env.REACT_APP_AUTH_SERVER_URL:', process.env.REACT_APP_AUTH_SERVER_URL);
const AUTH_SERVER_URL = (window.runtimeConfig && window.runtimeConfig.AUTH_SERVER_URL) ||
                        process.env.REACT_APP_AUTH_SERVER_URL ||
                        getDefaultAuthServerUrl();

console.log('[Config] Using Auth server URL:', AUTH_SERVER_URL);

const config = {
  // Auth.js endpoints
  auth: {
    // Base URL for Auth.js server
    serverUrl: AUTH_SERVER_URL,
    // Session endpoint to get current user
    sessionUrl: `${AUTH_SERVER_URL}/api/auth/session`,
    // Callback URL for the client app (your GitHub Pages URL in production)
    callbackUrl: process.env.REACT_APP_CLIENT_URL || window.location.origin,
  },
  // GitHub OAuth configuration
  github: {
    clientId: process.env.REACT_APP_GITHUB_CLIENT_ID?.trim(),
    // Auth.js sign-in endpoint for GitHub
    signInUrl: `${AUTH_SERVER_URL}/api/auth/signin/github`,
    // For backward compatibility
    redirectUri: process.env.REACT_APP_REDIRECT_URI?.trim(),
    tokenProxyUrl: process.env.REACT_APP_TOKEN_PROXY_URL?.trim(),
  },
  // Google OAuth configuration
  google: {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID?.trim() || process.env.REACT_APP_GITHUB_CLIENT_ID?.trim(),
    // Auth.js sign-in endpoint for Google
    signInUrl: `${AUTH_SERVER_URL}/api/auth/signin/google`,
    // Auth.js callback endpoint for Google
    callbackUrl: `${AUTH_SERVER_URL}/api/auth/callback/google`,
    // Auth.js session endpoint
    userApiUrl: `${AUTH_SERVER_URL}/api/auth/session`,
    // For backward compatibility
    redirectUri: process.env.REACT_APP_REDIRECT_URI?.trim(),
    tokenProxyUrl: process.env.REACT_APP_TOKEN_PROXY_URL?.trim(),
    authUrl: process.env.REACT_APP_AUTH_URL?.trim() || `${AUTH_SERVER_URL}/api/auth/signin/google`,
  }
};

// For debugging - show the configuration
console.log('[Config] Full configuration:', config);

export default config;
