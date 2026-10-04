import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
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
      <PageHeader
        label="À l’atelier"
        title={
          <>
            Fait <em>main</em>, dans la Vaunage
          </>
        }
        intro={<p>[TEXTE À FOURNIR]</p>}
      />

      <Container>
        <PhotoPlaceholder
          label="Photo de Delphine à l’atelier"
          className="aspect-[4/5] sm:aspect-[16/9]"
        />
      </Container>

      <section className="py-14 lg:py-20">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionHeading
            label="Son histoire"
            title={
              <>
                Delphine, <em>créatrice</em>
              </>
            }
          />
          <div className="space-y-4 text-lg leading-relaxed text-muted">
            <p>[TEXTE À FOURNIR]</p>
            <p>[TEXTE À FOURNIR]</p>
          </div>
        </Container>
      </section>

      <section className="bg-cream py-14 lg:py-20">
        <Container>
          <SectionHeading
            label="Le savoir-faire"
            title={
              <>
                De la peau au <em>bijou</em>
              </>
            }
            className="mb-14"
          />
          <ol className="grid gap-12 md:grid-cols-3 md:gap-8">
            {steps.map((step) => (
              <li key={step.title}>
                <PhotoPlaceholder
                  label={`Photo : ${step.title.toLowerCase()}`}
                  className="aspect-[4/5]"
                />
                <p className="mt-6 label-caps text-muted">{step.label}</p>
                <h3 className="mt-2 text-3xl">{step.title}</h3>
                <p className="mt-3 text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-14 lg:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <PhotoPlaceholder label="Photo des cuirs" className="aspect-[4/3]" />
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
            <ButtonLink href="/boutique" className="mt-10">
              Découvrir les créations
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
