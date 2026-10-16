import Image from 'next/image';
import Link from 'next/link';
import { EarringMotif } from '@/components/brand/EarringMotif';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardPlaceholder } from '@/components/product/ProductCardPlaceholder';
import { JsonLd } from '@/components/seo/JsonLd';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Marquee } from '@/components/ui/Marquee';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { categories, categoryFilterLabels } from '@/lib/catalog';
import { photos } from '@/lib/photos';
import { getLatestProducts, getProducts, getSettings } from '@/lib/sanity/data';
import { urlFor } from '@/lib/sanity/image';
import { site } from '@/lib/site';
import { absoluteUrl } from '@/lib/url';

export const revalidate = 60;

const instagramPhotos = [
  photos.presentoir,
  photos.finitions,
  photos.bouclesLiege,
  photos.atelierMains,
];

const promises = [
  { title: 'Fait main', text: 'Découpé et assemblé à la main, de la peau au bijou.' },
  {
    title: 'Ultra léger',
    text: 'Jusqu’à dix fois plus léger qu’un bijou classique : on oublie qu’on le porte.',
  },
  { title: 'Cuir upcyclé', text: 'Des chutes de cuir qui retrouvent une seconde vie.' },
];

// Delphine's own word play: « M » sounds like « aime ».
const marqueeWords = ['la couleur', 'ce qui brille', 'le cuir'];

