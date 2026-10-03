import 'server-only';
import Stripe from 'stripe';
import { serverEnv } from './env.server';

let stripe: Stripe | null = null;

export const isStripeConfigured = Boolean(serverEnv.STRIPE_SECRET_KEY);

/** Stripe client. Throws if STRIPE_SECRET_KEY is missing (accounts not connected yet). */
export function getStripe() {
  if (!serverEnv.STRIPE_SECRET_KEY) {
    throw new Error('Stripe is not configured: set STRIPE_SECRET_KEY');
  }
  stripe ??= new Stripe(serverEnv.STRIPE_SECRET_KEY, {
    appInfo: { name: 'delphine-m-creations' },
    maxNetworkRetries: 2,
  });
  return stripe;
}

/** Minimum lifetime Stripe accepts for a Checkout Session is 30 minutes. */
export const CHECKOUT_SESSION_MINUTES = 31;
