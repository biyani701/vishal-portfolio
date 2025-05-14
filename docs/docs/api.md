---
sidebar_position: 7
---

# API Reference

This page documents the API endpoints and functions available in the Auth.js Multi-Client system.

## API Endpoints

### Authentication Endpoints

<div className="api-method">
  <span className="api-method-badge get">GET</span>
  <span className="api-method-path">/api/auth/signin/:provider</span>
</div>

Initiates the sign-in process with the specified OAuth provider.

**Parameters:**
- `provider` (path parameter): The OAuth provider to use (e.g., `github`, `google`, `facebook`, `linkedin`, `auth0`)
- `callbackUrl` (query parameter): The URL to redirect to after successful authentication

**Example:**
```
GET /api/auth/signin/github?callbackUrl=https://example.com/dashboard
```

<div className="api-method">
  <span className="api-method-badge get">GET</span>
  <span className="api-method-path">/api/auth/callback/:provider</span>
</div>

Handles the callback from the OAuth provider after authentication.

**Parameters:**
- `provider` (path parameter): The OAuth provider that initiated the callback
- `code` (query parameter): The authorization code from the OAuth provider

<div className="api-method">
  <span className="api-method-badge get">GET</span>
  <span className="api-method-path">/api/auth/signout</span>
</div>

Signs out the current user and invalidates their session.

**Parameters:**
- `callbackUrl` (query parameter): The URL to redirect to after signing out

<div className="api-method">
  <span className="api-method-badge get">GET</span>
  <span className="api-method-path">/api/auth/session</span>
</div>

Returns information about the current session.

**Response:**
```json
{
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "https://example.com/avatar.jpg",
    "provider": "github",
    "clientOrigin": "https://example.com",
    "clientId": "portfolio"
  },
  "expires": "2023-12-31T23:59:59.999Z"
}
```

### Error Handling

<div className="api-method">
  <span className="api-method-badge get">GET</span>
  <span className="api-method-path">/api/auth/error</span>
</div>

Displays authentication errors.

**Parameters:**
- `error` (query parameter): The error code or message

## Client-Side Functions

### `signIn(provider, options)`

Initiates the sign-in process with the specified provider.

**Parameters:**
- `provider` (string): The OAuth provider to use (e.g., `'github'`, `'google'`, `'facebook'`, `'linkedin'`, `'auth0'`)
- `options` (object, optional): Additional options
  - `redirectTo` (string, optional): The URL to redirect to after authentication

**Example:**
```javascript
import { signIn } from '@/lib/auth-client';

// Sign in with GitHub
signIn('github', { redirectTo: '/dashboard' });
```

### `signOut(options)`

Signs out the current user.

**Parameters:**
- `options` (object, optional): Additional options
  - `redirectTo` (string, optional): The URL to redirect to after signing out

**Example:**
```javascript
import { signOut } from '@/lib/auth-client';

// Sign out and redirect to home page
signOut({ redirectTo: '/' });
```

### `getSession()`

Gets the current session information.

**Returns:**
- A Promise that resolves to the session object or null if not authenticated

**Example:**
```javascript
import { getSession } from '@/lib/auth-client';

// Get the current session
async function checkAuth() {
  const session = await getSession();
  if (session) {
    console.log('Authenticated as:', session.user.name);
  } else {
    console.log('Not authenticated');
  }
}
```

## Server-Side Functions

### `auth()`

Gets the current session on the server side.

**Returns:**
- A Promise that resolves to the session object or null if not authenticated

**Example:**
```typescript
import { auth } from '@/auth';

// In a server component or API route
async function ServerComponent() {
  const session = await auth();

  if (session) {
    return <div>Hello, {session.user.name}</div>;
  } else {
    return <div>Please sign in</div>;
  }
}
```

### `createAuthConfig(origin)`

Creates an Auth.js configuration based on the client origin.

**Parameters:**
- `origin` (string, optional): The client origin

**Returns:**
- An Auth.js configuration object

**Example:**
```typescript
import { createAuthConfig } from '@/auth.config';

const config = createAuthConfig('https://example.com');
```
