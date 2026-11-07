import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const inputImagePath = path.resolve('public/media/drafts/illustration-chr-01-v1.webp');
const outputJpgPath = path.resolve('public/og-image.jpg');
const outputPngPath = path.resolve('public/og-image.png');

async function generateSocialCard() {
  const width = 1200;
  const height = 630;

  // Read base landscape image
  const baseBuffer = await sharp(inputImagePath)
    .resize(width, height, { fit: 'cover', position: 'center' })
    .toBuffer();

  // Create an elegant SVG overlay with branding, title, typography, and vignette
  const svgOverlay = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Dark gradient for contrast -->
        <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0b171a" stop-opacity="0.45"/>
          <stop offset="45%" stop-color="#0b171a" stop-opacity="0.2"/>
          <stop offset="70%" stop-color="#071214" stop-opacity="0.75"/>
          <stop offset="100%" stop-color="#050d0e" stop-opacity="0.95"/>
        </linearGradient>

        <!-- Gold gradient for title accents -->
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#f0d59e"/>
          <stop offset="50%" stop-color="#c99742"/>
          <stop offset="100%" stop-color="#f0d59e"/>
        </linearGradient>

        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.8"/>
        </filter>
      </defs>

      <!-- Gradient overlay -->
      <rect width="${width}" height="${height}" fill="url(#vignette)"/>

      <!-- Decorative fine gold border -->
      <rect x="28" y="28" width="${width - 56}" height="${height - 56}" fill="none" stroke="url(#gold)" stroke-width="1.5" stroke-opacity="0.5"/>
      <rect x="36" y="36" width="${width - 72}" height="${height - 72}" fill="none" stroke="#ffffff" stroke-width="0.5" stroke-opacity="0.2"/>

      <!-- Header badge -->
      <g filter="url(#shadow)" transform="translate(60, 75)">
        <rect width="210" height="34" rx="17" fill="#123a43" fill-opacity="0.9" stroke="url(#gold)" stroke-width="1"/>
        <text x="105" y="22" font-family="'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" letter-spacing="3" fill="#f0d59e" text-anchor="middle">ATLAS INTERACTIF</text>
      </g>

      <!-- Arabic title in top right -->
      <g filter="url(#shadow)" transform="translate(${width - 60}, 85)">
        <text x="0" y="0" font-family="'IBM Plex Sans Arabic', 'Traditional Arabic', serif" font-size="28" font-weight="700" fill="#f5ede0" text-anchor="end" direction="rtl">سِيرَةُ النَّبِيِّ ﷺ</text>
      </g>

      <!-- Bottom Card Content -->
      <g filter="url(#shadow)" transform="translate(60, 410)">
        <!-- Tagline / Subtitle -->
        <text x="0" y="0" font-family="'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" letter-spacing="4" fill="#c99742">BIOGRAPHIE PROPHÉTIQUE &amp; EXPLORATION 3D</text>

        <!-- Main Title -->
        <text x="0" y="55" font-family="'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="54" font-weight="800" fill="#ffffff" letter-spacing="-0.5">Sîra — Un atlas vivant</text>

        <!-- Description -->
        <text x="0" y="98" font-family="'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="400" fill="#e2dcd2">60 monographies bilingues · 120 récits audio · 20 objets 3D interactifs · Corridor de l'Hégire</text>

        <!-- Footer metrics pill -->
        <g transform="translate(0, 125)">
          <rect width="460" height="32" rx="8" fill="#ffffff" fill-opacity="0.1" stroke="#ffffff" stroke-width="0.7" stroke-opacity="0.2"/>
          <text x="20" y="21" font-family="'IBM Plex Sans', sans-serif" font-size="13" font-weight="600" fill="#f0d59e">✨ Expérience immersive FR / AR · Conforme référentiel sunnite</text>
        </g>
      </g>
    </svg>
  `);

  // Composite SVG on base image and export both JPG and PNG
  await sharp(baseBuffer)
    .composite([{ input: svgOverlay, top: 0, left: 0 }])
    .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
    .toFile(outputJpgPath);

  await sharp(baseBuffer)
    .composite([{ input: svgOverlay, top: 0, left: 0 }])
    .png({ compressionLevel: 8 })
    .toFile(outputPngPath);

  console.log(`Generated social cards:`);
  console.log(` - ${outputJpgPath} (${(fs.statSync(outputJpgPath).size / 1024).toFixed(1)} KB)`);
  console.log(` - ${outputPngPath} (${(fs.statSync(outputPngPath).size / 1024).toFixed(1)} KB)`);
}

generateSocialCard().catch((err) => {
  console.error('Failed to generate social card:', err);
  process.exit(1);
});
