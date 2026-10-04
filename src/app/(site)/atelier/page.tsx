import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'L’atelier',
  description:
    'L’histoire de Delphine et de ses bijoux en cuir, façonnés à la main dans la Vaunage.',
  alternates: { canonical: '/atelier' },
};

// Static layout; texts and photos come from the client. Could move to Sanity later if she
// wants to edit this page herself.
const steps = [
  { label: 'Étape 1', title: 'Le choix du cuir', text: '[TEXTE À FOURNIR]' },
  { label: 'Étape 2', title: 'La découpe', text: '[TEXTE À FOURNIR]' },
  { label: 'Étape 3', title: 'La couture et les finitions', text: '[TEXTE À FOURNIR]' },
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
          intro={<p>[TEXTE À FOURNIR]</p>}
        />
        <PhotoPlaceholder label="Photo de Delphine à l’atelier" className="aspect-[4/3]" />
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
            <p>[TEXTE À FOURNIR]</p>
            <p>[TEXTE À FOURNIR]</p>
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
                  Un cuir <em>sélectionné</em>
                </>
              }
              intro={<p>[TEXTE À FOURNIR]</p>}
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
