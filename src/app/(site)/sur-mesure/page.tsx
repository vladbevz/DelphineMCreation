import type { Metadata } from 'next';
import { CustomRequestForm } from '@/components/forms/CustomRequestForm';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'Sur-mesure',
  description:
    'Un bijou en cuir imaginé pour vous : couleurs, forme, occasion. Demande de création sur-mesure.',
  alternates: { canonical: '/sur-mesure' },
};

const steps = [
  { title: 'Votre demande', text: '[TEXTE À FOURNIR]' },
  { title: 'Échange et devis', text: '[TEXTE À FOURNIR]' },
  { title: 'Création', text: '[TEXTE À FOURNIR]' },
  { title: 'Livraison', text: '[TEXTE À FOURNIR]' },
];

export default function SurMesurePage() {
  return (
    <>
      <PageHeader
        size="medium"
        label="Sur-mesure"
        title={
          <>
            Un bijou imaginé <em>pour vous</em>
          </>
        }
        intro={<p>[TEXTE À FOURNIR]</p>}
      />

      <section className="bg-cream py-12">
        <Container size="medium">
          <SectionHeading label="Comment ça marche" title="En quatre étapes" className="mb-8" />
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title}>
                <p className="font-display text-3xl text-cognac italic">{i + 1}</p>
                <h3 className="mt-1 text-xl">{step.title}</h3>
                <p className="mt-1 text-sm text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <Container size="narrow" className="py-14">
        <SectionHeading
          align="center"
          label="Votre projet"
          title={
            <>
              Parlez-moi de votre <em>idée</em>
            </>
          }
        />
        <div className="mt-8">
          <CustomRequestForm />
        </div>
      </Container>
    </>
  );
}
