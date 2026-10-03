import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs/config';
import './src/lib/env';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    loader: 'custom',
    loaderFile: './src/lib/sanity/imageLoader.ts',
  },
};

export default withSentryConfig(nextConfig, {
  silent: !process.env.CI,
  // Source map upload is enabled once SENTRY_AUTH_TOKEN is configured on Vercel (stage 6).
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
  telemetry: false,
});
