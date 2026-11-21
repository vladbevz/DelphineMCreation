import Image from 'next/image';
import Link from 'next/link';
import { InstagramIcon } from '@/components/brand/InstagramIcon';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { HeroMedia } from '@/components/home/HeroMedia';
import { TrustStrip } from '@/components/home/TrustStrip';
import { RevealWords, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardPlaceholder } from '@/components/product/ProductCardPlaceholder';
import { JsonLd } from '@/components/seo/JsonLd';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
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
  {
    title: 'Fait main',
    text: 'Découpé et assemblé à la main, de la peau au bijou.',
  },
  {
    title: 'Ultra léger',
    text: 'Jusqu’à dix fois plus léger qu’un bijou classique : on oublie qu’on le porte.',
  },
  {
    title: 'Cuir de Colombie',
    text: 'Des cuirs colorés rapportés de Colombie, choisis pour leur couleur et leur éclat.',
  },
];

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

      {/* Hero: full-bleed photo (LCP, rendered as-is), title words sliding up from a mask. */}
      <section className="relative flex h-[min(80svh,40rem)] min-h-[28rem] items-center justify-center overflow-hidden bg-graphite sm:h-[calc(100svh-4.5rem)] sm:max-h-[52rem]">
        <HeroMedia src={photos.bouclesLiege.src} alt={photos.bouclesLiege.alt} />
        <div className="absolute inset-0 bg-graphite/35" aria-hidden />
        <div className="relative px-5 text-center text-blanc">
          <h1 className="mx-auto max-w-4xl text-4xl leading-[1.1] sm:text-6xl">
            <RevealWords text="Des bijoux en cuir, façonnés de mes mains" delay={0.15} />
          </h1>
          <ButtonLink href="/boutique" variant="light" className="mt-8">
            Découvrir la boutique
          </ButtonLink>
        </div>
      </section>

      <TrustStrip freeShippingThreshold={settings?.freeShippingThreshold ?? null} />

      {/* New pieces */}
      <section className="pt-10 pb-14 lg:pb-20">
        <Container>
          <SectionHeading align="center" title="Nouvelle collection" className="mb-8 lg:mb-10" />
          <Stagger as="ul" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {shown.length > 0
              ? shown.map((product, i) => (
                  <StaggerItem
                    as="li"
                    key={product._id}
                    className={i >= 4 ? 'hidden lg:block' : undefined}
                  >
                    <ProductCard product={product} sizes="(min-width: 1024px) 25vw, 50vw" />
                  </StaggerItem>
                ))
              : Array.from({ length: 4 }, (_, i) => (
                  <StaggerItem as="li" key={i}>
                    <ProductCardPlaceholder />
                  </StaggerItem>
                ))}
          </Stagger>
          <div className="mt-10 text-center">
            <ButtonLink href="/boutique" variant="secondary">
              Toutes les créations
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Categories: one photo each. */}
      {categoryTiles.length > 0 && (
        <section className="overflow-hidden bg-rose-pale py-14 lg:py-20">
          <Container size="medium">
            <SectionHeading align="center" title="Découvrez nos créations" />
            <Stagger
              as="ul"
              className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 lg:grid-cols-4"
            >
              {categoryTiles.map(({ value, product }) => (
                <StaggerItem as="li" key={value}>
                  <Link href={`/boutique?categorie=${value}`} className="group block text-center">
                    <div className="relative">
                      <div className="relative aspect-square overflow-hidden bg-nuage transition-transform duration-500 ease-premium group-hover:-translate-y-1.5">
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
                            <BrandLogo
                              variant="mark"
                              mono
                              className="h-2/5 w-auto text-graphite/15"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="mt-4 product-title text-lg decoration-1 underline-offset-4 group-hover:underline">
                      {categoryFilterLabels[value]}
                    </p>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </section>
      )}

      {/* Atelier: photo + text. */}
      <section className="py-14 lg:py-20">
        <Container size="medium" className="grid items-center gap-8 md:grid-cols-2 lg:gap-14">
          <div className="relative aspect-[4/3] overflow-hidden bg-nuage md:aspect-[4/5]">
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
              title="Fait main dans la Vaunage"
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

      {/* Promises on pale pink. */}
      <section className="bg-rose-pale py-12 lg:py-16">
        <Container size="medium">
          <ul className="grid gap-6 sm:grid-cols-3 sm:gap-10">
            {promises.map((p) => (
              <li key={p.title}>
                <h3 className="text-xl">{p.title}</h3>
                <p className="mt-1.5 max-w-xs text-sm text-gris">{p.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Full-bleed photo with large text */}
      <section className="relative flex min-h-[26rem] items-end overflow-hidden bg-graphite sm:min-h-[34rem]">
        <Image
          src={photos.finitions.src}
          alt={photos.finitions.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-graphite/40" aria-hidden />
        <Container className="relative pb-12 text-blanc sm:pb-16">
          <p className="max-w-xl heading text-5xl leading-[1.05] sm:text-7xl">
            Votre idée,
            <br />
            mes mains
          </p>
          <ButtonLink href="/sur-mesure" variant="light" className="mt-8">
            Imaginer un sur-mesure
          </ButtonLink>
        </Container>
      </section>

      {/* Instagram: title and link above a row of photos. */}
      <section className="overflow-hidden pt-14 lg:pt-20">
        <Container>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <h2 className="text-2xl sm:text-[2.1rem]">Suivez l’atelier sur Instagram</h2>
            {settings?.instagram ? (
              <ButtonLink
                href={settings.instagram}
                variant="ghost"
                target="_blank"
                rel="noopener noreferrer"
                className="order-first gap-2 self-start sm:order-none sm:mb-2 sm:self-auto"
              >
                <InstagramIcon className="size-4" />
                @delphinemcreations
              </ButtonLink>
            ) : (
              <p className="order-first text-xs text-gris sm:order-none sm:mb-3">
                [LIEN À FOURNIR]
              </p>
            )}
          </div>
          {/* Static photos picked by the client (no Instagram API). */}
          <Stagger as="ul" className="mt-4 grid grid-cols-4 gap-2 sm:mt-6 sm:gap-4">
            {instagramPhotos.map((p) => (
              <StaggerItem
                as="li"
                key={p.src}
                className="relative aspect-square overflow-hidden bg-rose-pale"
              >
                <Image src={p.src} alt={p.alt} fill sizes="25vw" className="object-cover" />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>
    </>
  );
}