export default async function HomePage() {
  const [products, all, settings] = await Promise.all([
    getLatestProducts(),
    getProducts(),
    getSettings(),
  ]);
  // Full rows only: 4 pieces, or 8 on desktop when there are enough (4 on mobile).
  const shown = products.slice(0, products.length >= 8 ? 8 : 4);
  const sameAs = [settings?.instagram, settings?.facebook].filter((u): u is string => Boolean(u));

  // One tile per category that has pieces, illustrated by its newest piece.
  const categoryTiles = categories
    .filter((c) => c.value !== 'autre')
    .map((c) => ({ ...c, product: all.find((p) => p.category === c.value) }))
    .filter((c) => c.product);

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

      {/* Hero: full-bleed photo, centred thin capitals. */}
      <section className="relative flex h-[min(80svh,40rem)] min-h-[28rem] items-center justify-center overflow-hidden bg-espresso sm:h-[calc(100svh-4.5rem)] sm:max-h-[52rem]">
        <Image
          src={photos.bouclesLiege.src}
          alt={photos.bouclesLiege.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-espresso/35" aria-hidden />
        <div className="relative px-5 text-center text-linen">
          <p className="text-[0.6rem] font-medium tracking-[0.2em] text-linen/90 uppercase sm:label-caps">
            Bijoux en cuir faits main · Clarensac, Gard
          </p>
          <h1 className="mx-auto mt-5 max-w-4xl display-caps text-4xl leading-[1.1] sm:text-6xl">
            Des bijoux en cuir, façonnés de mes mains
          </h1>
          <ButtonLink href="/boutique" variant="light" className="mt-8">
            Découvrir la boutique
          </ButtonLink>
        </div>
      </section>

      {/* New pieces */}
      <section className="pt-10 pb-14 lg:pb-20">
        <Marquee className="display-caps text-3xl sm:text-5xl">
          Nouvelle <span className="font-medium">collection</span>
          {marqueeWords.map((w) => (
            <span key={w}>
              <span className="px-4">·</span>
              <em className="italic-accent">Delphine M</em> {w}
            </span>
          ))}
          <span className="pl-4">·</span>
        </Marquee>
        <Container className="mt-8 lg:mt-10">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
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
          <div className="mt-10 text-center">
            <ButtonLink href="/boutique" variant="secondary">
              Toutes les créations
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Categories */}
      {categoryTiles.length > 0 && (
        <section className="bg-cream py-14 lg:py-20">
          <Container size="medium">
            <SectionHeading
              align="center"
              title={
                <>
                  <em>Découvrez</em> nos créations
                </>
              }
            />
            <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
              {categoryTiles.map(({ value, product }) => (
                <li key={value}>
                  <Link href={`/boutique?categorie=${value}`} className="group block text-center">
                    <div className="relative aspect-square overflow-hidden bg-sand">
                      {product?.image?.asset ? (
                        <Image
                          src={urlFor(product.image).width(600).height(600).url()}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 240px, 50vw"
                          className="object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <EarringMotif className="h-2/5 w-auto text-cognac/50" />
                        </div>
                      )}
                    </div>
                    <p className="mt-3 display-caps text-lg decoration-1 underline-offset-4 group-hover:underline">
                      {categoryFilterLabels[value]}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* Atelier: photo + text */}
      <section className="py-14 lg:py-20">
        <Container size="medium" className="grid items-center gap-8 md:grid-cols-2 lg:gap-14">
          <div className="relative aspect-[4/3] overflow-hidden bg-sand md:aspect-[4/5]">
            <Image
              src={photos.atelierMains.src}
              alt={photos.atelierMains.alt}
              fill
              sizes="(min-width: 768px) 460px, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading
              label="À l’atelier"
              title={
                <>
                  <em>Fait main</em> dans la Vaunage
                </>
              }
              intro={
                <p>
                  Dans mon atelier de Clarensac, je découpe, assemble et finis chaque bijou à la
                  main, avec un bistouri, des ciseaux et un marteau. Pas de machine, pas
                  d’électricité : juste du temps, de la patience et l’amour du travail bien fait.
                </p>
              }
            />
            <ButtonLink href="/atelier" variant="secondary" className="mt-8">
              Découvrir l’atelier
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Promises */}
      <section className="border-y border-sand-border bg-cream py-12 lg:py-16">
        <Container size="medium">
          <ul className="grid grid-cols-3 gap-4 sm:gap-10">
            {promises.map((p) => (
              <li key={p.title} className="text-center">
                <EarringMotif className="mx-auto h-9 w-auto text-cognac sm:h-11" />
                <h3 className="mt-4 display-caps text-base leading-tight sm:text-xl">{p.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-xs text-muted sm:text-sm">{p.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Full-bleed photo with large text */}
      <section className="relative flex min-h-[26rem] items-end overflow-hidden bg-espresso sm:min-h-[34rem]">
        <Image
          src={photos.finitions.src}
          alt={photos.finitions.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-espresso/40" aria-hidden />
        <Container className="relative pb-12 text-linen sm:pb-16">
          <p className="max-w-xl font-display text-5xl leading-[1.05] font-light sm:text-7xl">
            Jamais deux fois
            <br />
            <em className="italic">pareil</em>
          </p>
          <ButtonLink href="/sur-mesure" variant="light" className="mt-8">
            Imaginer un sur-mesure
          </ButtonLink>
        </Container>
      </section>

      {/* Instagram: large outlined word above a row of photos. */}
      <section className="overflow-hidden pt-14 lg:pt-20">
        <Container>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <h2 className="font-display text-[3.2rem] leading-[0.9] font-light text-transparent [-webkit-text-stroke:1px_var(--color-muted)] sm:text-[5rem] lg:text-[6.5rem]">
              Instagram
            </h2>
            {settings?.instagram ? (
              <ButtonLink
                href={settings.instagram}
                variant="ghost"
                target="_blank"
                rel="noopener noreferrer"
                className="order-first self-start sm:order-none sm:mb-2 sm:self-auto"
              >
                Suivre l’atelier
              </ButtonLink>
            ) : (
              <p className="order-first text-xs text-muted sm:order-none sm:mb-3">
                [LIEN À FOURNIR]
              </p>
            )}
          </div>
          {/* Static photos picked by the client (no Instagram API). */}
          <ul className="mt-4 grid grid-cols-4 gap-2 sm:mt-6 sm:gap-4">
            {instagramPhotos.map((p) => (
              <li key={p.src} className="relative aspect-square overflow-hidden bg-cream">
                <Image src={p.src} alt={p.alt} fill sizes="25vw" className="object-cover" />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
