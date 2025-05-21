// build-prod.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load environment variables from .env.local for local development
// In GitHub Actions, these will come from GitHub repository variables
if (process.env.NODE_ENV !== 'production' && !process.env.GITHUB_ACTIONS) {
  console.log('Loading environment variables from .env.local for local development');
  require('dotenv').config({ path: '.env.local' });
} else {
  console.log('Using environment variables from GitHub repository variables');
}

// Get the Auth server URL from environment or use default
const AUTH_SERVER_URL = process.env.REACT_APP_AUTH_SERVER_URL || 'https://my-next-auth-app-ten.vercel.app';

console.log(`Building with Auth server URL: ${AUTH_SERVER_URL}`);

// Run the build command
try {
  execSync('npm run build', {
    env: {
      ...process.env,
      REACT_APP_AUTH_SERVER_URL: AUTH_SERVER_URL
    },
    stdio: 'inherit'
  });
  console.log('Build completed successfully');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

// Create runtime config files in the build directory with all environment variables
const runtimeConfig = {
  // Auth server configuration
  AUTH_SERVER_URL,
  CLIENT_ID: 'portfolio',

  // Client URL (your React app on GitHub Pages)
  CLIENT_URL: process.env.REACT_APP_CLIENT_URL || window.location.origin,

  // OAuth Client IDs
  GITHUB_CLIENT_ID: process.env.REACT_APP_GITHUB_CLIENT_ID,
  GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,

  // Legacy URLs (for backward compatibility)
  REDIRECT_URI: process.env.REACT_APP_REDIRECT_URI,
  TOKEN_PROXY_URL: process.env.REACT_APP_TOKEN_PROXY_URL,
  AUTH_URL: process.env.REACT_APP_AUTH_URL
};

// Create JSON file for dynamic loading
const configJson = JSON.stringify(runtimeConfig, null, 2);
fs.writeFileSync(path.join('build', 'runtime-config.json'), configJson);
console.log('Runtime config created in build/runtime-config.json');

// Also update the public/runtime-config.json to ensure it has the correct values
// This prevents the build process from copying an outdated version to the build directory
fs.writeFileSync(path.join('public', 'runtime-config.json'), configJson);
console.log('Updated public/runtime-config.json with correct values');

// Create JS file for direct inclusion
const configJs = `// Runtime configuration for Auth.js
window.runtimeConfig = ${JSON.stringify(runtimeConfig, null, 2)};
console.log('[Runtime Config] Loaded with AUTH_SERVER_URL:', window.runtimeConfig.AUTH_SERVER_URL);`;
fs.writeFileSync(path.join('build', 'runtime-config.js'), configJs);
console.log('Runtime config JS created in build/runtime-config.js');
