import { EarringMotif } from '@/components/brand/EarringMotif';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardPlaceholder } from '@/components/product/ProductCardPlaceholder';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { JsonLd } from '@/components/seo/JsonLd';
import { getLatestProducts, getSettings } from '@/lib/sanity/data';
import { site } from '@/lib/site';
import { absoluteUrl } from '@/lib/url';

export const revalidate = 60;

const promises = [
  { title: 'Pièce unique', text: '[TEXTE À FOURNIR]' },
  { title: 'Cuir sélectionné', text: '[TEXTE À FOURNIR]' },
  { title: 'Fait main', text: '[TEXTE À FOURNIR]' },
];

export default async function HomePage() {
  const [products, settings] = await Promise.all([getLatestProducts(), getSettings()]);
  // Full rows only: 4 pieces, or 8 on desktop when there are enough (4 on mobile).
  const shown = products.slice(0, products.length >= 8 ? 8 : 4);
  const sameAs = [settings?.instagram, settings?.facebook].filter((u): u is string => Boolean(u));

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': ['Organization', 'LocalBusiness'],
          name: site.name,
          url: absoluteUrl('/'),
          description: site.description,
          address: {
            '@type': 'PostalAddress',
            addressLocality: site.locality,
            addressRegion: site.region,
            addressCountry: 'FR',
          },
          email: settings?.email ?? undefined,
          sameAs: sameAs.length ? sameAs : undefined,
        }}
      />
      {/* Hero */}
      <section className="pt-6 pb-14 sm:pt-10 lg:pb-20">
        <Container className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="order-2 lg:order-1">
            <SectionHeading
              as="h1"
              label="Bijoux faits main · Vaunage, Gard"
              title={
                <>
                  Des bijoux <em>en cuir</em>, façonnés de <em>mes mains</em>
                </>
              }
              intro={<p>[TEXTE À FOURNIR]</p>}
            />
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <ButtonLink href="/boutique">Découvrir la boutique</ButtonLink>
              <ButtonLink href="/atelier" variant="ghost">
                L&apos;atelier
              </ButtonLink>
            </div>
          </div>

          {/* Photo placeholder */}
          <div className="order-1 flex aspect-[4/3] items-center justify-center rounded-3xl bg-sand lg:order-2 lg:aspect-auto lg:h-[min(calc(100svh-11rem),30rem)]">
            <EarringMotif className="h-1/2 w-auto text-cognac/70" title="Photo à venir" />
          </div>
        </Container>
      </section>

      {/* New collection */}
      <section className="bg-cream py-14 lg:py-20">
        <Container>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              label="Nouvelle collection"
              title={
                <>
                  Les dernières <em>créations</em>
                </>
              }
            />
            <ButtonLink href="/boutique" variant="ghost" className="self-start sm:self-auto">
              Voir toute la boutique
            </ButtonLink>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {shown.length > 0
              ? shown.map((product, i) => (
                  <li key={product._id} className={i >= 4 ? 'hidden lg:block' : undefined}>
                    <ProductCard product={product} sizes="(min-width: 1024px) 25vw, 50vw" />
                  </li>
                ))
              : Array.from({ length: 4 }, (_, i) => (
                  <li key={i}>
                    <ProductCardPlaceholder />
                  </li>
                ))}
          </ul>
        </Container>
      </section>

      {/* Promises */}
      <section className="py-14 lg:py-20">
        <Container>
          <ul className="grid grid-cols-3 gap-3 sm:gap-8">
            {promises.map((p) => (
              <li key={p.title} className="text-center">
                <EarringMotif className="mx-auto h-8 w-auto text-olive sm:h-10" />
                <h3 className="mt-3 text-lg leading-tight sm:mt-4 sm:text-2xl">{p.title}</h3>
                <p className="mx-auto mt-1 max-w-xs text-xs text-muted sm:mt-2 sm:text-sm">
                  {p.text}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Atelier */}
      <section>
        <Container size="medium">
          <div className="grid overflow-hidden rounded-3xl bg-espresso text-linen sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div className="flex aspect-[16/9] items-center justify-center bg-sand/15 sm:aspect-auto sm:min-h-64">
              <EarringMotif className="h-24 w-auto text-sand" />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <p className="mb-3 label-caps text-sand">À l&apos;atelier</p>
              <h2 className="text-3xl">
                Fait main dans la <em className="text-sand italic">Vaunage</em>
              </h2>
              <p className="mt-3 leading-relaxed text-sand">[TEXTE À FOURNIR]</p>
              <ButtonLink
                href="/atelier"
                variant="secondary"
                className="mt-6 self-start border-linen text-linen hover:bg-linen hover:text-espresso"
              >
                Découvrir l&apos;atelier
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Instagram */}
      <section className="pt-14 lg:pt-20">
        <Container>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              label="Instagram"
              title={
                <>
                  Les coulisses de <em>l’atelier</em>
                </>
              }
            />
            {settings?.instagram ? (
              <ButtonLink
                href={settings.instagram}
                variant="ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                Suivre sur Instagram
              </ButtonLink>
            ) : (
              <p className="text-sm text-muted">[LIEN À FOURNIR]</p>
            )}
          </div>
          {/* Static photos picked by the client (no Instagram API). */}
          <ul className="mt-6 grid grid-cols-4 gap-2 sm:mt-8 sm:gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <li
                key={i}
                className="flex aspect-square items-center justify-center rounded-xl bg-cream sm:rounded-2xl"
              >
                <EarringMotif className="h-1/3 w-auto text-sand-border" />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
