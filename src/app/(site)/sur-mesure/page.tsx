import type { Metadata } from 'next';
import { FloatingMotifs } from '@/components/brand/FloatingMotifs';
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
    color: 'bg-fuchsia',
    title: 'Votre demande',
    text: 'Décrivez votre envie avec le formulaire ci-dessous : couleurs, type de bijou, occasion. Une photo d’inspiration aide toujours.',
  },
  {
    color: 'bg-mandarine',
    title: 'Échange et devis',
    // TODO(client): response time.
    text: 'Je vous réponds sous [X] jours pour affiner l’idée ensemble et vous proposer un prix.',
  },
  {
    color: 'bg-turquoise',
    title: 'Création',
    text: 'Une fois votre accord donné, je découpe et assemble votre bijou à la main dans mon atelier.',
  },
  {
    color: 'bg-lavande',
    title: 'Livraison',
    text: 'Votre bijou part par la poste ou vous attend à l’atelier, dans la Vaunage.',
  },
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
          <SectionHeading label="Comment ça marche" title="En quatre étapes" className="mb-8" />
          <Stagger as="ol" className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4">
            {steps.map((step, i) => (
              <StaggerItem as="li" key={step.title}>
                {/* Number badge: espresso on the colour (contrast table, CLAUDE.md §3). */}
                <p
                  className={`flex size-11 items-center justify-center rounded-full font-display text-2xl leading-none text-espresso ${step.color}`}
                >
                  {i + 1}
                </p>
                <h3 className="mt-3 text-xl">{step.title}</h3>
                <p className="mt-1 text-sm text-muted">{step.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="relative py-14">
        <FloatingMotifs
          className="hidden lg:block"
          motifs={[
            { className: 'top-24 left-[8%] h-24', color: 'text-fuchsia', speed: 1 },
            { className: 'right-[9%] bottom-40 h-16', color: 'text-soleil', speed: 1.5 },
          ]}
        />
        <Container size="narrow" className="relative">
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
      </section>
    </>
  );
}
