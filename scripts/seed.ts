/**
 * Test data for development: 2 collections, settings and 8 placeholder products.
 * Run: pnpm seed (uses your `sanity login` session). Safe to re-run: fixed IDs, createOrReplace.
 * Remove before launch: delete documents whose _id starts with "seed-".
 */
import { getCliClient } from 'sanity/cli';
import { entretienBlocks } from '../src/lib/sanity/fixtures';

const client = getCliClient({ apiVersion: '2026-10-01' });

const leatherColors = [
  { name: 'Cognac', hex: '#9C5A33' },
  { name: 'Olive', hex: '#5F6A4B' },
  { name: 'Espresso', hex: '#2B1D14' },
  { name: 'Camel', hex: '#B98552' },
];

function placeholderSvg(color: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500">
  <rect width="1200" height="1500" fill="#E3D3BE"/>
  <g transform="translate(600 750) scale(5) translate(-50 -80)" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="50" cy="10" r="6" stroke-width="1.5"/>
    <path d="M50 18C50 18 88 72 88 104A38 38 0 0 1 12 104C12 72 50 18 50 18Z" fill="${color}" fill-opacity="0.12" stroke-width="1.5"/>
    <path d="M50 33C50 33 77 78 77 104A27 27 0 0 1 23 104C23 78 50 33 50 33Z" stroke-width="1" stroke-dasharray="3 4"/>
  </g>
</svg>`;
}

const categories = ['boucles-d-oreilles', 'collier', 'bracelet', 'bague'] as const;

async function main() {
  console.log(`Seeding ${client.config().projectId}/${client.config().dataset}…`);

  const assets = new Map<string, string>();
  for (const color of leatherColors) {
    const asset = await client.assets.upload('image', Buffer.from(placeholderSvg(color.hex)), {
      filename: `seed-${color.name.toLowerCase()}.svg`,
      contentType: 'image/svg+xml',
    });
    assets.set(color.name, asset._id);
  }

  const tx = client.transaction();

  tx.createIfNotExists({
    _id: 'settings',
    _type: 'settings',
    vacationMode: { enabled: false },
    announcementBar: { enabled: false },
    pickupEnabled: false,
  });

  const collections = ['A', 'B'].map((letter, i) => ({
    _id: `seed-collection-${letter.toLowerCase()}`,
    _type: 'collection',
    title: `[COLLECTION ${letter}]`,
    slug: { _type: 'slug', current: `collection-${letter.toLowerCase()}` },
    description: '[TEXTE À FOURNIR]',
    order: i,
  }));
  collections.forEach((c) => tx.createOrReplace(c));

  for (let i = 0; i < 8; i++) {
    const n = String(i + 1).padStart(2, '0');
    const color = leatherColors[i % leatherColors.length]!;
    const assetId = assets.get(color.name)!;
    tx.createOrReplace({
      _id: `seed-product-${n}`,
      _type: 'product',
      title: `[NOM DU BIJOU] ${n}`,
      slug: { _type: 'slug', current: `bijou-test-${n}` },
      collection: { _type: 'reference', _ref: collections[i % 2]!._id },
      category: categories[i % categories.length],
      // Test prices only (cents).
      price: 3500 + i * 500,
      images: [
        {
          _key: 'img1',
          _type: 'image',
          asset: { _type: 'reference', _ref: assetId },
          alt: `[NOM DU BIJOU] ${n}, cuir ${color.name.toLowerCase()}`,
        },
      ],
      leatherColor: color.name,
      dimensions: '[DIMENSIONS]',
      weight: 10,
      description: [
        {
          _key: 'b1',
          _type: 'block',
          style: 'normal',
          markDefs: [],
          children: [{ _key: 's1', _type: 'span', text: '[TEXTE À FOURNIR]', marks: [] }],
        },
      ],
      stock: i === 7 ? 0 : 1,
      // The last one is sold, to test the "Vendu" state.
      status: i === 7 ? 'sold' : 'available',
      featured: i < 2,
      publishedAt: new Date(Date.UTC(2026, 9, 1 + i)).toISOString(),
    });
  }

  // Care guide draft: created once, then edited by Delphine in the Studio (Pages).
  tx.createIfNotExists({
    _id: 'page-entretien',
    _type: 'page',
    title: 'Entretien du cuir',
    slug: { _type: 'slug', current: 'entretien' },
    body: entretienBlocks,
  });

  await tx.commit();
  console.log('Done: settings, 2 collections, 8 products.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
