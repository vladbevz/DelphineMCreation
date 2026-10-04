// Local stand-in data, used only while no Sanity project is connected (see data.ts).
// Mirrors scripts/seed.ts. Images have no asset, so components render the earring motif.
import type {
  BlockContent,
  COLLECTIONS_QUERY_RESULT,
  PRODUCT_QUERY_RESULT,
  SETTINGS_QUERY_RESULT,
} from '@/sanity/types';

type Product = NonNullable<PRODUCT_QUERY_RESULT>;

export function placeholderBlocks(text = '[TEXTE À FOURNIR]'): BlockContent {
  return [
    {
      _key: 'p1',
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [{ _key: 's1', _type: 'span', text, marks: [] }],
    },
  ];
}

export const fixtureCollections: COLLECTIONS_QUERY_RESULT = ['A', 'B'].map((letter) => ({
  _id: `seed-collection-${letter.toLowerCase()}`,
  _updatedAt: '2026-10-01T00:00:00Z',
  title: `[COLLECTION ${letter}]`,
  slug: `collection-${letter.toLowerCase()}`,
  cover: null,
  description: '[TEXTE À FOURNIR]',
}));

const colors = ['Cognac', 'Olive', 'Espresso', 'Camel'];
const categories = ['boucles-d-oreilles', 'collier', 'bracelet', 'bague'] as const;

export const fixtureProducts: Product[] = Array.from({ length: 8 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  const color = colors[i % colors.length]!;
  const collection = fixtureCollections[i % 2]!;
  const image = {
    _key: 'img1',
    _type: 'image' as const,
    alt: `[NOM DU BIJOU] ${n}, cuir ${color.toLowerCase()}`,
    lqip: null,
  };
  return {
    _id: `seed-product-${n}`,
    title: `[NOM DU BIJOU] ${n}`,
    slug: `bijou-test-${n}`,
    // Test prices only (cents).
    price: 3500 + i * 500,
    status: i === 7 ? 'sold' : 'available',
    stock: i === 7 ? 0 : 1,
    category: categories[i % categories.length]!,
    leatherColor: color,
    publishedAt: new Date(Date.UTC(2026, 9, 1 + i)).toISOString(),
    image,
    hoverImage: { ...image, _key: 'img2' },
    images: [
      { ...image, dimensions: null },
      { ...image, _key: 'img2', dimensions: null },
      { ...image, _key: 'img3', dimensions: null },
    ],
    description: placeholderBlocks(),
    care: placeholderBlocks(),
    dimensions: '[DIMENSIONS]',
    weight: 10,
    seo: null,
    collection: { _id: collection._id, title: collection.title, slug: collection.slug },
  };
});

export const fixtureSettings: SETTINGS_QUERY_RESULT = {
  vacationMode: { enabled: false },
  announcementBar: { enabled: false },
  colissimoPrice: null,
  freeShippingThreshold: null,
  pickupEnabled: false,
  email: null,
  phone: null,
  instagram: null,
  facebook: null,
};
