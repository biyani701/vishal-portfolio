// src/setupProxy.ts
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Express, Request, Response, NextFunction } from 'express';

// This module is used by Create React App development server
// It's not used in production builds
module.exports = function(app: Express): void {
  // Get the Auth.js server URL from environment variable or use a default for development
  const port = process.env.PORT || '4000';
  const AUTH_SERVER_URL = process.env.REACT_APP_AUTH_SERVER_URL || `http://localhost:${port}`;

  console.log(`[Proxy] Using Auth server URL: ${AUTH_SERVER_URL}`);

  // Common proxy options
  const commonOptions = {
    target: AUTH_SERVER_URL,
    changeOrigin: true,
    secure: false, // Don't verify SSL certificates
    logLevel: 'debug',
    cookieDomainRewrite: { '*': '' }, // Remove domain from cookies
    onProxyReq: (proxyReq: { setHeader: (name: string, value: string) => void }, req: Request) => {
      // Add origin header for the auth server to identify the client
      const host = req.headers.host || 'localhost';
      const origin = req.headers.origin || `http://${host}`;
      proxyReq.setHeader('X-Forwarded-Host', host);
      proxyReq.setHeader('X-Client-Origin', origin);
      proxyReq.setHeader('Origin', origin);

      // Log the request for debugging
      console.log(`[Proxy] Proxying ${req.method} ${req.url} to ${AUTH_SERVER_URL}${req.url}`);
      console.log(`[Proxy] Headers:`, {
        origin,
        host: req.headers.host,
        referer: req.headers.referer
      });
    },
    onProxyRes: (proxyRes: {
      statusCode: number;
      headers: Record<string, string | string[]>;
    }, req: Request) => {
      // Log the response for debugging
      console.log(`[Proxy] Received ${proxyRes.statusCode} for ${req.method} ${req.url}`);

      // Add CORS headers to the response
      const host = req.headers.host || 'localhost';
      const origin = req.headers.origin || `http://${host}`;
      proxyRes.headers['access-control-allow-origin'] = origin;
      proxyRes.headers['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      proxyRes.headers['access-control-allow-headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
      proxyRes.headers['access-control-allow-credentials'] = 'true';

      // Handle cookies properly
      if (proxyRes.headers['set-cookie']) {
        const cookies = proxyRes.headers['set-cookie'];
        // Ensure cookies work across domains
        if (Array.isArray(cookies)) {
          const modifiedCookies = cookies.map((cookie: string) => {
            return cookie
              .replace(/Domain=[^;]+;/i, '')
              .replace(/SameSite=[^;]+;/i, 'SameSite=Lax;');
          });
          proxyRes.headers['set-cookie'] = modifiedCookies;
          console.log('[Proxy] Modified cookies:', modifiedCookies);
        }
      }
    },
    onError: (err: Error, _req: Request, res: Response) => {
      console.error('[Proxy] Error:', err);
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end(`Proxy error: ${err.message}`);
    }
  };

  // Proxy all /api/auth/* requests to the Auth.js server
  app.use('/api/auth', createProxyMiddleware({
    ...commonOptions,
    pathRewrite: undefined // No path rewriting for /api/auth
  }));

  // Also proxy the /auth/* path for compatibility
  app.use('/auth', createProxyMiddleware({
    ...commonOptions,
    pathRewrite: {
      '^/auth': '/api/auth', // Rewrite /auth to /api/auth
    }
  }));

  // Handle preflight OPTIONS requests
  app.use('/api/auth', (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
      const host = req.headers.host || 'localhost';
      const origin = req.headers.origin || `http://${host}`;
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.status(200).end();
      return;
    }
    next();
  });
};
