import type { Metadata } from 'next';
import { ContentPage } from '@/components/ui/ContentPage';
import { getPage } from '@/lib/sanity/data';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('entretien');
  return {
    title: page?.seo?.title || page?.title || 'Entretien du cuir',
    description:
      page?.seo?.description ??
      'Conseils pour entretenir vos bijoux en cuir et les garder longtemps.',
    alternates: { canonical: '/entretien' },
  };
}

export default async function EntretienPage() {
  const page = await getPage('entretien');
  return (
    <ContentPage
      label="Conseils"
      title={page?.title || 'Entretien du cuir'}
      body={page?.body ?? null}
    />
  );
}
