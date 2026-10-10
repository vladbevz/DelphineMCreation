import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { Gallery, type GalleryImage } from '@/components/product/Gallery';
import { ProductActions } from '@/components/product/ProductActions';
import { TrackViewContent } from '@/components/product/TrackViewContent';
import { JsonLd } from '@/components/seo/JsonLd';
import { AccordionItem } from '@/components/ui/Accordion';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { RichText } from '@/components/ui/RichText';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { categoryLabel } from '@/lib/catalog';
import { formatPrice } from '@/lib/format';
import { photos } from '@/lib/photos';
import { getProduct, getProducts, getRelatedProducts, getSettings } from '@/lib/sanity/data';
import { urlFor } from '@/lib/sanity/image';
import { site } from '@/lib/site';
import { absoluteUrl } from '@/lib/url';

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return {};
  const image = product.images.find((i) => i.asset);
  const description =
    product.seo?.description ??
    `${product.title}, bijou en cuir fait main${product.leatherColor ? ` (cuir ${product.leatherColor.toLowerCase()})` : ''}. Pièce unique, ${formatPrice(product.price)}.`;
  return {
    title: product.seo?.title ?? product.title,
    description,
    alternates: { canonical: `/boutique/${product.slug}` },
    openGraph: {
      type: 'website',
      title: product.title,
      description,
      images: image
        ? [
            {
              url: urlFor(image).width(1200).height(630).url(),
              width: 1200,
              height: 630,
              alt: image.alt,
            },
          ]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([getProduct(slug), getSettings()]);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

  const images: GalleryImage[] = product.images.map((image) => ({
    key: image._key,
    alt: image.alt,
    src: image.asset ? urlFor(image).width(1200).height(1200).url() : null,
    zoomSrc: image.asset ? urlFor(image).width(2400).fit('max').url() : null,
    lqip: image.lqip,
  }));

  const vacationMessage = settings?.vacationMode?.enabled
    ? settings.vacationMode.message ||
      'La boutique est en pause : les commandes reprendront bientôt.'
    : null;

  const sold = product.status === 'sold';
  const details = [
    { label: 'Catégorie', value: categoryLabel(product.category) },
    { label: 'Cuir', value: product.leatherColor },
    { label: 'Dimensions', value: product.dimensions },
  ].filter((d): d is { label: string; value: string } => Boolean(d.value));

  return (
    <>
      <TrackViewContent id={product._id} title={product.title} price={product.price} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.title,
          sku: product._id,
          category: categoryLabel(product.category),
          color: product.leatherColor ?? undefined,
          material: 'Cuir',
          image: product.images.filter((i) => i.asset).map((i) => urlFor(i).width(1200).url()),
          brand: { '@type': 'Brand', name: site.name },
          offers: {
            '@type': 'Offer',
            price: (product.price / 100).toFixed(2),
            priceCurrency: 'EUR',
            itemCondition: 'https://schema.org/NewCondition',
            availability: sold ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
            url: absoluteUrl(`/boutique/${product.slug}`),
          },
        }}
      />

      <Container size="medium" className="pt-6 sm:pt-12">
        <nav
          aria-label="Fil d’Ariane"
          className="mb-3 text-[0.65rem] tracking-[0.12em] text-muted uppercase"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/boutique" className="hover:text-cognac">
                Boutique
              </Link>
            </li>
            {product.collection && (
              <>
                <li aria-hidden>/</li>
                <li>
                  <Link
                    href={`/collections/${product.collection.slug}`}
                    className="hover:text-cognac"
                  >
                    {product.collection.title}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-espresso">
              {product.title}
            </li>
          </ol>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-14">
          {/* Sized from the viewport height so photo + thumbnails fit on a laptop screen. */}
          <div className="lg:w-[clamp(20rem,calc(100svh-16rem),30rem)]">
            <Gallery images={images} title={product.title} />
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-wrap gap-2">
              {sold ? (
                <Badge tone="espresso">Vendu</Badge>
              ) : (
                product.stock <= 1 && <Badge>Pièce unique</Badge>
              )}
            </div>
            <h1 className="mt-4 font-display text-3xl leading-tight font-light sm:text-[2.6rem]">
              {product.title}
            </h1>
            <p className="mt-2 text-base">{formatPrice(product.price)}</p>

            {details.length > 0 && (
              <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
                {details.map((d) => (
                  <div key={d.label} className="contents">
                    <dt className="self-center label-caps text-muted">{d.label}</dt>
                    <dd>{d.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-6">
              <ProductActions
                productId={product._id}
                title={product.title}
                price={product.price}
                status={product.status}
                vacationMessage={vacationMessage}
              />
            </div>

            <RichText value={product.description} className="mt-8 text-sm" />

            <div className="mt-8 border-t border-espresso/30">
              {product.care && product.care.length > 0 && (
                <AccordionItem title="Entretien">
                  <RichText value={product.care} />
                  <p className="mt-4">
                    <Link
                      href="/entretien"
                      className="underline underline-offset-4 hover:text-cognac"
                    >
                      Tous nos conseils d’entretien du cuir
                    </Link>
                  </p>
                </AccordionItem>
              )}
              <AccordionItem title="Livraison et retours">
                <DeliveryInfo settings={settings} />
              </AccordionItem>
            </div>
          </div>
        </div>
      </Container>

      {/* Brand story: photo / text blocks, alternating. */}
      <section className="mt-16 lg:mt-24">
        <Container size="medium" className="grid md:grid-cols-2">
          <div className="relative aspect-[4/3] bg-sand md:aspect-square">
            <Image
              src={photos.atelierMains.src}
              alt={photos.atelierMains.alt}
              fill
              sizes="(min-width: 768px) 460px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center py-8 md:px-10 lg:px-14">
            <SectionHeading
              title={
                <>
                  <em>Une création</em> faite main
                </>
              }
              intro={<p>[TEXTE À FOURNIR]</p>}
            />
            <ButtonLink href="/atelier" variant="ghost" className="mt-6 self-start">
              Découvrir l’atelier
            </ButtonLink>
          </div>
          <div className="order-last flex flex-col justify-center py-8 md:order-none md:px-10 lg:px-14">
            <SectionHeading
              title={
                <>
                  <em>Votre bijou</em> sur-mesure
                </>
              }
              intro={<p>[TEXTE À FOURNIR]</p>}
            />
            <ButtonLink href="/sur-mesure" variant="ghost" className="mt-6 self-start">
              Faire une demande
            </ButtonLink>
          </div>
          <div className="relative aspect-[4/3] bg-sand md:aspect-square">
            <Image
              src={photos.presentoir.src}
              alt={photos.presentoir.alt}
              fill
              sizes="(min-width: 768px) 460px, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="mt-16 lg:mt-24">
          <Container>
            <SectionHeading
              align="center"
              title={
                <>
                  Vous aimerez <em>aussi</em>
                </>
              }
              className="mb-10"
            />
            <ProductGrid products={related} />
          </Container>
        </section>
      )}
    </>
  );
}

function DeliveryInfo({ settings }: { settings: Awaited<ReturnType<typeof getSettings>> }) {
  const colissimo = settings?.colissimoPrice;
  const threshold = settings?.freeShippingThreshold;
  return (
    <div className="space-y-3">
      <p>
        Envoi en Colissimo en France métropolitaine
        {typeof colissimo === 'number' ? ` : ${formatPrice(colissimo)}` : ' : [PRIX]'}
        {typeof threshold === 'number' && `, offert dès ${formatPrice(threshold)} d’achat`}.
      </p>
      {settings?.pickupEnabled && <p>Retrait possible dans la Vaunage (gratuit).</p>}
      <p>[TEXTE À FOURNIR : délais d’expédition et conditions de retour]</p>
      <p>
        <Link href="/livraison-retours" className="underline underline-offset-4 hover:text-cognac">
          Livraison et retours en détail
        </Link>
      </p>
    </div>
  );
}
