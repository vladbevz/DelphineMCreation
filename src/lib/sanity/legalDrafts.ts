// Draft legal pages (CGV, mentions légales, livraison et retours, confidentialité).
// Written as a working base, NOT validated: every [À COMPLÉTER …] comes from the client, and the
// texts must be reviewed (lawyer, CCI or chambre des métiers) before launch.
// Shown on the site in offline mode and written to Sanity once by `pnpm seed` (createIfNotExists);
// after that Delphine edits them in the Studio (Pages). Keep in sync with docs/legal/cgv.html.
import type { LegalSlug } from '@/lib/catalog';
import type { BlockContent } from '@/sanity/types';

type Block = BlockContent[number];

/** Seller identity from the company register (INSEE / RNE, checked 19/10/2026). */
export const owner = {
  name: 'Delphine De Meulemeester',
  siren: '104 189 527',
  siret: '104 189 527 00013',
  vatNumber: 'FR61104189527',
  address: '4 rue de la Farigoule, 30870 Clarensac',
  email: 'delphmeulemeester@gmail.com',
  phone: '+33 7 81 36 86 33',
};

/** Splits `**bold**` runs into Portable Text spans. */
function spans(key: string, text: string) {
  return text
    .split(/(\*\*[^*]+\*\*)/)
    .filter(Boolean)
    .map((part, i) => {
      const bold = part.startsWith('**') && part.endsWith('**');
      return {
        _key: `${key}s${i}`,
        _type: 'span' as const,
        text: bold ? part.slice(2, -2) : part,
        marks: bold ? ['strong'] : [],
      };
    });
}

/**
 * Tiny markdown subset → Portable Text: `## ` heading, `### ` subheading, `- ` bullet,
 * anything else a paragraph.
 */
