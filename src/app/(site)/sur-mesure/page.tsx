import type { Metadata } from 'next';
import { CustomRequestForm } from '@/components/forms/CustomRequestForm';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
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
  {
    title: 'Votre demande',
    text: 'Décrivez votre envie avec le formulaire ci-dessous : couleurs, type de bijou, occasion. Une photo d’inspiration aide toujours.',
  },
  {
    title: 'Échange et devis',
    // TODO(client): response time.
    text: 'Je vous réponds sous [X] jours pour affiner l’idée ensemble et vous proposer un prix.',
  },
  {
    title: 'Création',
    text: 'Une fois votre accord donné, je découpe et assemble votre bijou à la main dans mon atelier.',
  },
  {
    title: 'Livraison',
    text: 'Votre bijou part par la poste ou vous attend à l’atelier, dans la Vaunage.',
  },
];

export default function SurMesurePage() {
  return (
    <>
      <PageHeader
        size="medium"
        title="Un bijou imaginé pour vous"
        intro={
          <p>
            Une couleur précise, des boucles sur clips parce que vos oreilles ne sont pas percées,
            un collier assorti à vos boucles préférées, un cadeau qui ne ressemble à aucun autre…
            Racontez-moi votre idée, je la façonne pour vous.
          </p>
        }
      />

      <section className="bg-blush py-12">
        <Container size="medium">
          <SectionHeading title="Comment ça marche" className="mb-8" />
          <Stagger as="ol" className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
            {steps.map((step, i) => (
              <StaggerItem as="li" key={step.title} className="border-t border-espresso/20 pt-4">
                <h3 className="text-xl">
                  <span className="mr-2 font-display text-muted">{i + 1}.</span>
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-muted">{step.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="py-14">
        <Container size="narrow">
          <SectionHeading title="Parlez-moi de votre idée" />
          <div className="mt-8">
            <CustomRequestForm />
          </div>
        </Container>
      </section>
    </>
  );
}
