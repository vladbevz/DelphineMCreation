import 'server-only';
import { serverEnv } from './env.server';

/**
 * Verifies a Cloudflare Turnstile token. Without TURNSTILE_SECRET_KEY (local development
 * before the client's accounts exist) verification is skipped.
 */
export async function verifyTurnstile(token: string | null, ip: string | null) {
  const secret = serverEnv.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      cache: 'no-store',
    });
    const result = (await response.json()) as { success: boolean };
    return result.success;
  } catch {
    return false;
  }
}
