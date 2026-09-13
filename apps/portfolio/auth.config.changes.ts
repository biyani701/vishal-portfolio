// Changes to make to auth.config.ts

// Original code:
export const identifyClient = (origin?: string): ClientId => {
  if (!origin) return ClientId.DEFAULT;

  // Map origins to client IDs
  if (origin.includes('client1.com') || origin.includes('localhost:3001')) {
    return ClientId.CLIENT1;
  } else if (origin.includes('client2.com') || origin.includes('localhost:3002')) {
    return ClientId.CLIENT2;
  } else if (origin.includes('vishal.biyani.xyz') || origin.includes('github.io') || origin.includes('localhost:3000')) {
    console.log('portfolio', ClientId.PORTFOLIO);
    return ClientId.PORTFOLIO;
  } else if (origin.includes('my-oauth-proxy.vercel.app')) {
    // Vercel deployment domain
    return ClientId.DEFAULT;
  }

  // Default fallback
  return ClientId.DEFAULT;
};

// Modified code:
export const identifyClient = (origin?: string): ClientId => {
  if (!origin) return ClientId.DEFAULT;

  // Map origins to client IDs
  if (origin.includes('client1.com')) {
    return ClientId.CLIENT1;
  } else if (origin.includes('client2.com') || origin.includes('localhost:3002')) {
    return ClientId.CLIENT2;
  } else if (origin.includes('vishal.biyani.xyz') || origin.includes('github.io') || 
             origin.includes('localhost:3000') || origin.includes('localhost:3001')) {
    console.log('portfolio', ClientId.PORTFOLIO);
    return ClientId.PORTFOLIO;
  } else if (origin.includes('my-oauth-proxy.vercel.app')) {
    // Vercel deployment domain
    return ClientId.DEFAULT;
  }

  // Default fallback
  return ClientId.DEFAULT;
};
