// Static site config until these values move to the Sanity `settings` singleton (stage 1).
export const site = {
  name: 'Delphine M. Créations',
  description: '[TEXTE À FOURNIR]',
  instagramUrl: null as string | null,
  email: null as string | null,
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
