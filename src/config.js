// Get the environment from runtime config
const ENVIRONMENT = (window.runtimeConfig && window.runtimeConfig.ENVIRONMENT) || 'DEV';
console.log(`[Config] Running in ${ENVIRONMENT} environment`);

// Auth.js server URL - use runtime config or environment variable, with no default fallback
// This ensures we don't silently use incorrect values
const AUTH_SERVER_URL = (window.runtimeConfig && window.runtimeConfig.AUTH_SERVER_URL) ||
                        process.env.REACT_APP_AUTH_SERVER_URL;

// Check if AUTH_SERVER_URL is defined
if (!AUTH_SERVER_URL) {
  console.error('[Config] ERROR: AUTH_SERVER_URL is not defined in runtime config or environment variables');
  // Log a visible error to help with debugging
  if (typeof document !== 'undefined') {
    console.error('[Config] Authentication will not work correctly without a valid AUTH_SERVER_URL');
  }
}

// Use different auth server URLs based on environment
let effectiveAuthServerUrl = AUTH_SERVER_URL;
if (ENVIRONMENT === 'DEV' && !effectiveAuthServerUrl) {
  console.warn('[Config] Using localhost:3000 as fallback for DEV environment only');
  effectiveAuthServerUrl = 'http://localhost:3000';
} else if (!effectiveAuthServerUrl) {
  console.error('[Config] No AUTH_SERVER_URL available for ' + ENVIRONMENT + ' environment');
}

console.log('[Config] Using Auth server URL:', effectiveAuthServerUrl);

const config = {
  // Environment information
  environment: ENVIRONMENT,

  // Auth.js endpoints
  auth: {
    // Base URL for Auth.js server
    serverUrl: effectiveAuthServerUrl,
    // Session endpoint to get current user
    sessionUrl: `${effectiveAuthServerUrl}/api/auth/session`,
    // Callback URL for the client app (your GitHub Pages URL in production)
    callbackUrl: (window.runtimeConfig && window.runtimeConfig.CLIENT_URL) ||
                 process.env.REACT_APP_CLIENT_URL ||
                 window.location.origin,
  },
  // GitHub OAuth configuration
  github: {
    clientId: (window.runtimeConfig && window.runtimeConfig.GITHUB_CLIENT_ID) ||
              process.env.REACT_APP_GITHUB_CLIENT_ID?.trim(),
    // Auth.js sign-in endpoint for GitHub
    signInUrl: `${effectiveAuthServerUrl}/api/auth/signin/github`,
    // For backward compatibility
    redirectUri: (window.runtimeConfig && window.runtimeConfig.REDIRECT_URI) ||
                 process.env.REACT_APP_REDIRECT_URI?.trim(),
    tokenProxyUrl: (window.runtimeConfig && window.runtimeConfig.TOKEN_PROXY_URL) ||
                   process.env.REACT_APP_TOKEN_PROXY_URL?.trim(),
  },
  // Google OAuth configuration
  google: {
    clientId: (window.runtimeConfig && window.runtimeConfig.GOOGLE_CLIENT_ID) ||
              process.env.REACT_APP_GOOGLE_CLIENT_ID?.trim() ||
              process.env.REACT_APP_GITHUB_CLIENT_ID?.trim(),
    // Auth.js sign-in endpoint for Google
    signInUrl: `${effectiveAuthServerUrl}/api/auth/signin/google`,
    // Auth.js callback endpoint for Google
    callbackUrl: `${effectiveAuthServerUrl}/api/auth/callback/google`,
    // Auth.js session endpoint
    userApiUrl: `${effectiveAuthServerUrl}/api/auth/session`,
    // For backward compatibility
    redirectUri: (window.runtimeConfig && window.runtimeConfig.REDIRECT_URI) ||
                 process.env.REACT_APP_REDIRECT_URI?.trim(),
    tokenProxyUrl: (window.runtimeConfig && window.runtimeConfig.TOKEN_PROXY_URL) ||
                   process.env.REACT_APP_TOKEN_PROXY_URL?.trim(),
    authUrl: (window.runtimeConfig && window.runtimeConfig.AUTH_URL) ||
             process.env.REACT_APP_AUTH_URL?.trim() ||
             `${effectiveAuthServerUrl}/api/auth/signin/google`,
  }
};
console.log('ENV:', {
  clientId: process.env.REACT_APP_GITHUB_CLIENT_ID,
  redirectUri: process.env.REACT_APP_REDIRECT_URI,
  tokenProxyUrl: process.env.REACT_APP_TOKEN_PROXY_URL,
});

// For debugging - show the trimmed values
console.log('TRIMMED ENV:', {
  clientId: config.github.clientId,
  redirectUri: config.github.redirectUri,
  tokenProxyUrl: config.github.tokenProxyUrl,
});


export default config;