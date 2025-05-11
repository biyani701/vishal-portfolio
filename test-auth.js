// Simple script to test the authentication flow
// Using dynamic import for node-fetch
import('node-fetch').then(({ default: fetch }) => testAuth(fetch));

async function testAuth(fetch) {
  try {
    console.log('Testing authentication endpoints...');

    // Test the signin endpoint
    const signinUrl = 'http://localhost:4000/api/auth/signin/google';
    console.log(`Testing signin endpoint: ${signinUrl}`);

    const signinResponse = await fetch(signinUrl, {
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:3000',
        'Accept': 'application/json',
      },
    });

    console.log('Signin response status:', signinResponse.status);
    console.log('Signin response headers:', Object.fromEntries(signinResponse.headers.entries()));

    // Test the CORS preflight for the signin endpoint
    console.log('\nTesting CORS preflight for signin endpoint...');
    const preflightResponse = await fetch(signinUrl, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    });

    console.log('Preflight response status:', preflightResponse.status);
    console.log('Preflight response headers:', Object.fromEntries(preflightResponse.headers.entries()));

    console.log('\nTests completed.');
  } catch (error) {
    console.error('Error during tests:', error);
  }
}
