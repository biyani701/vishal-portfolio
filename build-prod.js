// build-prod.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Determine environment: DEV, STAGING, or PROD
const ENVIRONMENT = process.env.ENVIRONMENT || 'DEV';
console.log(`Building for environment: ${ENVIRONMENT}`);

// Load environment variables based on environment
if (ENVIRONMENT === 'DEV') {
  console.log('Loading environment variables from .env.local for development');
  require('dotenv').config({ path: '.env.local' });
} else if (ENVIRONMENT === 'STAGING' || ENVIRONMENT === 'PROD') {
  console.log(`Using environment variables from GitHub repository variables for ${ENVIRONMENT}`);
  // These should be set in the GitHub repository
} else {
  console.error(`Invalid ENVIRONMENT value: ${ENVIRONMENT}. Must be DEV, STAGING, or PROD.`);
  process.exit(1);
}

// Validate required environment variables
const requiredVars = ['REACT_APP_AUTH_SERVER_URL'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`Error: Missing required environment variables: ${missingVars.join(', ')}`);
  console.error(`Make sure these are defined in .env.local (for DEV) or GitHub repository variables (for STAGING/PROD)`);
  process.exit(1);
}

// Get the Auth server URL from environment (no default fallback)
const AUTH_SERVER_URL = process.env.REACT_APP_AUTH_SERVER_URL;

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
  // Environment indicator
  ENVIRONMENT,

  // Auth server configuration - required
  AUTH_SERVER_URL,
  CLIENT_ID: process.env.REACT_APP_CLIENT_ID || 'portfolio',

  // Client URL (your React app on GitHub Pages)
  CLIENT_URL: process.env.REACT_APP_CLIENT_URL,

  // OAuth Client IDs
  GITHUB_CLIENT_ID: process.env.REACT_APP_GITHUB_CLIENT_ID,
  GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,

  // Legacy URLs (for backward compatibility)
  REDIRECT_URI: process.env.REACT_APP_REDIRECT_URI,
  TOKEN_PROXY_URL: process.env.REACT_APP_TOKEN_PROXY_URL,
  AUTH_URL: process.env.REACT_APP_AUTH_URL,

  // Build timestamp for debugging
  BUILD_TIMESTAMP: new Date().toISOString(),
  BUILD_VERSION: process.env.npm_package_version || '0.0.0'
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
