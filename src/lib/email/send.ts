import 'server-only';
import * as Sentry from '@sentry/nextjs';
import type { ReactElement } from 'react';
import { Resend } from 'resend';
import { serverEnv } from '@/lib/env.server';

// Until the client's domain is verified in Resend, its shared test sender is used.
const FROM = serverEnv.EMAIL_FROM ?? 'Delphine M. Créations <onboarding@resend.dev>';

let resend: Resend | null = null;

/** Without a key (local development, demo deploys) e-mails are skipped, not failed. */
export const isEmailConfigured = Boolean(serverEnv.RESEND_API_KEY);

type SendOptions = {
  to: string;
  subject: string;
  react: ReactElement;
  replyTo?: string;
  /** Resend ignores a second send with the same key (webhook retries). */
  idempotencyKey?: string;
  /** Fetched by Resend from a public URL (`path`, e.g. the CGV PDF) or sent inline (`content`). */
  attachments?: ({ filename: string } & ({ path: string } | { content: Buffer }))[];
};

/** Sends an e-mail. Never throws: failures go to Sentry so webhooks still answer 200. */
export async function sendEmail({
  to,
  subject,
  react,
  replyTo,
  idempotencyKey,
  attachments,
}: SendOptions) {
  if (!serverEnv.RESEND_API_KEY) {
    console.info(`[email skipped, RESEND_API_KEY missing] ${subject} -> ${to}`);
    return false;
  }
  resend ??= new Resend(serverEnv.RESEND_API_KEY);
  try {
    const { error } = await resend.emails.send(
      { from: FROM, to, subject, react, replyTo, attachments },
      idempotencyKey ? { idempotencyKey } : undefined,
    );
    if (error) throw new Error(`${error.name}: ${error.message}`);
    return true;
  } catch (error) {
    Sentry.captureException(error, { extra: { subject, idempotencyKey } });
    return false;
  }
}

/** Delphine's inbox for order and form notifications. */
export function delphineEmail() {
  return serverEnv.EMAIL_DELPHINE ?? null;
}
