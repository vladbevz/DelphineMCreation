import type { Metadata } from 'next';
import Image from 'next/image';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { photos } from '@/lib/photos';

export const metadata: Metadata = {
  title: 'L’atelier',
  description:
    'De Bogotá à la Vaunage : l’histoire de Delphine et de ses bijoux en cuir façonnés à la main.',
  alternates: { canonical: '/atelier' },
};

// Static layout; texts and photos come from the client. Could move to Sanity later if she
// wants to edit this page herself.
const steps = [
  {
    title: 'Le choix du cuir',
    text: 'Dans mes rouleaux de cuir rapportés de Colombie, je choisis chaque pièce pour sa couleur, son imprimé ou son éclat.',
  },
  {
    title: 'La découpe',
    text: 'Au bistouri, aux ciseaux ou à l’emporte-pièce, avec un marteau et une presse manuelle.',
  },
  {
    title: 'L’assemblage et les finitions',
    text: 'Anneaux, collage minutieux, apprêts en acier inoxydable : chaque détail est posé à la main.',
  },
];

export default function AtelierPage() {
  return (
    <>
      <Container
        size="medium"
        className="grid items-center gap-8 pt-8 pb-14 sm:pt-12 md:grid-cols-2 lg:gap-12 lg:pb-20"
      >
        <SectionHeading
          as="h1"
          title="Fait main, dans la Vaunage"
          intro={
            <p>
              Je m’appelle Delphine. Depuis mon atelier de Clarensac, je crée des bijoux en cuir
              colorés, légers et joyeux, entièrement à la main.
            </p>
          }
        />
        <div className="relative aspect-[4/3] overflow-hidden bg-sand">
          <Image
            src={photos.finitions.src}
            alt={photos.finitions.alt}
            fill
            priority
            sizes="(min-width: 768px) 480px, 100vw"
            className="object-cover"
          />
        </div>
      </Container>

      <section className="bg-blush py-14 lg:py-20">
        <Container size="medium" className="grid gap-6 md:grid-cols-[2fr_3fr] md:gap-12">
          <SectionHeading title="Delphine, créatrice" />
          <div className="space-y-4 leading-relaxed text-muted md:pt-8">
            <p>
              Tout a commencé à Toulouse, quand j’étais petite fille : j’allais acheter perles et
              rubans pour fabriquer mes propres colliers, puis mes boucles d’oreilles — mon bijou
              préféré. Une passion qui ne m’a jamais quittée, au fil d’une vie nomade et de
              plusieurs vies professionnelles.
            </p>
            <p>
              En Colombie, à Bogotá, j’ai rencontré Alex, maroquinière. Un jour, je lui ai montré
              une petite paire de boucles carrées en cuir : en quelques minutes, avec un patron en
              carton et un bistouri, elle découpait notre toute première paire. C’était le 9 mars
              2022. Nous avons appris ensemble, en autodidactes, puis j’ai continué seule. Rentrée
              en France en 2025, je crée désormais sous mon nom, Delphine M.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-14 lg:py-20">
        <Container size="medium">
          <SectionHeading title="De la peau au bijou" className="mb-8" />
          <Stagger as="ol" className="grid gap-5 sm:grid-cols-3 sm:gap-6">
            {steps.map((step, i) => (
              // Mobile: photo beside the text; from sm: photo on top.
              <StaggerItem
                as="li"
                key={step.title}
                className="grid grid-cols-[7rem_1fr] gap-4 sm:block"
              >
                <PhotoPlaceholder
                  label={step.title}
                  className="aspect-square sm:aspect-[4/3] [&>span]:hidden sm:[&>span]:block"
                />
                <div className="sm:mt-4">
                  <h3 className="text-xl">
                    <span className="mr-2 font-display text-muted">{i + 1}.</span>
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{step.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="pb-4">
        <Container size="medium" className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
          <div className="aspect-[3/2] overflow-hidden">
            <PhotoPlaceholder label="Photo des cuirs" className="h-full" />
          </div>
          <div>
            <SectionHeading
              title="Un cuir venu de Colombie"
              intro={
                <p>
                  Je travaille la fleur de cuir, la partie la plus noble de la peau, à la fois
                  résistante et souple. Mes rouleaux de cuir viennent de Colombie, là où tout a
                  commencé. Pour les apprêts, j’utilise l’acier inoxydable : durable et
                  hypoallergénique.
                </p>
              }
            />
            <ButtonLink href="/boutique" className="mt-6">
              Voir la boutique
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
