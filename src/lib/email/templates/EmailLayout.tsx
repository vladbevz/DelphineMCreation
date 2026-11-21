import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import type { CSSProperties, ReactNode } from 'react';
import { absoluteUrl } from '@/lib/url';

// Charte graphique tokens (CLAUDE.md §3), inlined: e-mail clients ignore external CSS.
export const colors = {
  blanc: '#FFFFFF',
  graphite: '#252626',
  gris: '#5E5F5F',
  rose: '#ED0A90',
  roseTexte: '#C2077A',
  rosePale: '#FDEEF6',
  nuage: '#F5F3F4',
  trait: '#E8E2E5',
};

// Mail clients rarely load web fonts: the site font first, then close system fallbacks.
export const display = "Quicksand, 'Helvetica Neue', Arial, sans-serif";
export const sans = display;

export const text: CSSProperties = {
  fontFamily: sans,
  fontSize: '15px',
  lineHeight: '24px',
  color: colors.graphite,
  margin: '0 0 12px',
};

export const heading: CSSProperties = {
  fontFamily: display,
  fontWeight: 600,
  fontSize: '26px',
  lineHeight: '32px',
  color: colors.graphite,
  margin: '0 0 16px',
};

export const label: CSSProperties = {
  fontFamily: sans,
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: colors.gris,
  margin: '0 0 8px',
};

export function EmailLayout({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: colors.nuage, margin: 0, padding: '24px 0' }}>
        <Container style={{ maxWidth: '560px', padding: '0 20px' }}>
          <Section style={{ paddingBottom: '20px', textAlign: 'center' }}>
            {/* The client's logo as a PNG (mail clients block SVG), white background as in the charte. */}
            <Img
              src={absoluteUrl('/brand/logo-email.png')}
              alt="Delphine M, créations en cuir"
              width="83"
              height="120"
              style={{ margin: '0 auto' }}
            />
          </Section>
          <Hr style={{ border: 'none', borderTop: `2px solid ${colors.rose}`, margin: 0 }} />
          <Section style={{ backgroundColor: colors.blanc, padding: '32px 28px' }}>
            {children}
          </Section>
          <Hr style={{ borderColor: colors.trait, margin: '24px 0 12px' }} />
          <Text style={{ ...text, fontSize: '12px', lineHeight: '18px', color: colors.gris }}>
            Delphine M. Créations · Bijoux en cuir faits main dans la Vaunage (Gard)
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Primary button as on the site: pink pill (rose-texte: white text 5.8:1), small capitals.
export const buttonStyle: CSSProperties = {
  backgroundColor: colors.roseTexte,
  color: colors.blanc,
  borderRadius: '999px',
  padding: '13px 28px',
  fontFamily: sans,
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
};
