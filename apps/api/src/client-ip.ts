/** The visitor's IP. Vercel sets both headers itself, overwriting anything the client sent. */
export const clientIp = (headers: Headers) => headers.get('x-real-ip') ?? headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
