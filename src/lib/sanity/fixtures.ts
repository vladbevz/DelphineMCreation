// Local stand-in data, used only while no Sanity project is connected (see data.ts).
// Mirrors scripts/seed.ts. Images have no asset, so components render the earring motif.
import type {
  BlockContent,
  COLLECTIONS_QUERY_RESULT,
  PRODUCT_QUERY_RESULT,
  SETTINGS_QUERY_RESULT,
} from '@/sanity/types';
import { owner } from './legalDrafts';

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

/** Paragraph with an optional bold lead-in (« L’eau. » …). */
function paragraph(key: string, text: string, lead?: string): BlockContent[number] {
  return {
    _key: key,
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [
      ...(lead
        ? [{ _key: `${key}b`, _type: 'span' as const, text: `${lead} `, marks: ['strong'] }]
        : []),
      { _key: `${key}t`, _type: 'span' as const, text, marks: [] },
    ],
  };
}

// Draft from the copy doc (to be validated by Delphine). Also written to Sanity by pnpm seed.
export const entretienBlocks: BlockContent = [
  paragraph(
    'e1',
    'Le cuir est une matière vivante : avec quelques gestes simples, vos bijoux vous accompagneront longtemps.',
  ),
  paragraph(
    'e2',
    'Évitez de mouiller vos bijoux. Retirez vos bagues et bracelets pour vous laver les mains, et vos boucles avant la douche ou la baignade.',
    'L’eau.',
  ),
  paragraph(
    'e3',
    'Mettez vos bijoux en dernier, une fois le parfum et la crème bien séchés.',
    'Parfum et crèmes.',
  ),
  paragraph(
    'e4',
    'À plat, à l’abri de la lumière directe, dans leur pochette, pour éviter que les couleurs ne passent.',
    'Le rangement.',
  ),
  paragraph('e5', 'Un élément se décolle ou se perd : écrivez-moi, je répare.', 'Un souci ?'),
];

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
  email: owner.email,
  postalAddress: owner.address,
  phone: owner.phone,
  instagram: null,
  facebook: null,
};
