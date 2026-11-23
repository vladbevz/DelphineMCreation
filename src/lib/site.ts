// Static brand identity. Editable contacts and links live in the Sanity `settings` singleton.
export const site = {
  name: 'Delphine M. Créations',
  description:
    'Bijoux en cuir faits main à Clarensac (Gard), près de Nîmes : boucles d’oreilles, colliers et bracelets colorés et ultra légers. Sur-mesure possible.',
  locality: 'Clarensac',
  region: 'Gard',
};

export const mainNav = [
  { href: '/boutique', label: 'Boutique' },
  { href: '/atelier', label: "L'atelier" },
  { href: '/sur-mesure', label: 'Sur-mesure' },
  { href: '/entretien', label: 'Entretien du cuir' },
  { href: '/contact', label: 'Contact' },
] as const;

export const legalNav = [
  { href: '/cgv', label: 'Conditions générales de vente' },
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/livraison-retours', label: 'Livraison et retours' },
  { href: '/confidentialite', label: 'Confidentialité' },
] as const;
