import { z } from 'zod';

// Empty strings from .env files are treated as "not set".
const optional = z.preprocess((v) => (v === '' ? undefined : v), z.string().min(1).optional());
const optionalUrl = z.preprocess((v) => (v === '' ? undefined : v), z.url().optional());
const optionalEmail = z.preprocess((v) => (v === '' ? undefined : v), z.email().optional());

// Optional here; REQUIRED_IN_PRODUCTION below enforces them on the live site.
const serverSchema = z.object({
  SANITY_API_READ_TOKEN: optional,
  SANITY_API_WRITE_TOKEN: optional,
  SANITY_WEBHOOK_SECRET: optional,
  STRIPE_SECRET_KEY: optional,
  STRIPE_WEBHOOK_SECRET: optional,
  RESEND_API_KEY: optional,
  EMAIL_FROM: optional,
  EMAIL_DELPHINE: optionalEmail,
  TURNSTILE_SECRET_KEY: optional,
  CRON_SECRET: optional,
  SENTRY_DSN: optionalUrl,
});

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
  NEXT_PUBLIC_SANITY_PROJECT_ID: optional,
  NEXT_PUBLIC_SANITY_DATASET: z.string().default('production'),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: optional,
  NEXT_PUBLIC_META_PIXEL_ID: optional,
  NEXT_PUBLIC_SENTRY_DSN: optionalUrl,
});

function format(error: z.ZodError) {
  return error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n');
}

// NEXT_PUBLIC_* must be referenced literally so Next.js can inline them in client bundles.
const publicResult = publicSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
});

if (!publicResult.success) {
  throw new Error(`Invalid public environment variables:\n${format(publicResult.error)}`);
}

export const publicEnv = publicResult.data;

// Locally and on preview deployments missing services fall back (fixtures, skipped e-mails).
// The live site must have them all: fail the production deploy instead of shipping a shop
// that cannot take payments. Checked at build time via next.config.ts.
const REQUIRED_IN_PRODUCTION = [
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
  'NEXT_PUBLIC_SENTRY_DSN',
  'SANITY_API_READ_TOKEN',
  'SANITY_API_WRITE_TOKEN',
  'SANITY_WEBHOOK_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'RESEND_API_KEY',
  'EMAIL_FROM',
  'EMAIL_DELPHINE',
  'TURNSTILE_SECRET_KEY',
  'CRON_SECRET',
  'SENTRY_DSN',
] as const;

if (process.env.VERCEL_ENV === 'production') {
  const missing = REQUIRED_IN_PRODUCTION.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing environment variables for production:\n  ${missing.join('\n  ')}`);
  }
  if (process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')) {
    console.warn('Warning: production is using a Stripe TEST key.');
  }
}

export function getServerEnv() {
  if (typeof window !== 'undefined') {
    throw new Error('getServerEnv() must not be called on the client');
  }
  const result = serverSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error(`Invalid server environment variables:\n${format(result.error)}`);
  }
  return result.data;
}
