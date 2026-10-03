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
