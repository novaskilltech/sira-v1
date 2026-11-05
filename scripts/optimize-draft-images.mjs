/** Compress project-bound image-generation drafts without changing their provenance or review state. */
import { readdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const folder = path.resolve('public/media/drafts');
for (const name of await readdir(folder)) {
  if (!name.endsWith('.png')) continue;
  const source = path.join(folder, name);
  const destination = source.replace(/\.png$/, '.webp');
  const result = await sharp(source).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 78 }).toFile(destination);
  await unlink(source);
  console.log(`${path.basename(destination)}: ${result.size} bytes`);
}
