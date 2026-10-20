import type { Metadata } from 'next';
import Image from 'next/image';
import { Blob } from '@/components/brand/Blob';
import { ColorRule } from '@/components/brand/ColorRule';
import { FloatingMotifs } from '@/components/brand/FloatingMotifs';
import { RevealImage, Stagger, StaggerItem } from '@/components/motion/Reveal';
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
    color: 'bg-fuchsia',
    label: 'Étape 1',
    title: 'Le choix du cuir',
    text: 'Dans mes rouleaux de cuir rapportés de Colombie, je choisis chaque pièce pour sa couleur, son imprimé ou son éclat.',
  },
  {
    color: 'bg-mandarine',
    label: 'Étape 2',
    title: 'La découpe',
    text: 'Au bistouri, aux ciseaux ou à l’emporte-pièce, avec un marteau et une presse manuelle.',
  },
  {
    color: 'bg-turquoise',
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
        <div>
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
          <ColorRule className="mt-6" />
        </div>
        {/* Static colour patch behind the photo: the photo is the LCP, nothing animates on load. */}
        <div className="relative">
          {/* Mobile: stays inside the 16 px gutter (no horizontal scroll). */}
          <Blob className="-top-[12%] -right-[3%] h-[60%] w-[45%] text-fuchsia md:-top-[18%] md:-right-[14%] md:h-[70%] md:w-[55%]" />
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
        </div>
      </Container>

      <section className="relative overflow-hidden bg-blush py-14 lg:py-20">
        <FloatingMotifs
          className="hidden lg:block"
          motifs={[
            { className: 'top-10 right-[6%] h-20', color: 'text-turquoise', speed: 1.2 },
            { className: 'bottom-8 left-[5%] h-14', color: 'text-mandarine', speed: 0.8 },
          ]}
        />
        <Container size="medium" className="relative grid gap-6 md:grid-cols-[2fr_3fr] md:gap-12">
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
          <Stagger as="ol" className="grid gap-5 sm:grid-cols-3 sm:gap-6">
            {steps.map((step) => (
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
                  <span aria-hidden className={`block h-1 w-8 ${step.color}`} />
                  <p className="mt-3 label-caps text-muted">{step.label}</p>
                  <h3 className="mt-1 text-xl">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted">{step.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="pb-4">
        <Container size="medium" className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
          <RevealImage className="aspect-[3/2]">
            <PhotoPlaceholder label="Photo des cuirs" className="h-full" />
          </RevealImage>
          <div>
            <SectionHeading
              label="Les matériaux"
              title={
                <>
                  Un cuir venu de <em>Colombie</em>
                </>
              }
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
              Découvrir les créations
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
