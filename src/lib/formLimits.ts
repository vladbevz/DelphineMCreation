// Shared by the sur-mesure form (client) and its server action. No dependencies, so the
// client bundle does not pull in Zod.
export const MAX_REQUEST_IMAGES = 3;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
