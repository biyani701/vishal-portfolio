/**
 * Utility functions for tracking analytics
 */

// Get the analytics API URL from runtime config or environment
const getAnalyticsApiUrl = () => {
  // In production, this should be the deployed Vercel API URL
  // In development, it can be a local URL

  // Force the API URL to be http://localhost:7000/api for local development
  // This is a temporary fix until we figure out why the runtime config isn't being loaded correctly
  const apiUrl = 'http://localhost:7000/api';

  console.log('[Analytics] Using API URL:', apiUrl);
  console.log('[Analytics] Runtime config value:', window.runtimeConfig?.ANALYTICS_API_URL);
  return apiUrl;
};

// Check if analytics API is available
const isAnalyticsApiAvailable = () => {
  try {
    // If analytics is explicitly disabled via config, return false
    if (window.runtimeConfig && window.runtimeConfig.DISABLE_ANALYTICS === true) {
      console.log('[Analytics] Analytics explicitly disabled by config');
      return false;
    }

    // With our proxy setup, we should be able to use analytics in any environment
    console.log('[Analytics] Analytics enabled with proxy setup');
    return true;
  } catch (error) {
    console.error('[Analytics] Error checking analytics availability:', error);
    return false;
  }
};

/**
 * Track a click event
 * @param {string} elementId - ID of the clicked element
 * @param {string} elementType - Type of the element (e.g., 'menu', 'button')
 * @param {string} pageUrl - URL of the page where the click occurred
 * @param {string} userId - Optional user ID for authenticated users
 * @returns {Promise} - Promise that resolves when the tracking is complete
 */
export const trackClick = async (elementId, elementType, pageUrl, userId = null) => {
  try {
    // Check if analytics should be disabled
    if (!isAnalyticsApiAvailable()) {
      console.log(`[Analytics] Tracking disabled for: ${elementId} (${elementType})`);
      return Promise.resolve({ success: false, reason: 'analytics_disabled' });
    }

    const apiUrl = `${getAnalyticsApiUrl()}/track`;
    console.log(`[Analytics] Tracking click: ${elementId} (${elementType}) on ${pageUrl}`);
    console.log(`[Analytics] Sending request to: ${apiUrl}`);

    // Don't block the UI with tracking
    const trackingPromise = fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        elementId,
        elementType,
        pageUrl,
        userId
      }),
    }).catch(error => {
      // Catch network errors here to prevent them from bubbling up
      console.error('[Analytics] Network error during tracking:', error);
      return { ok: false, status: 0, statusText: error.message || 'Network Error' };
    });

    // Handle the response in the background without consuming the response body
    // This allows the caller to also read the response if needed
    trackingPromise
      .then(response => {
        if (!response.ok) {
          console.error('[Analytics] Tracking failed:', response.status, response.statusText);
          // Don't try to read the response body here, just log the status
        } else {
          console.log('[Analytics] Tracking successful (status):', response.status);
        }
      })
      .catch(error => {
        console.error('[Analytics] Tracking error:', error);
      });

    // Return a promise that resolves to a more useful result
    return trackingPromise.then(async response => {
      if (!response.ok) {
        return {
          success: false,
          status: response.status,
          statusText: response.statusText,
          error: `Failed with status: ${response.status} ${response.statusText}`
        };
      }

      try {
        // Try to parse the response as JSON
        const data = await response.clone().json();
        return {
          success: true,
          ...data
        };
      } catch (jsonError) {
        // If we can't parse as JSON, return a simple success object
        return {
          success: true,
          message: 'Click tracked successfully'
        };
      }
    }).catch(error => {
      return {
        success: false,
        error: error.message || 'Network error',
        reason: 'network_error'
      };
    });
  } catch (error) {
    console.error('[Analytics] Error tracking click:', error);
    // Don't throw the error to prevent affecting the user experience
    return Promise.resolve({
      success: false,
      reason: 'exception',
      error: error.message || 'Unknown error'
    });
  }
};

/**
 * Get click statistics
 * @param {string} elementType - Optional filter by element type
 * @returns {Promise<Array>} - Promise that resolves to an array of click statistics
 */
export const getClickStats = async (elementType = null) => {
  try {
    // Check if analytics should be disabled
    if (!isAnalyticsApiAvailable()) {
      console.log('[Analytics] Stats retrieval disabled');
      return Promise.resolve([]);
    }

    const apiUrl = `${getAnalyticsApiUrl()}/stats${elementType ? `?elementType=${elementType}` : ''}`;
    console.log(`[Analytics] Fetching click stats${elementType ? ` for type: ${elementType}` : ''}`);

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`[Analytics] Failed to get click stats: ${response.status} ${response.statusText}`);
        try {
          const errorText = await response.text();
          console.error(`[Analytics] Error response:`, errorText);
        } catch (textError) {
          console.error('[Analytics] Could not read error response text');
        }
        // Return empty array instead of throwing
        return [];
      }

      const data = await response.json();
      console.log('[Analytics] Retrieved stats:', data.stats);
      return data.stats || [];
    } catch (fetchError) {
      console.error('[Analytics] Network error getting click stats:', fetchError);
      return [];
    }
  } catch (error) {
    console.error('[Analytics] Error getting click stats:', error);
    // Return empty array instead of throwing
    return [];
  }
};

/**
 * Get user role
 * @param {string} userId - User ID
 * @returns {Promise<string|null>} - Promise that resolves to the user's role or null
 */
export const getUserRole = async (userId) => {
  if (!userId) return null;

  try {
    // Check if analytics should be disabled
    if (!isAnalyticsApiAvailable()) {
      console.log('[Analytics] User role retrieval disabled');
      return null;
    }

    const apiUrl = `${getAnalyticsApiUrl()}/user/role?userId=${encodeURIComponent(userId)}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`[Analytics] Failed to get user role: ${response.status} ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      return data.role;
    } catch (fetchError) {
      console.error('[Analytics] Network error getting user role:', fetchError);
      return null;
    }
  } catch (error) {
    console.error('[Analytics] Error getting user role:', error);
    return null;
  }
};
