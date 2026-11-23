import type { Metadata } from 'next';
import { ContentPage } from '@/components/ui/ContentPage';
import { getPage } from '@/lib/sanity/data';
import { seo } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('entretien');
  return {
    title: page?.seo?.title || seo.entretien.title,
    description: page?.seo?.description ?? seo.entretien.description,
    alternates: { canonical: '/entretien' },
  };
}

export default async function EntretienPage() {
  const page = await getPage('entretien');
  return <ContentPage title={page?.title || 'Entretien du cuir'} body={page?.body ?? null} />;
}
