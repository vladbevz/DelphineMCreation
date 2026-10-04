// Illustrative stock photos (Unsplash) until the client's own shoot.
// Sources live in assets/photos/; `pnpm images` writes the resized files to public/images/.
// TODO(client): replace with Delphine's photos before launch (they show other makers' work).

export type Photo = { src: string; alt: string; width: number; height: number };

const photo = (name: string, alt: string, width: number, height: number): Photo => ({
  src: `/images/${name}-1600.webp`,
  alt,
  width,
  height,
});

export const photos = {
  // Kelly Sikkema / Unsplash
  bouclesLiege: photo(
    'boucles-liege',
    'Boucles d’oreilles en cuir suspendues à une planche de liège',
    1600,
    1067,
  ),
  // Artem Maltsev / Unsplash
  atelierMains: photo(
    'atelier-mains',
    'Mains cousant une pièce de cuir sur l’établi de l’atelier',
    1600,
    1067,
  ),
  // Kelly Sikkema / Unsplash
  finitions: photo(
    'finitions',
    'Mains accrochant des boucles d’oreilles en cuir sur leur carte',
    1600,
    1020,
  ),
  // Semiha Weber / Unsplash
  presentoir: photo(
    'presentoir',
    'Présentoir de boucles d’oreilles en cuir de différentes couleurs',
    1600,
    1067,
  ),
};