function md(prefix: string, lines: string[]): BlockContent {
  return lines.map((line, i): Block => {
    const key = `${prefix}${i}`;
    if (line.startsWith('## ') || line.startsWith('### ')) {
      const style = line.startsWith('## ') ? 'h2' : 'h3';
      return {
        _key: key,
        _type: 'block',
        style,
        markDefs: [],
        children: spans(key, line.replace(/^#+ /, '')),
      };
    }
    if (line.startsWith('- ')) {
      return {
        _key: key,
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        markDefs: [],
        children: spans(key, line.slice(2)),
      };
    }
    return { _key: key, _type: 'block', style: 'normal', markDefs: [], children: spans(key, line) };
  });
}

const DRAFT =
  '**Projet à valider avant la mise en ligne.** Les mentions entre crochets sont à compléter.';

const cgv = md('cgv', [
  DRAFT,
  'Version en vigueur au [À COMPLÉTER : date de mise en ligne].',
  '## 1. Qui sommes-nous',
  `Le site [À COMPLÉTER : domaine] est édité par ${owner.name}, entrepreneur individuel (EI) exerçant sous le nom commercial « Delphine M. Créations » (ci-après « la créatrice »).`,
  `- SIRET : ${owner.siret} (SIREN ${owner.siren}), immatriculation au Registre national des entreprises (RNE)`,
  `- Adresse : ${owner.address}`,
  `- E-mail : ${owner.email} — Téléphone : ${owner.phone}`,
  '- TVA non applicable, art. 293 B du CGI.',
  '## 2. Champ d’application',
  'Les présentes conditions générales de vente (CGV) s’appliquent à toutes les ventes de bijoux conclues sur le site entre la créatrice et toute personne physique agissant en qualité de consommateur (ci-après « la cliente » ou « le client »).',
  'La cliente les accepte en cochant la case prévue à cet effet avant le paiement. Les CGV applicables sont celles en vigueur à la date de la commande ; elles sont jointes à l’e-mail de confirmation de commande.',
  'Les créations sur-mesure font l’objet d’un échange et d’un devis personnalisés ; elles restent soumises aux présentes CGV, sous réserve des particularités prévues à l’article 9.',
  '## 3. Les bijoux',
  'Les bijoux sont façonnés à la main, en cuir, dans l’atelier de la créatrice. La plupart sont des **pièces uniques**, disponibles en un seul exemplaire.',
  'Chaque fiche présente les caractéristiques essentielles du bijou (matières, couleur du cuir, dimensions, poids). Les photos sont aussi fidèles que possible ; de légères différences de teinte ou d’aspect, liées au travail à la main, à la nature du cuir et à l’affichage de chaque écran, font le charme de chaque pièce et ne constituent pas un défaut.',
  '## 4. Prix',
  'Les prix sont indiqués en euros, toutes taxes comprises (TVA non applicable, art. 293 B du CGI). Les frais de livraison sont indiqués avant la validation du paiement et s’ajoutent au prix des bijoux. Le prix applicable est celui affiché au moment de la commande.',
  '## 5. Commande',
  'Pour commander, la cliente ajoute un ou plusieurs bijoux à son panier, puis est redirigée vers la page de paiement sécurisée de notre prestataire Stripe, où elle indique ses coordonnées, son adresse de livraison et le mode de livraison choisi, accepte les CGV et procède au paiement.',
  'Pendant le paiement, les bijoux du panier sont réservés pour elle pendant environ 30 minutes ; passé ce délai sans paiement, ils redeviennent disponibles.',
  'La vente est conclue dès la confirmation du paiement. Un e-mail de confirmation récapitulant la commande, accompagné des présentes CGV et du formulaire de rétractation, est alors envoyé à la cliente.',
  'La créatrice se réserve le droit d’annuler toute commande d’une cliente avec laquelle existerait un litige relatif au paiement d’une commande antérieure. Si, malgré la réservation, un bijou se révélait indisponible, la cliente en serait informée sans délai et intégralement remboursée.',
  '## 6. Paiement',
  'Le paiement s’effectue en ligne, par carte bancaire ou par les autres moyens proposés sur la page de paiement, via la plateforme sécurisée Stripe. Les données bancaires sont saisies et traitées exclusivement par Stripe : la créatrice n’y a jamais accès. Le montant est débité au moment de la commande.',
  '## 7. Livraison',
  'Les bijoux sont livrés en France métropolitaine, selon les modalités détaillées sur la page « Livraison et retours » :',
  '- **Colissimo suivi :** [À COMPLÉTER : tarif] €, offert à partir de [À COMPLÉTER : seuil] € d’achat.',
  '- **Retrait dans la Vaunage** (gratuit) : [À COMPLÉTER : à conserver ou supprimer, modalités].',
  'Chaque commande est préparée sous [À COMPLÉTER : X] jours ouvrés après le paiement. Un e-mail contenant le numéro de suivi est envoyé à l’expédition.',
  'En tout état de cause, la commande est livrée au plus tard 30 jours après sa conclusion. À défaut, la cliente peut résoudre la vente dans les conditions prévues aux articles L216-6 et suivants du Code de la consommation.',
  'Les risques de perte ou d’endommagement des bijoux sont transférés à la cliente au moment où elle, ou un tiers désigné par elle, en prend physiquement possession.',
  '## 8. Droit de rétractation',
  'La cliente dispose d’un délai de **14 jours** à compter de la réception du bijou pour exercer son droit de rétractation, sans avoir à motiver sa décision.',
  `Pour l’exercer, elle adresse avant l’expiration de ce délai une déclaration dénuée d’ambiguïté par e-mail à ${owner.email} ou par courrier à l’adresse indiquée à l’article 1, en utilisant si elle le souhaite le formulaire de rétractation joint à l’e-mail de confirmation de commande.`,
  'Le bijou est renvoyé au plus tard 14 jours après la communication de sa décision, dans son état d’origine et soigneusement emballé. Les frais de retour sont à la charge de [À COMPLÉTER : la cliente / la créatrice].',
  'La créatrice rembourse la totalité des sommes versées, y compris les frais de livraison initiaux (sur la base du tarif de livraison standard), au plus tard 14 jours après avoir été informée de la décision de rétractation. Elle peut différer le remboursement jusqu’à la réception du bijou ou jusqu’à la preuve de son expédition. Le remboursement est effectué avec le même moyen de paiement que celui utilisé lors de la commande.',
  'La responsabilité de la cliente peut être engagée en cas de dépréciation du bijou résultant de manipulations autres que celles nécessaires pour établir sa nature, ses caractéristiques et son bon fonctionnement.',
  '**Exceptions** (article L221-28 du Code de la consommation) : le droit de rétractation ne s’applique pas aux bijoux confectionnés selon les spécifications de la cliente ou nettement personnalisés (créations sur-mesure). [À DÉCIDER : exclure aussi, pour raisons d’hygiène, les boucles d’oreilles portées ou dont la protection a été retirée après la livraison.]',
  '## 9. Créations sur-mesure',
  'Toute demande de création sur-mesure fait l’objet d’un échange avec la créatrice, puis d’un devis indiquant la description du bijou, son prix et le délai de réalisation. La commande est ferme après acceptation du devis par la cliente [À CONFIRMER : et versement d’un acompte de X %].',
  'S’agissant de bijoux confectionnés selon les spécifications de la cliente, ils ne bénéficient pas du droit de rétractation. Les garanties légales (article 10) s’appliquent.',
  '## 10. Garanties légales',
  'Tous les bijoux bénéficient, indépendamment du droit de rétractation :',
  '- de la **garantie légale de conformité** (articles L217-3 et suivants du Code de la consommation) : la cliente dispose de 2 ans à compter de la délivrance du bijou pour obtenir sa mise en conformité (réparation ou remplacement) ou, à défaut, une réduction du prix ou la résolution de la vente. Pendant ce délai, elle n’a à établir que l’existence du défaut de conformité, et non sa date d’apparition ;',
  '- de la **garantie des vices cachés** (articles 1641 à 1649 du Code civil), pendant 2 ans à compter de la découverte du vice.',
  '[À COMPLÉTER : reproduire mot pour mot l’encadré d’information sur la garantie légale de conformité prévu par l’article D211-2 du Code de la consommation (modèle officiel sur Légifrance).]',
  'L’usure normale du cuir et les marques liées à un usage ou un entretien non conformes aux conseils de la page « Entretien du cuir » ne constituent pas un défaut de conformité.',
  '## 11. Facture',
  'Une facture est adressée par e-mail à toute cliente qui en fait la demande.',
  '## 12. Propriété intellectuelle',
  'Les créations, photos, textes et éléments graphiques du site sont la propriété de la créatrice. Toute reproduction sans autorisation écrite est interdite.',
  '## 13. Données personnelles',
  'Les données collectées lors d’une commande servent à son traitement, à sa livraison et au respect des obligations légales. Leur traitement est décrit dans la page « Confidentialité ».',
  '## 14. Réclamations et médiation',
  `En cas de difficulté, la cliente est invitée à contacter d’abord la créatrice à ${owner.email} afin de trouver une solution amiable.`,
  'À défaut d’accord, elle peut recourir gratuitement au médiateur de la consommation dont relève la créatrice : [À COMPLÉTER : nom, site internet et adresse du médiateur].',
  '## 15. Droit applicable',
  'Les présentes CGV sont soumises au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux français sont compétents dans les conditions prévues par la loi ; la cliente consommatrice peut notamment saisir la juridiction du lieu où elle demeurait au moment de la conclusion du contrat.',
]);

const mentionsLegales = md('ml', [
  DRAFT,
  '## Éditeur du site',
  `Le site [À COMPLÉTER : domaine] est édité par ${owner.name}, entrepreneur individuel (EI), sous le nom commercial « Delphine M. Créations ».`,
  `- SIRET : ${owner.siret} (SIREN ${owner.siren}), immatriculation au Registre national des entreprises (RNE)`,
  `- Adresse : ${owner.address}`,
  `- E-mail : ${owner.email} — Téléphone : ${owner.phone}`,
  `- N° de TVA intracommunautaire : ${owner.vatNumber} — TVA non applicable, art. 293 B du CGI.`,
  `Directrice de la publication : ${owner.name}.`,
  '## Hébergement',
  'Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com.',
  '## Conception et réalisation',
  'Site conçu et développé par AtelierCode.',
  '## Propriété intellectuelle',
  'L’ensemble des contenus du site (créations, photos, textes, logo, éléments graphiques) est la propriété exclusive de la créatrice, sauf mention contraire. Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation écrite préalable est interdite.',
  `Crédits photos : [À COMPLÉTER].`,
  '## Données personnelles et cookies',
  'Le traitement des données personnelles et l’utilisation des cookies sont décrits dans la page « Confidentialité ». Vous pouvez modifier vos choix de cookies à tout moment depuis le lien « Gérer les cookies » en bas de chaque page.',
  '## Conditions de vente',
  'Les ventes réalisées sur le site sont régies par les conditions générales de vente (CGV).',
]);

const livraisonRetours = md('lr', [
  DRAFT,
  '## Où livrons-nous ?',
  'Nous livrons en France métropolitaine. [À COMPLÉTER : livraison vers d’autres pays — bientôt / sur demande.]',
  '## Modes et tarifs de livraison',
  '- **Colissimo suivi :** [À COMPLÉTER : tarif] €, offert dès [À COMPLÉTER : seuil] € d’achat.',
  '- **Retrait dans la Vaunage :** gratuit. [À COMPLÉTER : à conserver ou supprimer, lieu et prise de rendez-vous.]',
  'Les frais de livraison sont toujours indiqués avant le paiement.',
  '## Délais',
  'Chaque bijou est emballé avec soin et expédié sous [À COMPLÉTER : X] jours ouvrés après votre paiement. Dès l’envoi, vous recevez un e-mail avec votre numéro de suivi Colissimo. Comptez ensuite en général 48 h ouvrées pour la livraison (délai indicatif de La Poste).',
  `Si votre colis arrive abîmé, émettez des réserves auprès du transporteur et écrivez-moi rapidement à ${owner.email}, avec une photo si possible.`,
  '## Changer d’avis : 14 jours pour vous rétracter',
  'Vous disposez de **14 jours** à compter de la réception de votre bijou pour changer d’avis, sans avoir à vous justifier.',
  `- Prévenez-moi par e-mail à ${owner.email} (ou avec le formulaire de rétractation joint à votre e-mail de confirmation de commande).`,
  '- Renvoyez le bijou dans les 14 jours suivants, dans son état d’origine et bien protégé, à l’adresse que je vous indiquerai. Les frais de retour sont à la charge de [À COMPLÉTER : la cliente / la créatrice].',
  '- Je vous rembourse la totalité de votre commande, frais de livraison initiaux compris, au plus tard 14 jours après votre demande, avec le même moyen de paiement. Je peux attendre d’avoir reçu le bijou (ou la preuve de son envoi) pour vous rembourser.',
  '**Exceptions :** les créations sur-mesure, faites selon vos souhaits, ne peuvent pas être retournées. [À DÉCIDER : boucles d’oreilles portées, pour raisons d’hygiène.]',
  '## Un défaut ?',
  `Tous les bijoux bénéficient de la garantie légale de conformité (2 ans) et de la garantie des vices cachés. Si votre bijou présente un défaut, écrivez-moi à ${owner.email} avec votre numéro de commande et une photo : nous trouverons ensemble une solution (réparation, échange ou remboursement). Le détail figure dans les CGV.`,
]);

const confidentialite = md('cf', [
  DRAFT,
  'Votre vie privée compte. Cette page explique quelles données sont collectées sur ce site, pourquoi, combien de temps elles sont conservées et comment exercer vos droits (règlement européen « RGPD » et loi Informatique et libertés).',
  '## Responsable du traitement',
  `${owner.name}, entrepreneur individuel, « Delphine M. Créations », ${owner.address}. Contact : ${owner.email}.`,
  '## Quelles données et pourquoi',
  '### Commandes',
  'Nom, e-mail, téléphone, adresse de livraison, bijoux commandés et montant. Ces données servent à traiter et livrer votre commande, à vous envoyer les e-mails de suivi et à respecter nos obligations comptables. **Base légale :** exécution du contrat et obligation légale. Les données de carte bancaire sont saisies directement sur la page de paiement de Stripe : je n’y ai jamais accès.',
  '### Formulaires de contact et de sur-mesure',
  'Nom, e-mail, téléphone (facultatif), votre message et, pour le sur-mesure, les détails de votre projet et vos photos d’inspiration. Ils servent uniquement à vous répondre et à étudier votre demande. **Base légale :** mesures précontractuelles à votre demande et intérêt légitime à répondre aux messages.',
  'Pour protéger les formulaires contre le spam, le service Cloudflare Turnstile vérifie que vous n’êtes pas un robot. **Base légale :** intérêt légitime (sécurité du site).',
  '### Mesure d’audience et publicité (uniquement avec votre accord)',
  '- **Mesure d’audience** (Vercel Web Analytics) : statistiques de visite, pour savoir quelles pages sont consultées.',
  '- **Publicité** (pixel Meta) : mesurer l’efficacité des publicités sur Instagram et Facebook (pages vues, ajout au panier, achat).',
  'Ces outils ne sont chargés qu’après votre accord, donné dans le bandeau cookies. **Base légale :** consentement, que vous pouvez retirer à tout moment via « Gérer les cookies » en bas de chaque page.',
  '### Fonctionnement et sécurité du site',
  'Des journaux techniques et des rapports d’erreur (service Sentry) peuvent contenir votre adresse IP et des informations sur votre navigateur. Ils servent uniquement à corriger les problèmes du site. **Base légale :** intérêt légitime.',
  '## Durées de conservation',
  '[À VALIDER : durées proposées]',
  '- Commandes et factures : 10 ans (obligation comptable).',
  '- Messages de contact et demandes de sur-mesure non concrétisées : 3 ans après le dernier échange.',
  '- Choix de cookies : 6 mois, puis le bandeau vous est de nouveau proposé.',
  '- Rapports d’erreur techniques : [À COMPLÉTER : durée de rétention configurée dans Sentry].',
  '## Qui a accès à vos données',
  'Vos données ne sont jamais vendues. Elles sont accessibles à la créatrice et aux prestataires techniques strictement nécessaires au fonctionnement du site :',
  '- Stripe (paiement) ;',
  '- Sanity (stockage des commandes et des demandes) ;',
  '- Vercel (hébergement et mesure d’audience) ;',
  '- Resend (envoi des e-mails) ;',
  '- Cloudflare (protection anti-spam des formulaires) ;',
  '- Sentry (suivi des erreurs techniques) ;',
  '- Meta (uniquement si vous acceptez les cookies publicitaires) ;',
  '- La Poste / Colissimo (livraison).',
  'Certains de ces prestataires sont situés hors de l’Union européenne, notamment aux États-Unis. Ces transferts sont encadrés par les garanties prévues par le RGPD (décision d’adéquation « Data Privacy Framework » ou clauses contractuelles types de la Commission européenne). [À VÉRIFIER pour chaque prestataire au moment de la mise en ligne.]',
  '## Cookies et stockage local',
  '- **Nécessaires** (toujours actifs) : le contenu de votre panier et votre choix de cookies sont enregistrés dans votre navigateur ; la protection anti-spam des formulaires et la page de paiement Stripe utilisent leurs propres cookies de sécurité.',
  '- **Mesure d’audience** et **publicité** : uniquement avec votre accord (voir ci-dessus).',
  '## Vos droits',
  `Vous pouvez demander l’accès à vos données, leur rectification, leur effacement, la limitation de leur traitement ou leur portabilité, vous opposer à leur traitement, retirer votre consentement à tout moment et définir des directives sur leur sort après votre décès. Écrivez à ${owner.email} ; une réponse vous sera apportée dans un délai d’un mois.`,
  'Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL (cnil.fr).',
  'Dernière mise à jour : [À COMPLÉTER : date].',
]);

export const legalDrafts: Record<LegalSlug, { title: string; body: BlockContent }> = {
  cgv: { title: 'Conditions générales de vente', body: cgv },
  'mentions-legales': { title: 'Mentions légales', body: mentionsLegales },
  'livraison-retours': { title: 'Livraison et retours', body: livraisonRetours },
  confidentialite: { title: 'Politique de confidentialité', body: confidentialite },
};
