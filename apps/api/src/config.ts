import { z } from 'zod'

// Operational configuration (design.md A9; specs/api-service "Configurable limits and retention"). Limits,
// retention and model ids have documented defaults; secrets and addresses are required and come only from the
// environment: the Vercel project env in preview and production, a git-ignored apps/api/.env locally.
// .env.example lists every key. loadConfig runs at start-up (src/index.ts) and throws naming every missing or
// invalid variable, so a misconfigured deployment fails before serving anything.

const required = (message = 'is required') => z.string({ error: message }).trim().min(1, message)
const whole = (fallback: number) => z.coerce.number({ error: 'must be a whole number' }).int('must be a whole number').positive('must be above 0').default(fallback)

export const configSchema = z.object({
  // Limits and retention: configuration, not code.
  CONTACT_RETENTION_DAYS: whole(365),
  CONTACT_RATE_LIMIT_PER_IP_PER_HOUR: whole(5),
  AI_RATE_LIMIT_PER_IP_PER_HOUR: whole(30),
  AI_MAX_OUTPUT_TOKENS: whole(1200),
  AI_DAILY_BUDGET_USD: z.coerce.number({ error: 'must be a number' }).positive('must be above 0').default(2),
  AI_MODEL: z.string().trim().min(1).default('claude-sonnet-5'),
  AI_SUGGESTION_MODEL: z.string().trim().min(1).default('claude-haiku-4-5-20251001'),

  // Email (design.md A10): a verified sender on biyani.xyz, and where notifications go.
  RESEND_API_KEY: required(),
  CONTACT_FROM_EMAIL: required().pipe(z.email('must be an email address')),
  CONTACT_TO_EMAIL: required().pipe(z.email('must be an email address')),

  // Provider credentials, injected by the Vercel Marketplace integrations (Neon, Upstash) or set by the owner.
  ANTHROPIC_API_KEY: required(),
  DATABASE_URL: required().pipe(z.url({ protocol: /^postgres(ql)?$/, error: 'must be a postgres:// URL' })),
  KV_REST_API_URL: required().pipe(z.url({ protocol: /^https$/, error: 'must be an https:// URL' })),
  KV_REST_API_TOKEN: required(),

  // CORS allow-list (src/origins.ts); defaults to the production site.
  ALLOWED_ORIGINS: z.string().optional(),
})

export type Config = z.infer<typeof configSchema>

export class ConfigError extends Error {
  override name = 'ConfigError'
}

/** Every problem at once, e.g. "RESEND_API_KEY is required; CONTACT_RETENTION_DAYS must be a whole number". */
export function loadConfig(env: Record<string, string | undefined>): Config {
  // An empty value counts as unset, so KEY= in a .env file falls back to the default (or fails if required).
  const present = Object.fromEntries(Object.entries(env).filter(([, value]) => value !== undefined && value.trim() !== ''))
  const result = configSchema.safeParse(present)
  if (result.success) return result.data
  const problems = result.error.issues.map((issue) => {
    const key = String(issue.path[0])
    return issue.code === 'invalid_type' && present[key] === undefined ? `${key} is required` : `${key} ${issue.message}`
  })
  throw new ConfigError(`apps/api configuration: ${[...new Set(problems)].join('; ')}`)
}

/** The keys a deployment must set, for .env.example and the start-up message. */
export const requiredKeys = Object.entries(configSchema.shape)
  .filter(([, schema]) => !schema.safeParse(undefined).success)
  .map(([key]) => key)
