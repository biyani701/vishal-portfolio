// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Get the Auth.js server URL from environment variable or use a default for development
  const AUTH_SERVER_URL = process.env.REACT_APP_AUTH_SERVER_URL || 'http://localhost:3000';

  console.log(`[Proxy] Using Auth server URL: ${AUTH_SERVER_URL}`);

  // Enhanced proxy configuration for Auth.js
  const authProxy = createProxyMiddleware({
    target: AUTH_SERVER_URL,
    changeOrigin: true,
    secure: false, // Set to false for development
    logLevel: 'debug',
    pathRewrite: {
      // No path rewriting needed as we're using the same paths
    },
    onProxyReq: (proxyReq, req, res) => {
      // Add origin header to help with CORS
      proxyReq.setHeader('origin', AUTH_SERVER_URL);

      // Log the request for debugging
      console.log(`[Proxy] Proxying ${req.method} ${req.url} to ${AUTH_SERVER_URL}${req.url}`);
      console.log(`[Proxy] Headers:`, proxyReq.getHeaders());
    },
    onProxyRes: (proxyRes, req, res) => {
      // Log the response for debugging
      console.log(`[Proxy] Received ${proxyRes.statusCode} for ${req.method} ${req.url}`);

      // Handle CORS headers
      proxyRes.headers['access-control-allow-origin'] = '*';

      // Handle cookies properly for cross-domain usage
      if (proxyRes.headers['set-cookie']) {
        const cookies = proxyRes.headers['set-cookie'];
        // Ensure cookies work across domains
        const modifiedCookies = cookies.map(cookie => {
          return cookie
            .replace(/Domain=[^;]+;/i, '')
            .replace(/SameSite=[^;]+;/i, 'SameSite=None; Secure;');
        });
        proxyRes.headers['set-cookie'] = modifiedCookies;
        console.log('[Proxy] Modified cookies:', modifiedCookies);
      }
    },
    onError: (err, req, res) => {
      console.error('[Proxy] Error:', err);
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end(`Proxy error: ${err.message}`);
    }
  });

  // Apply the proxy to both /api/auth and /auth paths
  app.use('/api/auth', authProxy);
  app.use('/auth', authProxy);
};
