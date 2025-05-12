// Type declarations for modules without TypeScript definitions

declare module 'http-proxy-middleware' {
  import { RequestHandler } from 'express';
  
  export interface ProxyOptions {
    target: string;
    changeOrigin?: boolean;
    secure?: boolean;
    logLevel?: string;
    cookieDomainRewrite?: Record<string, string> | string;
    pathRewrite?: Record<string, string> | undefined;
    onProxyReq?: (proxyReq: any, req: any, res: any) => void;
    onProxyRes?: (proxyRes: any, req: any, res: any) => void;
    onError?: (err: Error, req: any, res: any) => void;
    [key: string]: any;
  }
  
  export function createProxyMiddleware(options: ProxyOptions): RequestHandler;
  export function createProxyMiddleware(filter: string | string[] | ((pathname: string, req: any) => boolean), options: ProxyOptions): RequestHandler;
}

declare module 'express' {
  export interface Request {
    method: string;
    url: string;
    headers: {
      origin?: string;
      host?: string;
      referer?: string;
      [key: string]: string | string[] | undefined;
    };
    [key: string]: any;
  }
  
  export interface Response {
    writeHead(statusCode: number, headers: Record<string, string>): void;
    header(name: string, value: string): void;
    status(code: number): Response;
    end(data?: string): void;
    [key: string]: any;
  }
  
  export interface NextFunction {
    (err?: any): void;
  }
  
  export interface Express {
    use(path: string, handler: RequestHandler): void;
    [key: string]: any;
  }
  
  export interface RequestHandler {
    (req: Request, res: Response, next: NextFunction): void;
  }
}
