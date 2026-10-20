import { Hr, Link, Section, Text } from '@react-email/components';
import { colors, label, text } from './EmailLayout';

export type SellerInfo = {
  /** Public URL of the CGV page (the PDF itself is attached to the e-mail when uploaded). */
  cgvUrl: string;
  cgvAttached: boolean;
  email?: string | null;
  postalAddress?: string | null;
};

const small = { ...text, fontSize: '13px', lineHeight: '20px', color: colors.muted };

/**
 * Durable-medium confirmation (Code de la consommation L221-13): CGV and the right of withdrawal,
 * with the model withdrawal form (annexe à l'article R221-1). The form wording is the official
 * model; only the seller block is filled in.
 */
export function WithdrawalInfo({
  orderNumber,
  seller,
}: {
  orderNumber: string;
  seller: SellerInfo;
}) {
  const sellerLines = [
    'Delphine M. Créations',
    seller.postalAddress?.trim() || '[ADRESSE POSTALE À FOURNIR]',
    seller.email || '[E-MAIL À FOURNIR]',
  ];
  return (
    <Section style={{ marginTop: '12px' }}>
      <Hr style={{ borderColor: colors.border, margin: '8px 0 20px' }} />
      <Text style={label}>Conditions générales de vente</Text>
      <Text style={small}>
        {seller.cgvAttached
          ? 'Nos conditions générales de vente, acceptées lors de votre commande, sont jointes à cet e-mail. '
          : ''}
        Vous pouvez aussi les consulter sur{' '}
        <Link href={seller.cgvUrl} style={{ color: colors.fuchsiaDeep }}>
          notre site
        </Link>
        .
      </Text>

      {/* [TEXTE À VALIDER] Summary of the right of withdrawal: to be checked against the CGV. */}
      <Text style={label}>Droit de rétractation</Text>
      <Text style={small}>
        Vous disposez de 14 jours à compter de la réception de votre commande pour vous rétracter,
        sans avoir à vous justifier. Il vous suffit de nous adresser une déclaration sans ambiguïté
        (par exemple par e-mail) ou le formulaire ci-dessous. Les modalités de retour et de
        remboursement sont précisées dans nos CGV.
      </Text>

      <Section style={{ backgroundColor: colors.blush, padding: '16px 18px', margin: '4px 0 0' }}>
        <Text style={{ ...small, color: colors.espresso, fontWeight: 500, margin: '0 0 6px' }}>
          Formulaire de rétractation
        </Text>
        <Text style={{ ...small, color: colors.espresso, margin: '0 0 8px' }}>
          (Veuillez compléter et renvoyer le présent formulaire uniquement si vous souhaitez vous
          rétracter du contrat.)
        </Text>
        <Text style={{ ...small, color: colors.espresso, margin: '0 0 8px' }}>
          À l’attention de :
          {sellerLines.map((line, i) => (
            <span key={i}>
              <br />
              {line}
            </span>
          ))}
        </Text>
        <Text style={{ ...small, color: colors.espresso, margin: '0 0 8px' }}>
          Je/Nous (*) vous notifie/notifions (*) par la présente ma/notre (*) rétractation du
          contrat portant sur la vente du bien ci-dessous :
          <br />
          Commande n° {orderNumber}
          <br />
          Commandé le (*) / reçu le (*) :
          <br />
          Nom du (des) consommateur(s) :
          <br />
          Adresse du (des) consommateur(s) :
          <br />
          Signature du (des) consommateur(s) (uniquement en cas de notification du présent
          formulaire sur papier) :
          <br />
          Date :
        </Text>
        <Text style={{ ...small, color: colors.espresso, margin: 0 }}>
          (*) Rayez la mention inutile.
        </Text>
      </Section>
    </Section>
  );
}
