// src/components/auth/AuthDebugUtils.js
/**
 * Utility functions for debugging Auth.js integration
 */

/**
 * Logs detailed information about the current Auth.js configuration
 * @param {Object} config - The application configuration object
 */
export const logAuthConfiguration = (config) => {
  console.group('[Auth Debug] Configuration');
  console.log('Auth Server URL:', config.auth.serverUrl);
  console.log('Session URL:', config.auth.sessionUrl);
  console.log('Callback URL:', config.auth.callbackUrl);

  console.log('GitHub Config:', {
    clientId: config.github.clientId ? '✓ Present' : '✗ Missing',
    signInUrl: config.github.signInUrl,
    redirectUri: config.github.redirectUri
  });

  console.log('Google Config:', {
    clientId: config.google.clientId ? '✓ Present' : '✗ Missing',
    signInUrl: config.google.signInUrl,
    callbackUrl: config.google.callbackUrl,
    userApiUrl: config.google.userApiUrl
  });
  console.groupEnd();
};

/**
 * Logs information about the current browser environment
 */
export const logBrowserEnvironment = () => {
  console.group('[Auth Debug] Browser Environment');
  console.log('User Agent:', navigator.userAgent);
  console.log('Cookies Enabled:', navigator.cookieEnabled);
  console.log('Current URL:', window.location.href);
  console.log('Origin:', window.location.origin);
  console.log('Pathname:', window.location.pathname);
  console.log('Search:', window.location.search);
  console.log('Hash:', window.location.hash);
  console.groupEnd();
};

/**
 * Logs information about the current cookies
 */
export const logCookies = () => {
  console.group('[Auth Debug] Cookies');
  console.log('All Cookies:', document.cookie);

  // Parse cookies into an object for easier inspection
  const cookiesObj = document.cookie
    .split(';')
    .map(cookie => cookie.trim())
    .reduce((acc, cookie) => {
      const [name, value] = cookie.split('=');
      if (name) acc[name] = value;
      return acc;
    }, {});

  console.log('Parsed Cookies:', cookiesObj);
  console.log('Auth.js Session Cookie Present:', cookiesObj['next-auth.session-token'] ? 'Yes' : 'No');
  console.groupEnd();
};

/**
 * Logs information about the current session storage
 */
export const logSessionStorage = () => {
  console.group('[Auth Debug] Session Storage');

  try {
    const keys = Object.keys(sessionStorage);
    console.log('Session Storage Keys:', keys);

    // Log auth-related items
    const authItems = keys.filter(key =>
      key.includes('auth') ||
      key.includes('token') ||
      key.includes('user') ||
      key.includes('github') ||
      key.includes('google')
    );

    console.log('Auth-related Items:', authItems);

    // Log the values of auth-related items
    authItems.forEach(key => {
      try {
        const value = sessionStorage.getItem(key);
        console.log(`${key}:`, value);
      } catch (e) {
        console.log(`Error reading ${key}:`, e);
      }
    });
  } catch (e) {
    console.error('Error accessing sessionStorage:', e);
  }

  console.groupEnd();
};

/**
 * Logs a complete debug report with all available information
 * @param {Object} config - The application configuration object
 */
export const logCompleteDebugReport = (config) => {
  console.group('[Auth Debug] Complete Debug Report');
  console.log('Timestamp:', new Date().toISOString());

  logAuthConfiguration(config);
  logBrowserEnvironment();
  logCookies();
  logSessionStorage();

  console.groupEnd();
};

/**
 * Attempts to diagnose common Auth.js issues
 * @param {Object} config - The application configuration object
 * @returns {Array} - Array of potential issues and recommendations
 */
export const diagnoseAuthIssues = (config) => {
  const issues = [];

  // Check for missing configuration
  if (!config.auth.serverUrl) {
    issues.push('Auth server URL is missing. Check your .env file for REACT_APP_AUTH_SERVER_URL.');
  }

  if (!config.google.clientId) {
    issues.push('Google client ID is missing. Check your .env file for REACT_APP_GOOGLE_CLIENT_ID.');
  }

  // Check for cookie issues
  if (!navigator.cookieEnabled) {
    issues.push('Cookies are disabled in the browser. Auth.js requires cookies to maintain sessions.');
  }

  // Check for cross-origin issues
  const authServerOrigin = new URL(config.auth.serverUrl).origin;
  const currentOrigin = window.location.origin;

  if (authServerOrigin !== currentOrigin) {
    issues.push(`Cross-origin issue detected: Auth server (${authServerOrigin}) and client (${currentOrigin}) have different origins. This may cause cookie/session problems.`);
  }

  return issues;
};

/**
 * Tests the connection to the Auth.js server
 * @param {Object} config - The application configuration object
 * @returns {Promise<Object>} - The test results
 */
export const testAuthServerConnection = async (config) => {
  const results = {
    timestamp: new Date().toISOString(),
    tests: []
  };

  // Test 1: Basic connectivity to the server
  try {
    console.log('[Auth Debug] Testing basic connectivity to Auth.js server...');
    const response = await fetch(`${config.auth.serverUrl}/api/auth/providers`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      mode: 'cors',
      credentials: 'include'
    });

    results.tests.push({
      name: 'Basic connectivity',
      success: response.ok,
      status: response.status,
      statusText: response.statusText
    });

    if (response.ok) {
      const data = await response.json();
      results.providers = data;
    }
  } catch (error) {
    results.tests.push({
      name: 'Basic connectivity',
      success: false,
      error: error.message
    });
  }

  // Test 2: Session endpoint
  try {
    console.log('[Auth Debug] Testing session endpoint...');
    const response = await fetch(config.auth.sessionUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      mode: 'cors',
      credentials: 'include'
    });

    results.tests.push({
      name: 'Session endpoint',
      success: response.ok,
      status: response.status,
      statusText: response.statusText
    });

    if (response.ok) {
      const data = await response.json();
      results.session = data;
    }
  } catch (error) {
    results.tests.push({
      name: 'Session endpoint',
      success: false,
      error: error.message
    });
  }

  // Test 3: CORS headers
  try {
    console.log('[Auth Debug] Testing CORS headers...');
    const response = await fetch(`${config.auth.serverUrl}/api/auth/csrf`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      mode: 'cors',
      credentials: 'include'
    });

    // Check if CORS headers are present
    const corsHeadersPresent =
      response.headers.get('access-control-allow-origin') !== null &&
      response.headers.get('access-control-allow-credentials') !== null;

    results.tests.push({
      name: 'CORS headers',
      success: corsHeadersPresent,
      headers: {
        'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
        'access-control-allow-credentials': response.headers.get('access-control-allow-credentials')
      }
    });
  } catch (error) {
    results.tests.push({
      name: 'CORS headers',
      success: false,
      error: error.message
    });
  }

  console.log('[Auth Debug] Auth server connection test results:', results);
  return results;
};

export default {
  logAuthConfiguration,
  logBrowserEnvironment,
  logCookies,
  logSessionStorage,
  logCompleteDebugReport,
  diagnoseAuthIssues,
  testAuthServerConnection
};
