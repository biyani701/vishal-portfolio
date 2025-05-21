// public/runtime-config.js
// This script loads runtime configuration that can be updated after the app is built
// Useful for changing environment variables without rebuilding the app

// Initialize with empty values - these MUST be provided by runtime-config.json
window.runtimeConfig = {
  // Environment indicator - will be set by runtime-config.json
  ENVIRONMENT: null,

  // No default values - these will be set by runtime-config.json
  AUTH_SERVER_URL: null,

  // Client ID for the portfolio application
  CLIENT_ID: 'portfolio'
};

// Function to validate configuration after loading
window.validateRuntimeConfig = function() {
  // Mark that validation has been performed
  window.runtimeConfigValidated = true;

  // Required keys that must be present
  const requiredKeys = ['AUTH_SERVER_URL', 'ENVIRONMENT'];
  const missingKeys = requiredKeys.filter(key => !window.runtimeConfig[key]);

  // Check for missing keys
  if (missingKeys.length > 0) {
    console.error(`[Runtime Config] ERROR: Missing required configuration keys: ${missingKeys.join(', ')}`);
    console.error('[Runtime Config] Authentication will not work correctly without these values.');

    // Add a visible error message to the page for administrators
    if (document.body) {
      const errorDiv = document.createElement('div');
      errorDiv.style.position = 'fixed';
      errorDiv.style.bottom = '0';
      errorDiv.style.left = '0';
      errorDiv.style.right = '0';
      errorDiv.style.backgroundColor = '#f44336';
      errorDiv.style.color = 'white';
      errorDiv.style.padding = '10px';
      errorDiv.style.zIndex = '9999';
      errorDiv.style.textAlign = 'center';
      errorDiv.style.fontWeight = 'bold';
      errorDiv.innerHTML = `Configuration Error: Missing ${missingKeys.join(', ')}. Authentication will not work correctly.`;
      document.body.appendChild(errorDiv);
    }

    return false;
  }

  // Validate environment value
  const validEnvironments = ['DEV', 'STAGING', 'PROD'];
  if (!validEnvironments.includes(window.runtimeConfig.ENVIRONMENT)) {
    console.error(`[Runtime Config] ERROR: Invalid ENVIRONMENT value: ${window.runtimeConfig.ENVIRONMENT}`);
    console.error('[Runtime Config] ENVIRONMENT must be one of: DEV, STAGING, PROD');

    // Add a visible warning for invalid environment
    if (document.body) {
      const warningDiv = document.createElement('div');
      warningDiv.style.position = 'fixed';
      warningDiv.style.bottom = '0';
      warningDiv.style.left = '0';
      warningDiv.style.right = '0';
      warningDiv.style.backgroundColor = '#ff9800';
      warningDiv.style.color = 'white';
      warningDiv.style.padding = '10px';
      warningDiv.style.zIndex = '9999';
      warningDiv.style.textAlign = 'center';
      warningDiv.style.fontWeight = 'bold';
      warningDiv.innerHTML = `Configuration Warning: Invalid ENVIRONMENT value: ${window.runtimeConfig.ENVIRONMENT}. Must be DEV, STAGING, or PROD.`;
      document.body.appendChild(warningDiv);
    }

    return false;
  }

  // Log the environment for debugging
  console.log(`[Runtime Config] Running in ${window.runtimeConfig.ENVIRONMENT} environment`);

  return true;
};

// Function to load runtime configuration
(function loadRuntimeConfig() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/runtime-config.json', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          const config = JSON.parse(xhr.responseText);
          window.runtimeConfig = { ...window.runtimeConfig, ...config };
          console.log('[Runtime Config] Loaded:', window.runtimeConfig);

          // Validate the configuration after loading
          const isValid = window.validateRuntimeConfig();
          if (isValid) {
            console.log('[Runtime Config] Validation successful');
          } else {
            console.error('[Runtime Config] Validation failed - check required values');
          }
        } catch (e) {
          console.error('[Runtime Config] Error parsing runtime-config.json:', e);
          window.validateRuntimeConfig(); // Still validate with default values
        }
      } else {
        console.error('[Runtime Config] ERROR: Could not load runtime-config.json. Authentication will not work correctly.');
        window.validateRuntimeConfig(); // Still validate with default values
      }
    }
  };
  xhr.send();

  // Set a timeout to validate configuration even if the XHR request fails
  setTimeout(() => {
    if (!window.runtimeConfigValidated) {
      console.warn('[Runtime Config] Timeout reached without validation. Validating now...');
      window.validateRuntimeConfig();
    }
  }, 5000);
})();
