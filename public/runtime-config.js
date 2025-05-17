// public/runtime-config.js
// This script loads runtime configuration that can be updated after the app is built
// Useful for changing environment variables without rebuilding the app

window.runtimeConfig = {
  // Default values (will be overridden by runtime-config.json if available)
  AUTH_SERVER_URL: window.location.hostname === 'localhost'
    ? `http://localhost:${window.location.hostname === 'localhost' ? '4000' : window.location.port}`
    : window.location.origin
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
        } catch (e) {
          console.error('[Runtime Config] Error parsing runtime-config.json:', e);
        }
      } else {
        console.warn('[Runtime Config] Could not load runtime-config.json, using defaults');
      }
    }
  };
  xhr.send();
})();
