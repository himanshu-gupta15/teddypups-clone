// Resizes source photos to web-sized WebP files named by media id.
// usage: node scripts/optimise-media.mjs <source-dir> <map.json {id: "/media/..."}>
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const [sourceDir, mapFile] = process.argv.slice(2);
if (!sourceDir || !mapFile) throw new Error('usage: optimise-media.mjs <source-dir> <map.json>');
const out = path.resolve('public/media');
await fs.mkdir(out, { recursive: true });

for (const [id, url] of Object.entries(JSON.parse(await fs.readFile(mapFile, 'utf8')))) {
  const source = path.join(sourceDir, url.replace('/media/', ''));
  if (source.endsWith('.mp4')) await fs.copyFile(source, path.join(out, `${id}.mp4`));
  else
    await sharp(source)
      .rotate()
      .resize({ width: 1400, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(out, `${id}.webp`));
}
