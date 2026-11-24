import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { photos } from '@/lib/photos';
import { seo } from '@/lib/seo';

export const metadata: Metadata = {
  title: seo.atelier.title,
  description: seo.atelier.description,
  alternates: { canonical: '/atelier' },
};

// Static layout. Facts come from Delphine's own texts; the wording around them is a draft
// to validate with her (docs/LAUNCH-CHECKLIST.md). Could move to Sanity if she wants to
// edit this page herself.
const steps = [
  {
    title: 'Le choix du cuir',
    text: 'Dans mes rouleaux de cuir rapportés de Colombie, je choisis chaque morceau pour sa couleur, son imprimé ou son éclat. Je travaille la fleur de cuir, la partie la plus noble de la peau, souple et résistante à la fois.',
  },
  {
    title: 'Le patron et la découpe',
    text: 'Chaque modèle naît d’un patron en carton, que je reporte sur le cuir. Puis je découpe au bistouri, aux ciseaux ou à l’emporte-pièce, avec un marteau et une presse manuelle.',
  },
  {
    title: 'L’assemblage',
    text: 'Les pièces de cuir sont assemblées une à une : anneaux, collage minutieux… Chaque geste est fait à la main, sans machine.',
  },
  {
    title: 'Les finitions',
    text: 'Je pose les apprêts en acier inoxydable, durables et hypoallergéniques, puis je vérifie chaque bijou avant de l’emballer pour vous.',
  },
];

export default function AtelierPage() {
  return (
    <>
      <Container
        size="medium"
        className="grid grid-cols-1 items-center gap-8 pt-8 pb-14 sm:pt-12 md:grid-cols-2 lg:gap-12 lg:pb-20"
      >
        <SectionHeading
          as="h1"
          title="Fait main, dans la Vaunage"
          intro={
            <>
              <p>
                Je m’appelle Delphine. Dans mon atelier de Clarensac, au cœur de la Vaunage, je crée
                des bijoux en cuir colorés, ultra légers et joyeux, entièrement à la main.
              </p>
              <p className="mt-3">
                Du premier coup de bistouri à la dernière finition, chaque bijou passe entre mes
                mains. Pas de machine, pas d’électricité : juste des outils simples, du temps et de
                la patience.
              </p>
            </>
          }
        />
        <div className="relative aspect-[4/3] overflow-hidden bg-nuage">
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

      <section className="bg-rose-pale py-14 lg:py-20">
        <Container
          size="medium"
          className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_3fr] md:gap-12"
        >
          <SectionHeading title="Delphine, créatrice" />
          <div className="measure space-y-4 leading-relaxed text-gris md:pt-8 md:text-[1.0625rem]">
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
              2022.
            </p>
            <p>
              Nous avons appris ensemble, en autodidactes, puis j’ai continué seule, en gardant près
              de moi mes rouleaux de cuir colombien.
            </p>
            <p>
              Rentrée en France en 2025, j’ai installé mon atelier à Clarensac, dans la Vaunage, et
              je crée désormais sous mon nom : Delphine M. Les boucles d’oreilles restent mon bijou
              préféré — c’est par elles que tout a commencé.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-14 lg:py-20">
        <Container size="medium">
          <SectionHeading
            title="De la peau au bijou"
            intro={<p>Quatre étapes, toutes faites à la main dans mon atelier.</p>}
            className="mb-8"
          />
          <Stagger
            as="ol"
            className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4"
          >
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
                <div className="sm:mt-4 sm:border-t sm:border-graphite/20 sm:pt-4">
                  <h3 className="text-xl">
                    <span className="mr-2 font-display text-gris">{i + 1}.</span>
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-gris">{step.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="bg-rose-pale py-14 lg:py-20">
        <Container
          size="medium"
          className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 lg:gap-12"
        >
          <div className="aspect-[3/2] overflow-hidden">
            <PhotoPlaceholder label="Photo des cuirs" className="h-full" />
          </div>
          <div>
            <SectionHeading
              title="Un cuir venu de Colombie"
              intro={
                <>
                  <p>
                    Mes rouleaux de cuir viennent de Colombie, là où tout a commencé. Je travaille
                    la fleur de cuir, la partie la plus noble de la peau : résistante, souple, et
                    riche de couleurs, d’imprimés et d’éclats que je choisis un à un.
                  </p>
                  <p className="mt-3">
                    Le résultat : des bijoux jusqu’à dix fois plus légers qu’un bijou classique, que
                    l’on oublie qu’on porte. Pour les apprêts, j’utilise l’acier inoxydable, durable
                    et hypoallergénique.
                  </p>
                  <p className="mt-3">
                    Pour qu’ils restent beaux longtemps, suivez mes{' '}
                    <Link
                      href="/entretien"
                      className="text-rose-texte underline underline-offset-4 hover:text-rose-texte"
                    >
                      conseils d’entretien du cuir
                    </Link>
                    .
                  </p>
                </>
              }
            />
          </div>
        </Container>
      </section>

      <section className="py-14 lg:py-20">
        <Container
          size="medium"
          className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 lg:gap-12"
        >
          <div className="md:order-last">
            <div className="relative aspect-[4/3] overflow-hidden bg-nuage md:aspect-[4/5]">
              <Image
                src={photos.atelierMains.src}
                alt={photos.atelierMains.alt}
                fill
                sizes="(min-width: 768px) 460px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div>
            <SectionHeading
              title="Fabriqué pour vous"
              intro={
                <>
                  <p>
                    Tous les bijoux de la boutique peuvent être commandés à tout moment. Si le
                    modèle qui vous plaît n’est pas déjà prêt, je le fabrique pour vous, à la main,
                    dans le même cuir et les mêmes couleurs que sur la photo. Le délai est indiqué
                    sur chaque fiche.
                  </p>
                  <p className="mt-3">
                    Le cuir est une matière naturelle : d’une peau à l’autre, le grain et les
                    nuances changent légèrement. Votre bijou aura toujours sa petite personnalité.
                  </p>
                  <p className="mt-3">
                    Envie d’une autre couleur, de boucles sur clips ou du collier assorti ? C’est le
                    sur-mesure : racontez-moi votre idée.
                  </p>
                </>
              }
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/boutique">Voir la boutique</ButtonLink>
              <ButtonLink href="/sur-mesure" variant="secondary">
                Le sur-mesure
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
