/**
 * One-off migration to the "always for sale" model (November 2026).
 *
 *   pnpm exec sanity exec scripts/migrate-stock-model.ts --with-user-token
 *   pnpm exec sanity exec scripts/migrate-stock-model.ts --with-user-token -- --legal
 *
 * - Removes the old pièce-unique fields (status, reservedUntil, reservationToken) from every
 *   product and draft. A product marked "sold" keeps stock 0: it stays for sale, made to order.
 * - With --legal: replaces the CGV and "Livraison et retours" pages with the updated drafts
 *   from src/lib/sanity/legalDrafts.ts. Only if they were not edited in the Studio yet:
 *   this overwrites the whole page body.
 */
import { getCliClient } from 'sanity/cli';
import { legalDrafts } from '../src/lib/sanity/legalDrafts';

const client = getCliClient({ apiVersion: '2026-10-01' });

async function run() {
  const ids = await client.fetch<string[]>(
    `*[_type == "product" && (defined(status) || defined(reservedUntil) || defined(reservationToken))]._id`,
  );
  const tx = client.transaction();
  for (const id of ids) {
    tx.patch(id, (p) => p.unset(['status', 'reservedUntil', 'reservationToken']));
  }

  if (process.argv.includes('--legal')) {
    for (const slug of ['cgv', 'livraison-retours'] as const) {
      tx.patch(`page-${slug}`, (p) => p.set({ body: legalDrafts[slug].body }));
    }
  }

  if (ids.length === 0 && !process.argv.includes('--legal')) {
    console.log('Nothing to migrate.');
    return;
  }
  await tx.commit();
  console.log(
    `Done: ${ids.length} product document(s) cleaned${process.argv.includes('--legal') ? ', CGV and livraison-retours updated' : ''}.`,
  );
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
