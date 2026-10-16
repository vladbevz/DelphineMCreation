import type { Metadata } from 'next';
import Image from 'next/image';
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
    label: 'Étape 1',
    title: 'Le choix du cuir',
    text: 'Je choisis chaque chute pour sa couleur, son imprimé ou son éclat. Parfois, il n’en reste qu’un tout petit morceau.',
  },
  {
    label: 'Étape 2',
    title: 'La découpe',
    text: 'Au bistouri, aux ciseaux ou à l’emporte-pièce, avec un marteau et une presse manuelle.',
  },
  {
    label: 'Étape 3',
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
          label="À l’atelier"
          title={
            <>
              Fait <em>main</em>, dans la Vaunage
            </>
          }
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

      <section className="bg-cream py-14 lg:py-20">
        <Container size="medium" className="grid gap-6 md:grid-cols-[2fr_3fr] md:gap-12">
          <SectionHeading
            label="Son histoire"
            title={
              <>
                Delphine, <em>créatrice</em>
              </>
            }
          />
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
          <SectionHeading
            label="Le savoir-faire"
            title={
              <>
                De la peau au <em>bijou</em>
              </>
            }
            className="mb-8"
          />
          <ol className="grid gap-5 sm:grid-cols-3 sm:gap-6">
            {steps.map((step) => (
              // Mobile: photo beside the text; from sm: photo on top.
              <li key={step.title} className="grid grid-cols-[7rem_1fr] gap-4 sm:block">
                <PhotoPlaceholder
                  label={step.title}
                  className="aspect-square sm:aspect-[4/3] [&>span]:hidden sm:[&>span]:block"
                />
                <div className="sm:mt-4">
                  <p className="label-caps text-muted">{step.label}</p>
                  <h3 className="mt-1 text-xl">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="pb-4">
        <Container size="medium" className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
          <PhotoPlaceholder label="Photo des cuirs" className="aspect-[3/2]" />
          <div>
            <SectionHeading
              label="Les matériaux"
              title={
                <>
                  Une <em>seconde vie</em> pour le cuir
                </>
              }
              intro={
                <p>
                  Je travaille la fleur de cuir, la partie la plus noble de la peau, à la fois
                  résistante et souple. Je privilégie les chutes, ces petits morceaux que la
                  maroquinerie n’utilise plus et qui finiraient jetés. Pour les apprêts, j’utilise
                  l’acier inoxydable : durable et hypoallergénique.
                </p>
              }
            />
            <ButtonLink href="/boutique" className="mt-6">
              Découvrir les créations
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
