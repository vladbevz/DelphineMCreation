'use client';

import { frFRLocale } from '@sanity/locale-fr-fr';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { apiVersion, dataset, projectId } from './src/sanity/env';
import { schemaTypes } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';

// Documents only the server creates: no "Create" button, no duplicate.
const serverCreatedTypes = new Set(['order', 'customRequest']);
const singletonTypes = new Set(['settings']);

export default defineConfig({
  name: 'default',
  title: 'Delphine M. Créations',
  basePath: '/studio',
  projectId: projectId || 'not-configured',
  dataset,
  plugins: [
    structureTool({ structure }),
    frFRLocale(),
    // GROQ playground for the developer only.
    ...(process.env.NODE_ENV === 'development'
      ? [visionTool({ defaultApiVersion: apiVersion })]
      : []),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(
        ({ schemaType }) => !serverCreatedTypes.has(schemaType) && !singletonTypes.has(schemaType),
      ),
  },
  document: {
    newDocumentOptions: (prev) =>
      prev.filter(
        ({ templateId }) => !serverCreatedTypes.has(templateId) && !singletonTypes.has(templateId),
      ),
    actions: (prev, { schemaType }) => {
      if (singletonTypes.has(schemaType)) {
        return prev.filter(({ action }) => action === 'publish' || action === 'discardChanges');
      }
      if (schemaType === 'order') {
        // Orders are accounting records: never deleted or duplicated from the Studio.
        return prev.filter(
          ({ action }) => action !== 'delete' && action !== 'duplicate' && action !== 'unpublish',
        );
      }
      if (schemaType === 'customRequest') {
        return prev.filter(({ action }) => action !== 'duplicate');
      }
      return prev;
    },
  },
});
