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
        label="Sur-mesure"
        title={
          <>
            Un bijou imaginé <em>pour vous</em>
          </>
        }
        intro={<p>[TEXTE À FOURNIR]</p>}
      />

      <section className="bg-cream py-20">
        <Container>
          <SectionHeading label="Comment ça marche" title="En quatre étapes" className="mb-12" />
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title}>
                <p className="font-display text-5xl text-cognac italic">{i + 1}</p>
                <h3 className="mt-3 text-2xl">{step.title}</h3>
                <p className="mt-2 text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <Container className="py-20">
        <SectionHeading
          label="Votre projet"
          title={
            <>
              Parlez-moi de votre <em>idée</em>
            </>
          }
        />
        <div className="mt-10 max-w-2xl">
          <CustomRequestForm />
        </div>
      </Container>
    </>
  );
}
