// Public values for client components. Plain reads on purpose: importing ./env would pull
// Zod into the browser bundle. They are validated on the server and at build time by ./env.
// NEXT_PUBLIC_* must be referenced literally so Next.js inlines them.
export const clientEnv = {
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || undefined,
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || undefined,
};
