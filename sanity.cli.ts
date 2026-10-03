import { loadEnvConfig } from '@next/env';
import { defineCliConfig } from 'sanity/cli';

// Reuse Next.js .env files so the CLI sees NEXT_PUBLIC_SANITY_* variables.
loadEnvConfig(process.cwd());

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
  typegen: {
    path: './src/**/*.{ts,tsx}',
    schema: './src/sanity/extract.json',
    generates: './src/sanity/types.ts',
    overloadClientMethods: true,
  },
});
