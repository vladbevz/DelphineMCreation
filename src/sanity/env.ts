// Shared by the Studio, the CLI and the Next.js app. NEXT_PUBLIC_* must be referenced literally.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = '2026-10-01';

/** False until a Sanity project is connected (.env.local). */
export const isSanityConfigured = projectId !== '';
