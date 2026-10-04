// Resizes the illustrative photos in assets/photos/ into public/images/<name>-<width>.webp.
// The originals (several MB) stay out of public/ so they are never deployed.
// Run after adding or replacing a photo: pnpm images
import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// Keep in sync with LOCAL_WIDTHS in src/lib/sanity/imageLoader.ts.
const WIDTHS = [640, 1024, 1600];
const SOURCE = 'assets/photos';
const TARGET = 'public/images';

await mkdir(TARGET, { recursive: true });
for (const file of await readdir(SOURCE)) {
  if (!/\.(jpe?g|png|webp)$/i.test(file)) continue;
  const name = path.parse(file).name;
  for (const width of WIDTHS) {
    const out = path.join(TARGET, `${name}-${width}.webp`);
    const info = await sharp(path.join(SOURCE, file))
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 72 })
      .toFile(out);
    console.log(`${out}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
  }
}
