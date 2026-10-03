import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentPage } from '@/components/ui/ContentPage';
import { legalPages, type LegalSlug } from '@/lib/catalog';
import { getPage } from '@/lib/sanity/data';

type Props = { params: Promise<{ legal: string }> };

export const revalidate = 60;
// Only the four legal slugs exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(legalPages).map((legal) => ({ legal }));
}

const isLegalSlug = (slug: string): slug is LegalSlug => slug in legalPages;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { legal } = await params;
  if (!isLegalSlug(legal)) return {};
  const page = await getPage(legal);
  return {
    title: page?.seo?.title || page?.title || legalPages[legal],
    description: page?.seo?.description,
    alternates: { canonical: `/${legal}` },
  };
}

export default async function LegalPage({ params }: Props) {
  const { legal } = await params;
  if (!isLegalSlug(legal)) notFound();
  const page = await getPage(legal);

  return (
    <ContentPage
      label="Informations"
      title={page?.title || legalPages[legal]}
      body={page?.body ?? null}
    />
  );
}
