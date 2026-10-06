import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { PageHeader } from '@/components/ui/PageHeader';
import { Container } from '@/components/ui/Container';
import { getCollection, getCollections } from '@/lib/sanity/data';
import { urlFor } from '@/lib/sanity/image';

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const collection = await getCollection((await params).slug);
  if (!collection) return {};
  const cover = collection.cover?.asset ? collection.cover : null;
  return {
    title: collection.title,
    description: collection.description ?? undefined,
    alternates: { canonical: `/collections/${collection.slug}` },
    openGraph: cover
      ? { images: [{ url: urlFor(cover).width(1200).height(630).url(), width: 1200, height: 630 }] }
      : undefined,
  };
}

export default async function CollectionPage({ params }: Props) {
  const collection = await getCollection((await params).slug);
  if (!collection) notFound();

  return (
    <>
      <PageHeader label="Collection" title={collection.title} intro={collection.description} />
      <Container>
        {collection.products.length > 0 ? (
          <ProductGrid products={collection.products} />
        ) : (
          <p className="bg-cream px-6 py-16 text-center text-muted">
            Les créations de cette collection arrivent bientôt.
          </p>
        )}
      </Container>
    </>
  );
}
