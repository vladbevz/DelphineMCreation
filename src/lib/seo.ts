// Search-facing copy: titles, descriptions, category intros and the FAQ. Built only from facts
// Delphine gave (her texts, her charte graphique). Draft wording to validate with her
// (docs/LAUNCH-CHECKLIST.md). Pure data: safe on the client and the server.

import type { Category } from './catalog';
import type { Delays } from './delivery';

export const seo = {
  home: {
    title: 'Bijoux en cuir faits main, légers et colorés',
    description:
      'Boucles d’oreilles, colliers et bracelets en cuir, découpés et assemblés à la main à Clarensac, près de Nîmes. Colorés, ultra légers, apprêts en acier inoxydable.',
  },
  boutique: {
    title: 'Bijoux en cuir faits main',
    h1: 'Bijoux en cuir faits main',
    description:
      'Toute la boutique Delphine M : boucles d’oreilles, colliers, bracelets et bagues en cuir, faits main dans le Gard. Prêts à partir ou fabriqués pour vous.',
    intro:
      'Chaque bijou est découpé, assemblé et fini à la main dans mon atelier de Clarensac, dans la Vaunage. Des couleurs franches, des imprimés, des éclats, et une légèreté qui surprend : on oublie qu’on les porte.',
  },
  atelier: {
    title: 'L’atelier : bijoux en cuir faits main dans la Vaunage',
    description:
      'De Bogotá à Clarensac : l’histoire de Delphine et la fabrication, à la main, de ses bijoux en cuir. Choix du cuir, découpe, assemblage, finitions.',
  },
  surMesure: {
    title: 'Bijou en cuir sur-mesure',
    description:
      'Une couleur précise, des boucles sur clips, un collier assorti à vos boucles préférées : décrivez votre idée, Delphine fabrique votre bijou en cuir à la main.',
  },
  entretien: {
    title: 'Entretien des bijoux en cuir',
    description:
      'Eau, parfum, rangement : les bons gestes pour garder vos bijoux en cuir beaux longtemps.',
  },
  contact: {
    title: 'Contact',
    description:
      'Une question sur un bijou, une commande ou une création sur-mesure ? Écrivez à Delphine, créatrice de bijoux en cuir à Clarensac (Gard).',
  },
};

/** Boutique filtered by category: its own H1, intro and meta (indexable landing pages). */
export const categorySeo: Record<Category, { h1: string; description: string; intro: string }> = {
  'boucles-d-oreilles': {
    h1: 'Boucles d’oreilles en cuir',
    description:
      'Boucles d’oreilles en cuir faites main, colorées et ultra légères, apprêts en acier inoxydable hypoallergénique. Fabriquées à Clarensac, près de Nîmes.',
    intro:
      'Mon bijou préféré, celui par lequel tout a commencé. Grandes ou discrètes, elles restent si légères qu’on les oublie, et leurs crochets en acier inoxydable sont hypoallergéniques.',
  },
  collier: {
    h1: 'Colliers en cuir',
    description:
      'Colliers en cuir faits main dans le Gard, à assortir à vos boucles d’oreilles. Légers, colorés, fabriqués à Clarensac.',
    intro:
      'Des colliers en cuir découpés et assemblés à la main, légers à porter, à assortir à vos boucles d’oreilles préférées.',
  },
  bracelet: {
    h1: 'Bracelets en cuir',
    description:
      'Bracelets en cuir faits main, colorés et légers, fabriqués à la main à Clarensac (Gard).',
    intro:
      'Des bracelets en cuir faits main, dans les mêmes cuirs colorés que mes boucles d’oreilles.',
  },
  bague: {
    h1: 'Bagues en cuir',
    description: 'Bagues en cuir faites main à Clarensac, dans le Gard. Légères et colorées.',
    intro: 'Des bagues en cuir faites main, légères et colorées.',
  },
  autre: {
    h1: 'Autres créations en cuir',
    description: 'Barrettes, broches et autres créations en cuir faites main à Clarensac (Gard).',
    intro: 'Barrettes, broches et autres petites créations en cuir, toujours faites à la main.',
  },
};

const days = (n: number | null | undefined) =>
  typeof n === 'number' && n > 0
    ? `${n} jour${n > 1 ? 's' : ''} ouvré${n > 1 ? 's' : ''}`
    : '[DÉLAI]';

export type FaqItem = { question: string; answer: string; link?: { href: string; label: string } };

/** Home page FAQ (also FAQPage structured data). Delays come from Réglages. */
export function faq(delays: Delays): FaqItem[] {
  return [
    {
      question: 'Les bijoux en cuir sont-ils lourds à porter ?',
      answer:
        'Non, c’est même leur grande qualité : ils sont jusqu’à dix fois plus légers qu’un bijou classique. Même les grandes boucles d’oreilles se font oublier.',
    },
    {
      question: 'Les boucles d’oreilles conviennent-elles aux oreilles sensibles ?',
      answer:
        'Les apprêts (crochets, anneaux) sont en acier inoxydable, une matière durable et hypoallergénique.',
    },
    {
      question: 'Où sont fabriqués vos bijoux ?',
      answer:
        'Dans mon atelier de Clarensac, dans la Vaunage (Gard), à quelques kilomètres de Nîmes. Chaque bijou est découpé, assemblé et fini à la main.',
      link: { href: '/atelier', label: 'Découvrir l’atelier' },
    },
    {
      question: 'Quel est le délai de livraison ?',
      answer: `Un bijou prêt part sous ${days(delays.shippingDays)}. Un bijou fabriqué pour vous part sous ${days(delays.madeToOrderDays)}. Le délai de chaque bijou est indiqué sur sa fiche et dans le panier.`,
    },
    {
      question: 'Puis-je commander un bijou sur-mesure ?',
      answer:
        'Oui : une autre couleur, des boucles sur clips, un collier assorti… Décrivez votre idée, je vous réponds avec une proposition et un devis.',
      link: { href: '/sur-mesure', label: 'Faire une demande' },
    },
    {
      question: 'Comment entretenir un bijou en cuir ?',
      answer:
        'Le cuir n’aime ni l’eau ni le parfum : mettez vos bijoux en dernier et rangez-les au sec. Tous les conseils sont sur la page dédiée.',
      link: { href: '/entretien', label: 'Entretien du cuir' },
    },
    {
      question: 'Puis-je changer d’avis après ma commande ?',
      answer:
        'Oui, vous disposez de 14 jours après la réception pour vous rétracter, sauf pour les créations sur-mesure.',
      link: { href: '/livraison-retours', label: 'Livraison et retours' },
    },
  ];
}
