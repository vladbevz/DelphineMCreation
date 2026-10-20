import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import type { CSSProperties, ReactNode } from 'react';

// Brand tokens (CLAUDE.md §3), inlined: e-mail clients ignore external CSS.
export const colors = {
  linen: '#FBF7F1',
  cream: '#F4EDE3',
  sand: '#E3D3BE',
  border: '#D9C8B2',
  cognac: '#9C5A33',
  olive: '#5F6A4B',
  espresso: '#2B1D14',
  muted: '#6B5646',
  fuchsia: '#E0457B',
  fuchsiaDeep: '#B8285F',
  mandarine: '#F28C38',
  soleil: '#F5C542',
  turquoise: '#2BB3B1',
  lavande: '#B79CE8',
  blush: '#FBE3EA',
};

export const serif = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
export const sans = "'Jost', 'Helvetica Neue', Arial, sans-serif";

export const text: CSSProperties = {
  fontFamily: sans,
  fontSize: '15px',
  lineHeight: '24px',
  color: colors.espresso,
  margin: '0 0 12px',
};

// Thin capitals with tracking, as on the site (display-caps).
export const heading: CSSProperties = {
  fontFamily: serif,
  fontWeight: 400,
  fontSize: '28px',
  lineHeight: '34px',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: colors.espresso,
  margin: '0 0 16px',
};

export const label: CSSProperties = {
  fontFamily: sans,
  fontSize: '11px',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: colors.muted,
  margin: '0 0 8px',
};

/** The five joyful colours as solid segments (site: ColorRule). Table cells: safe in Outlook. */
function ColorBar() {
  const segments = [
    colors.fuchsia,
    colors.mandarine,
    colors.soleil,
    colors.turquoise,
    colors.lavande,
  ];
  return (
    <Row>
      {segments.map((color) => (
        <Column
          key={color}
          style={{ backgroundColor: color, height: '4px', fontSize: 0, lineHeight: 0 }}
        >
          &nbsp;
        </Column>
      ))}
    </Row>
  );
}

export function EmailLayout({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: colors.linen, margin: 0, padding: '24px 0' }}>
        <Container style={{ maxWidth: '560px', padding: '0 20px' }}>
          <Section style={{ paddingBottom: '24px' }}>
            {/* Logo as on the site: DELPHINE in thin capitals, M. heavier. */}
            <Text
              style={{
                fontFamily: serif,
                fontSize: '24px',
                lineHeight: '28px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 300,
                margin: 0,
                textAlign: 'center',
                color: colors.espresso,
              }}
            >
              Delphine <span style={{ fontWeight: 600 }}>M.</span>
            </Text>
            <Text
              style={{
                ...label,
                letterSpacing: '0.45em',
                fontSize: '9px',
                margin: '4px 0 0',
                textAlign: 'center',
              }}
            >
              Créations
            </Text>
          </Section>
          <ColorBar />
          <Section style={{ backgroundColor: '#ffffff', padding: '32px 28px' }}>{children}</Section>
          <Hr style={{ borderColor: colors.border, margin: '24px 0 12px' }} />
          <Text style={{ ...text, fontSize: '12px', lineHeight: '18px', color: colors.muted }}>
            Delphine M. Créations · Bijoux en cuir faits main dans la Vaunage (Gard)
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Primary button as on the site: fuchsia-deep pill, linen capitals (5.61:1).
export const buttonStyle: CSSProperties = {
  backgroundColor: colors.fuchsiaDeep,
  color: colors.linen,
  borderRadius: '999px',
  padding: '13px 28px',
  fontFamily: sans,
  fontSize: '12px',
  fontWeight: 500,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
};
