// Type declarations for modules without TypeScript definitions

/**
 * This file provides type definitions for the development server proxy middleware.
 * These types are only used during development and not in production.
 */

declare module 'http-proxy-middleware' {
  // Import our own Express types
  import { Request, Response, NextFunction } from 'express';

  export interface ProxyRequestObject {
    setHeader(name: string, value: string): void;
    [key: string]: unknown;
  }

  export interface ProxyResponseObject {
    statusCode: number;
    headers: Record<string, string | string[]>;
    [key: string]: unknown;
  }

  export interface ProxyOptions {
    target: string;
    changeOrigin?: boolean;
    secure?: boolean;
    logLevel?: string;
    cookieDomainRewrite?: Record<string, string> | string;
    pathRewrite?: Record<string, string> | undefined;
    onProxyReq?: (proxyReq: ProxyRequestObject, req: Request) => void;
    onProxyRes?: (proxyRes: ProxyResponseObject, req: Request) => void;
    onError?: (err: Error, req: Request, res: Response) => void;
    [key: string]: unknown;
  }

  export type RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;

  export function createProxyMiddleware(options: ProxyOptions): RequestHandler;
  export function createProxyMiddleware(
    filter: string | string[] | ((pathname: string, req: Request) => boolean),
    options: ProxyOptions
  ): RequestHandler;
}

// Express types for development server
declare module 'express' {
  // Define our own types for Express to avoid conflicts with Next.js types
  export interface Request {
    method: string;
    url: string;
    headers: {
      origin?: string;
      host?: string;
      referer?: string;
      [key: string]: string | string[] | undefined;
    };
    [key: string]: unknown;
  }

  export interface Response {
    writeHead(statusCode: number, headers: Record<string, string>): void;
    header(name: string, value: string): void;
    status(code: number): Response;
    end(data?: string): void;
    [key: string]: unknown;
  }

  export type NextFunction = (err?: Error) => void;

  export interface Express {
    use(path: string, handler: (req: Request, res: Response, next: NextFunction) => void): void;
  }

  export type RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;
}
