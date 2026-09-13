// src/api/logout.js

/**
 * Handles logout requests by clearing all authentication data
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export async function handleLogout(req, res) {
  try {
    // Get the callback URL from the query parameters, defaulting to the home page
    const callbackUrl = req.query.callbackUrl || '/';
    
    // Try to clear Auth.js session by making a DELETE request to the session endpoint
    try {
      const authServerUrl = process.env.REACT_APP_AUTH_SERVER_URL || 'http://localhost:4000';
      const response = await fetch(`${authServerUrl}/api/auth/session`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('[API] DELETE session response:', response.status);
    } catch (error) {
      console.error('[API] Error deleting session:', error);
    }
    
    // Clear all cookies in the response
    const cookiesToClear = [
      'next-auth.session-token',
      'next-auth.callback-url',
      'next-auth.csrf-token',
      '__Secure-next-auth.session-token',
      '__Host-next-auth.csrf-token'
    ];
    
    const cookiePaths = ['/', '/api', '/api/auth', '/auth'];
    
    cookiesToClear.forEach(cookieName => {
      cookiePaths.forEach(path => {
        res.clearCookie(cookieName, { path });
      });
    });
    
    // Redirect to the callback URL
    res.redirect(callbackUrl);
  } catch (error) {
    console.error('[API] Error during logout:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
}

/**
 * Client-side function to call the logout API
 * @param {string} callbackUrl - URL to redirect to after logout
 */
export async function logoutClient(callbackUrl = '/') {
  try {
    // Redirect to the logout page with the callback URL
    window.location.href = `/logout?callbackUrl=${encodeURIComponent(callbackUrl)}`;
    return true;
  } catch (error) {
    console.error('[API Client] Error during logout:', error);
    return false;
  }
}
