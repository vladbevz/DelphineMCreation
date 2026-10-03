'use server';

import * as Sentry from '@sentry/nextjs';
import { headers } from 'next/headers';
import { categoryLabel } from '@/lib/catalog';
import { delphineEmail, sendEmail } from '@/lib/email/send';
import { ContactEmail } from '@/lib/email/templates/ContactEmail';
import { CustomRequestEmail } from '@/lib/email/templates/CustomRequestEmail';
import { rateLimit } from '@/lib/rateLimit';
import { writeClient } from '@/lib/sanity/writeClient';
import { verifyTurnstile } from '@/lib/turnstile';
import { absoluteUrl } from '@/lib/url';
import {
  ALLOWED_IMAGE_TYPES,
  contactSchema,
  customRequestSchema,
  MAX_IMAGE_BYTES,
  MAX_REQUEST_IMAGES,
} from '@/lib/validation';
import { isSanityConfigured } from '@/sanity/env';

export type FormState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  errors?: Record<string, string>;
  /** Submitted values, to refill the form after a validation error. */
  values?: Record<string, string>;
};

const GENERIC_ERROR =
  'Une erreur est survenue. Merci de réessayer, ou écrivez-moi directement par e-mail.';

async function guard(formData: FormData, scope: string): Promise<string | null> {
  // Honeypot: hidden field that only bots fill in.
  if (formData.get('website')) return 'spam';

  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? h.get('x-real-ip');
  if (!rateLimit(`${scope}:${ip ?? 'unknown'}`)) {
    return 'Vous avez envoyé plusieurs messages récemment. Merci de réessayer dans une heure.';
  }
  const token = formData.get('cf-turnstile-response');
  if (!(await verifyTurnstile(typeof token === 'string' ? token : null, ip ?? null))) {
    return 'La vérification anti-spam a échoué. Merci de réessayer.';
  }
  return null;
}

function textValues(formData: FormData, keys: string[]) {
  return Object.fromEntries(keys.map((k) => [k, String(formData.get(k) ?? '')]));
}

function fieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? 'form');
    errors[key] ??= issue.message;
  }
  return errors;
}

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = textValues(formData, ['name', 'email', 'message']);
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) return { status: 'error', errors: fieldErrors(parsed.error.issues), values };

  const blocked = await guard(formData, 'contact');
  if (blocked === 'spam') return { status: 'success' }; // do not tell bots they were caught
  if (blocked) return { status: 'error', message: blocked, values };

  const to = delphineEmail();
  if (!to) return { status: 'error', message: GENERIC_ERROR, values };

  const { name, email, message } = parsed.data;
  const sent = await sendEmail({
    to,
    subject: `Message de ${name}`,
    replyTo: email,
    react: <ContactEmail name={name} email={email} message={message} />,
  });
  if (!sent) return { status: 'error', message: GENERIC_ERROR, values };

  return {
    status: 'success',
    message: 'Merci ! Votre message est bien envoyé, je vous réponds très vite.',
  };
}

export async function submitCustomRequest(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const keys = ['name', 'email', 'phone', 'type', 'colors', 'budget', 'message'];
  const values = textValues(formData, keys);
  const parsed = customRequestSchema.safeParse(values);
  const files = formData.getAll('images').filter((f): f is File => f instanceof File && f.size > 0);

  const errors = parsed.success ? {} : fieldErrors(parsed.error.issues);
  if (files.length > MAX_REQUEST_IMAGES) errors.images = `${MAX_REQUEST_IMAGES} photos maximum.`;
  else if (files.some((f) => !ALLOWED_IMAGE_TYPES.includes(f.type))) {
    errors.images = 'Formats acceptés : JPEG, PNG ou WebP.';
  } else if (files.some((f) => f.size > MAX_IMAGE_BYTES)) {
    errors.images = 'Chaque photo doit faire moins de 5 Mo.';
  }
  if (!parsed.success || Object.keys(errors).length > 0) return { status: 'error', errors, values };

  const blocked = await guard(formData, 'sur-mesure');
  if (blocked === 'spam') return { status: 'success' };
  if (blocked) return { status: 'error', message: blocked, values };

  if (!isSanityConfigured) {
    return { status: 'error', message: 'Le formulaire n’est pas encore disponible.', values };
  }

  const data = parsed.data;
  try {
    const assets = await Promise.all(
      files.map(async (file, i) =>
        writeClient.assets.upload('image', Buffer.from(await file.arrayBuffer()), {
          filename: `sur-mesure-${i + 1}.${file.type.split('/')[1]}`,
          contentType: file.type,
        }),
      ),
    );

    const request = await writeClient.create({
      _type: 'customRequest',
      status: 'new',
      createdAt: new Date().toISOString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      type: data.type,
      colors: data.colors,
      budget: data.budget,
      message: data.message,
      images: assets.map((asset, i) => ({
        _key: `img${i}`,
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
        alt: `Photo d’inspiration ${i + 1} envoyée par ${data.name}`,
      })),
    });

    const to = delphineEmail();
    if (to) {
      await sendEmail({
        to,
        subject: `Demande sur-mesure de ${data.name}`,
        replyTo: data.email,
        react: (
          <CustomRequestEmail
            request={{ ...data, type: categoryLabel(data.type), imageCount: assets.length }}
            studioUrl={absoluteUrl(`/studio/intent/edit/id=${request._id};type=customRequest/`)}
          />
        ),
      });
    }
  } catch (error) {
    Sentry.captureException(error, { tags: { form: 'sur-mesure' } });
    return { status: 'error', message: GENERIC_ERROR, values };
  }

  return {
    status: 'success',
    message: 'Merci ! Votre demande est bien reçue. Je reviens vers vous très vite pour en parler.',
  };
}
