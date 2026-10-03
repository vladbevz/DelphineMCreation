import { z } from 'zod';

const sanityId = z
  .string()
  .min(1)
  .max(128)
  .regex(/^[a-zA-Z0-9._-]+$/, 'Invalid id')
  // Never accept draft ids from the client.
  .refine((id) => !id.startsWith('drafts.'), 'Invalid id');

export const checkoutSchema = z.object({
  productIds: z
    .array(sanityId)
    .min(1)
    .max(10)
    .transform((ids) => [...new Set(ids)]),
  /** Session the same browser opened before (back button / retry): released first. */
  previousSessionId: z
    .string()
    .regex(/^cs_(test|live)_[a-zA-Z0-9]+$/)
    .optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const cartIdsSchema = z.array(sanityId).max(20);

export const stripeSessionIdSchema = z.string().regex(/^cs_(test|live)_[a-zA-Z0-9]+$/);

// Forms (CLAUDE.md §6.7). Messages are shown to visitors, so they are in French.
const name = z.string().trim().min(2, 'Indiquez votre nom.').max(100, 'Nom trop long.');
const email = z.email('Adresse e-mail invalide.').trim().max(200);
const message = z
  .string()
  .trim()
  .min(10, 'Votre message est un peu court.')
  .max(5000, 'Votre message est trop long (5000 caractères maximum).');
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `${max} caractères maximum.`)
    .optional()
    .transform((v) => v || undefined);

export const contactSchema = z.object({ name, email, message });

export const customRequestSchema = z.object({
  name,
  email,
  phone: optionalText(30),
  type: z
    .enum(['boucles-d-oreilles', 'collier', 'bracelet', 'bague', 'autre'])
    .optional()
    .or(z.literal('').transform(() => undefined)),
  colors: optionalText(200),
  budget: optionalText(100),
  message,
});

export { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, MAX_REQUEST_IMAGES } from './formLimits';
