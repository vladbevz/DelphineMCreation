import { EarringMotif } from '@/components/brand/EarringMotif';
import { ProductCardPlaceholder } from '@/components/product/ProductCardPlaceholder';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

const promises = [
  { title: 'Pièce unique', text: '[TEXTE À FOURNIR]' },
  { title: 'Cuir sélectionné', text: '[TEXTE À FOURNIR]' },
  { title: 'Fait main', text: '[TEXTE À FOURNIR]' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-8 pb-20 sm:pt-12 lg:pb-28">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
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
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <ButtonLink href="/boutique">Découvrir la boutique</ButtonLink>
              <ButtonLink href="/atelier" variant="ghost">
                L&apos;atelier
              </ButtonLink>
            </div>
          </div>

          {/* Photo placeholder */}
          <div className="order-1 flex aspect-[4/5] items-center justify-center rounded-3xl bg-sand sm:aspect-[5/4] lg:order-2 lg:aspect-[4/5]">
            <EarringMotif className="h-1/2 w-auto text-cognac/70" title="Photo à venir" />
          </div>
        </Container>
      </section>

      {/* New collection */}
      <section className="bg-cream py-20 lg:py-28">
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
          <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <li key={i}>
                <ProductCardPlaceholder />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Promises */}
      <section className="py-20 lg:py-28">
        <Container>
          <ul className="grid gap-12 sm:grid-cols-3 sm:gap-8">
            {promises.map((p) => (
              <li key={p.title} className="text-center">
                <EarringMotif className="mx-auto h-12 w-auto text-olive" />
                <h3 className="mt-6 text-3xl">{p.title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-muted">{p.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Atelier */}
      <section className="pb-4">
        <Container>
          <div className="grid overflow-hidden rounded-3xl bg-espresso text-linen lg:grid-cols-2">
            <div className="flex aspect-[4/3] items-center justify-center bg-sand/15 lg:aspect-auto">
              <EarringMotif className="h-1/3 w-auto text-sand" />
            </div>
            <div className="px-6 py-14 sm:px-12 lg:py-20">
              <p className="mb-4 label-caps text-sand">À l&apos;atelier</p>
              <h2 className="text-4xl sm:text-5xl">
                Fait main dans la <em className="text-sand italic">Vaunage</em>
              </h2>
              <p className="mt-5 leading-relaxed text-sand">[TEXTE À FOURNIR]</p>
              <ButtonLink
                href="/atelier"
                variant="secondary"
                className="mt-10 border-linen text-linen hover:bg-linen hover:text-espresso"
              >
                Découvrir l&apos;atelier
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
