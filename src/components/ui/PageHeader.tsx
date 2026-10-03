import type { ReactNode } from 'react';
import { Container } from './Container';
import { SectionHeading } from './SectionHeading';

/** Top of an inner page: small caps label, large title, optional intro. */
export function PageHeader({
  label,
  title,
  intro,
  children,
}: {
  label?: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Container className="pt-12 pb-10 sm:pt-16 sm:pb-14">
      <SectionHeading as="h1" label={label} title={title} intro={intro} />
      {children}
    </Container>
  );
}
