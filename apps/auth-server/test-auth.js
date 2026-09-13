// Simple script to test the authentication flow
// Using dynamic import for node-fetch
import('node-fetch').then(({ default: fetch }) => testAuth(fetch));

async function testAuth(fetch) {
  try {
    console.log('Testing authentication endpoints...');

    // Define all providers to test
    const providers = ['google', 'github', 'facebook', 'linkedin', 'auth0'];

    // Test each provider
    for (const provider of providers) {
      const signinUrl = `http://localhost:4000/api/auth/signin/${provider}`;
      console.log(`\nTesting signin endpoint for ${provider}: ${signinUrl}`);

      const signinResponse = await fetch(signinUrl, {
        method: 'GET',
        headers: {
          'Origin': 'http://localhost:3000',
          'Accept': 'application/json',
        },
      });

      console.log(`${provider} signin response status:`, signinResponse.status);
      console.log(`${provider} signin response headers:`, Object.fromEntries(signinResponse.headers.entries()));

      // Test the CORS preflight for the signin endpoint
      console.log(`\nTesting CORS preflight for ${provider} signin endpoint...`);
      const preflightResponse = await fetch(signinUrl, {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type, X-CSRF-Token',
        },
      });

      console.log(`${provider} preflight response status:`, preflightResponse.status);
      console.log(`${provider} preflight response headers:`, Object.fromEntries(preflightResponse.headers.entries()));
    }

    // Test session endpoint
    const sessionUrl = 'http://localhost:4002/api/auth/session';
    console.log(`\nTesting session endpoint: ${sessionUrl}`);

    const sessionResponse = await fetch(sessionUrl, {
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:3000',
        'Accept': 'application/json',
      },
    });

    console.log('Session response status:', sessionResponse.status);
    console.log('Session response headers:', Object.fromEntries(sessionResponse.headers.entries()));

    console.log('\nTests completed.');
  } catch (error) {
    console.error('Error during tests:', error);
  }
}
