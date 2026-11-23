import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { InstagramIcon } from '@/components/brand/InstagramIcon';
import { TrustStrip } from '@/components/home/TrustStrip';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardPlaceholder } from '@/components/product/ProductCardPlaceholder';
import { JsonLd } from '@/components/seo/JsonLd';
import { AccordionItem } from '@/components/ui/Accordion';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { categories, categoryFilterLabels } from '@/lib/catalog';
import { photos } from '@/lib/photos';
import { getLatestProducts, getProducts, getSettings } from '@/lib/sanity/data';
import { urlFor } from '@/lib/sanity/image';
import { faq, seo } from '@/lib/seo';
import { site } from '@/lib/site';
import { absoluteUrl } from '@/lib/url';

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: `${seo.home.title} | ${site.name}` },
  description: seo.home.description,
  alternates: { canonical: '/' },
};

const instagramPhotos = [
  photos.presentoir,
  photos.finitions,
  photos.bouclesLiege,
  photos.atelierMains,
];

const promises = [
  {
    title: 'Fait main',
    text: 'Découpé, assemblé et fini à la main, de la peau au bijou.',
  },
  {
    title: 'Ultra léger',
    text: 'Jusqu’à dix fois plus léger qu’un bijou classique : on oublie qu’on le porte.',
  },
  {
    title: 'Acier inoxydable',
    text: 'Crochets et anneaux durables et hypoallergéniques.',
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
  const questions = faq({
    shippingDays: settings?.shippingDays,
    madeToOrderDays: settings?.madeToOrderDays,
  });

  // Every category with pieces, its count and newest piece (thumbnail).
  const categoryRows = categories
    .map((c) => {
      const pieces = all.filter((p) => p.category === c.value);
      return { ...c, count: pieces.length, product: pieces[0] };
    })
    .filter((c) => c.count > 0);

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
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: questions.map((q) => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: { '@type': 'Answer', text: q.answer },
          })),
        }}
      />

      {/* Hero, the one bold moment: a magazine cover in the charte's flash pink. White display
          type is large text (4.2:1 passes 3:1); small text and the button sit on white. */}
      <section className="overflow-hidden bg-rose text-blanc">
        <Container className="grid items-end gap-8 pt-10 pb-12 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12 lg:pt-16 lg:pb-16 xl:grid-cols-[minmax(0,1fr)_26rem]">
          <div>
            <h1 className="text-[clamp(3.5rem,14vw,9.5rem)] leading-[0.95] tracking-[-0.02em]">
              Bijoux en cuir faits main, si légers qu’on les oublie
            </h1>
            <ButtonLink href="/boutique" variant="inverse" className="mt-8 lg:mt-10">
              Découvrir la boutique
            </ButtonLink>
          </div>
          {/* A presentation card, slightly tilted, as the earrings sit on their cards. */}
          <div className="mx-auto w-[min(78%,20rem)] rotate-[2.5deg] bg-blanc p-2.5 pb-10 sm:p-3 sm:pb-12 lg:w-full">
            <div className="relative aspect-[4/5] overflow-hidden bg-nuage">
              <Image
                src={photos.bouclesLiege.src}
                alt={photos.bouclesLiege.alt}
                fill
                priority
                sizes="(min-width: 1280px) 26rem, (min-width: 1024px) 22rem, 78vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* What it is, in plain words: the paragraph search engines and new visitors read first. */}
      <section className="border-b border-trait">
        <Container className="grid gap-6 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:py-12">
          <p className="measure font-display text-[1.7rem] leading-[1.15] sm:text-[2.1rem]">
            Boucles d’oreilles, colliers et bracelets en cuir, découpés et assemblés à la main dans
            mon atelier de Clarensac, près de Nîmes.
          </p>
          <TrustStrip freeShippingThreshold={settings?.freeShippingThreshold ?? null} />
        </Container>
      </section>

      {/* New pieces */}
      <section className="pt-14 pb-16 lg:pt-20 lg:pb-24">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-6 lg:mb-10">
            <h2 className="text-[2.6rem] sm:text-6xl">Nouvelle collection</h2>
            <Link
              href="/boutique"
              className="mb-2 hidden shrink-0 text-sm font-medium text-rose-texte underline-offset-4 hover:underline sm:block"
            >
              Voir toute la boutique
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
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
          <ButtonLink href="/boutique" variant="secondary" className="mt-10 sm:hidden">
            Voir toute la boutique
          </ButtonLink>
        </Container>
      </section>

      {/* Categories as large words: easy to tap, and plain links for search engines. */}
      {categoryRows.length > 0 && (
        <section className="bg-rose-pale py-14 lg:py-20">
          <Container>
            <h2 className="mb-6 text-2xl sm:text-3xl">Par envie</h2>
            <ul className="border-t border-graphite/20">
              {categoryRows.map(({ value, count, product }) => (
                <li key={value} className="border-b border-graphite/20">
                  <Link
                    href={`/boutique?categorie=${value}`}
                    className="group flex items-center gap-4 py-4 sm:gap-6 sm:py-5"
                  >
                    <span className="min-w-0 flex-1 font-display text-[2.6rem] leading-none transition-colors group-hover:text-rose-texte sm:text-7xl">
                      {categoryFilterLabels[value]}
                    </span>
                    <span className="shrink-0 text-sm text-gris">
                      {count} création{count > 1 ? 's' : ''}
                    </span>
                    <span className="relative hidden size-16 shrink-0 overflow-hidden bg-nuage sm:block lg:size-20">
                      {product?.image?.asset ? (
                        <Image
                          src={urlFor(product.image).width(160).height(160).url()}
                          alt=""
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <BrandLogo
                          variant="mark"
                          mono
                          className="absolute inset-0 m-auto h-3/5 w-auto text-graphite/15"
                        />
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* Atelier: her own words, set large. */}
      <section className="py-16 lg:py-24">
        <Container className="grid items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden bg-nuage">
            <Image
              src={photos.atelierMains.src}
              alt={photos.atelierMains.alt}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl">Fait main dans la Vaunage</h2>
            <blockquote className="mt-6 font-display text-[2rem] leading-[1.1] sm:text-5xl">
              « Pas de machine, pas d’électricité : juste du temps, de la patience et l’amour du
              travail bien fait. »
            </blockquote>
            <p className="mt-6 measure text-gris">
              Dans mon atelier de Clarensac, je découpe chaque bijou au bistouri, aux ciseaux ou à
              l’emporte-pièce, puis je l’assemble et le finis à la main.
            </p>
            <ButtonLink href="/atelier" variant="secondary" className="mt-8">
              Découvrir l’atelier
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="border-y border-trait py-12 lg:py-14">
        <Container>
          <ul className="grid gap-8 sm:grid-cols-3 sm:gap-10">
            {promises.map((p) => (
              <li key={p.title}>
                <h3 className="text-3xl">{p.title}</h3>
                <p className="mt-2 max-w-xs text-gris">{p.text}</p>
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
          <p className="max-w-2xl heading text-[3.4rem] leading-[0.95] sm:text-8xl">
            Votre idée, mes mains
          </p>
          <p className="mt-4 max-w-md text-blanc">
            Une autre couleur, des boucles sur clips, un collier assorti : je fabrique votre bijou
            sur-mesure.
          </p>
          <ButtonLink href="/sur-mesure" variant="light" className="mt-8">
            Imaginer un sur-mesure
          </ButtonLink>
        </Container>
      </section>

      {/* FAQ: answers to what people ask before buying (also FAQPage structured data). */}
      <section className="py-16 lg:py-24">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
          <h2 className="text-[2.6rem] sm:text-6xl">Vos questions</h2>
          <div className="border-t border-graphite/30">
            {questions.map((q) => (
              <AccordionItem key={q.question} title={q.question}>
                <p className="measure">{q.answer}</p>
                {q.link && (
                  <Link
                    href={q.link.href}
                    className="mt-3 inline-block font-medium text-rose-texte underline underline-offset-4"
                  >
                    {q.link.label}
                  </Link>
                )}
              </AccordionItem>
            ))}
          </div>
        </Container>
      </section>

      {/* Instagram: title and link above a row of photos. */}
      <section className="overflow-hidden pb-4">
        <Container>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <h2 className="text-[2.6rem] sm:text-6xl">Suivez l’atelier</h2>
            {settings?.instagram ? (
              <ButtonLink
                href={settings.instagram}
                variant="ghost"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2 self-start sm:mb-2 sm:self-auto"
              >
                <InstagramIcon className="size-4" />
                @delphinemcreations
              </ButtonLink>
            ) : (
              <p className="text-xs text-gris sm:mb-3">[LIEN À FOURNIR]</p>
            )}
          </div>
          {/* Static photos picked by the client (no Instagram API). */}
          <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
            {instagramPhotos.map((p) => (
              <li key={p.src} className="relative aspect-square overflow-hidden bg-nuage">
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 640px) 25vw, 50vw"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
