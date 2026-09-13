// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Get the Auth.js server URL from environment variable or use a default for development
  const AUTH_SERVER_URL = process.env.REACT_APP_AUTH_SERVER_URL || 'http://localhost:3000';
  // Analytics API URL
  const ANALYTICS_API_URL = 'https://click-tracker-five.vercel.app';

  console.log(`[Proxy] Using Auth server URL: ${AUTH_SERVER_URL}`);
  console.log(`[Proxy] Using Analytics API URL: ${ANALYTICS_API_URL}`);

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
      console.log(`[Auth Proxy] Proxying ${req.method} ${req.url} to ${AUTH_SERVER_URL}${req.url}`);
      console.log(`[Auth Proxy] Headers:`, proxyReq.getHeaders());
    },
    onProxyRes: (proxyRes, req, res) => {
      // Log the response for debugging
      console.log(`[Auth Proxy] Received ${proxyRes.statusCode} for ${req.method} ${req.url}`);

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
        console.log('[Auth Proxy] Modified cookies:', modifiedCookies);
      }
    },
    onError: (err, req, res) => {
      console.error('[Auth Proxy] Error:', err);
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end(`Auth Proxy error: ${err.message}`);
    }
  });

  // Enhanced proxy configuration for Analytics API
  const analyticsProxy = createProxyMiddleware({
    target: ANALYTICS_API_URL,
    changeOrigin: true,
    secure: true, // Set to true for production API
    logLevel: 'debug',
    pathRewrite: {
      // No path rewriting needed as we're using the same paths
    },
    onProxyReq: (proxyReq, req, res) => {
      // Add origin header to help with CORS
      proxyReq.setHeader('origin', 'https://vishal.biyani.xyz');

      // Log the request for debugging
      console.log(`[Analytics Proxy] Proxying ${req.method} ${req.url} to ${ANALYTICS_API_URL}${req.url}`);
      console.log(`[Analytics Proxy] Headers:`, proxyReq.getHeaders());
    },
    onProxyRes: (proxyRes, req, res) => {
      // Log the response for debugging
      console.log(`[Analytics Proxy] Received ${proxyRes.statusCode} for ${req.method} ${req.url}`);

      // Handle CORS headers
      proxyRes.headers['access-control-allow-origin'] = '*';
    },
    onError: (err, req, res) => {
      console.error('[Analytics Proxy] Error:', err);
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end(`Analytics Proxy error: ${err.message}`);
    }
  });

  // Apply the proxy to both /api/auth and /auth paths
  app.use('/api/auth', authProxy);
  app.use('/auth', authProxy);

  // Apply the analytics proxy to /api/track, /api/stats, and /api/user/role paths
  app.use('/api/track', analyticsProxy);
  app.use('/api/stats', analyticsProxy);
  app.use('/api/user/role', analyticsProxy);
};
