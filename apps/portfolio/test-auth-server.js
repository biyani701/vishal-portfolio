// test-auth-server.js
// A simple script to test the Auth.js server

const fetch = require('node-fetch');

// Auth server URL
const AUTH_SERVER_URL = process.env.REACT_APP_AUTH_SERVER_URL || 'http://localhost:4000';

// Endpoints to test
const endpoints = [
  '/',
  '/api',
  '/api/auth',
  '/api/auth/providers',
  '/api/auth/session',
  '/api/auth/csrf'
];

// Test each endpoint
async function testEndpoints() {
  console.log(`Testing Auth.js server at ${AUTH_SERVER_URL}...\n`);

  for (const endpoint of endpoints) {
    const url = `${AUTH_SERVER_URL}${endpoint}`;
    console.log(`Testing endpoint: ${url}`);

    try {
      const startTime = Date.now();
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Auth.js Test Script'
        }
      });
      const endTime = Date.now();

      console.log(`  Status: ${response.status} ${response.statusText}`);
      console.log(`  Time: ${endTime - startTime}ms`);
      
      // Log headers
      console.log('  Headers:');
      response.headers.forEach((value, name) => {
        console.log(`    ${name}: ${value}`);
      });

      // Try to parse response as JSON
      try {
        const text = await response.text();
        console.log(`  Response: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
        
        if (text && text.trim() && text.trim()[0] === '{') {
          const json = JSON.parse(text);
          console.log('  Parsed JSON:', json);
        }
      } catch (error) {
        console.log(`  Error parsing response: ${error.message}`);
      }
    } catch (error) {
      console.error(`  Error: ${error.message}`);
    }

    console.log(''); // Empty line for readability
  }
}

// Run the tests
testEndpoints().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});
