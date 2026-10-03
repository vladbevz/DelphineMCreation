import { Button, Text } from '@react-email/components';
import { buttonStyle, EmailLayout, heading, label, text } from './EmailLayout';

export function colissimoTrackingUrl(trackingNumber: string) {
  return `https://www.laposte.fr/outils/suivre-vos-envois?code=${encodeURIComponent(trackingNumber)}`;
}

/** To the customer, when Delphine marks the order as shipped in the Studio. */
export function ShippedEmail({
  number,
  customerName,
  trackingNumber,
}: {
  number: string;
  customerName?: string | null;
  trackingNumber: string;
}) {
  const firstName = customerName?.split(' ')[0];
  return (
    <EmailLayout preview={`Votre colis ${number} est parti`}>
      <Text style={label}>Commande {number}</Text>
      <Text style={heading}>Votre colis est parti{firstName ? `, ${firstName}` : ''} !</Text>
      <Text style={text}>
        Votre bijou a quitté l’atelier. Vous pouvez suivre son trajet avec le numéro Colissimo :
      </Text>
      <Text style={{ ...text, fontSize: '18px', letterSpacing: '0.05em' }}>{trackingNumber}</Text>
      <Button
        href={colissimoTrackingUrl(trackingNumber)}
        style={{ ...buttonStyle, margin: '8px 0 20px' }}
      >
        Suivre mon colis
      </Button>
      <Text style={text}>[TEXTE À FOURNIR : conseils d’entretien, signature]</Text>
    </EmailLayout>
  );
}
