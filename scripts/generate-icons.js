import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgPath = path.resolve('public/icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generate() {
  const sizes = [
    { name: 'pwa-192x192.png', size: 192 },
    { name: 'pwa-512x512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'favicon.png', size: 64 },
  ];

  for (const { name, size } of sizes) {
    const outPath = path.resolve('public', name);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outPath);
    console.log(`Generated ${name} (${size}x${size})`);
  }

  // Maskable icon with 15% safe padding
  const maskablePath = path.resolve('public/pwa-maskable-512x512.png');
  const innerSize = Math.round(512 * 0.75); // 384px with padding
  const innerBuffer = await sharp(svgBuffer).resize(innerSize, innerSize).png().toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 45, g: 90, b: 39, alpha: 1 } // #2D5A27 Soil Green
    }
  })
    .composite([{ input: innerBuffer, gravity: 'center' }])
    .png()
    .toFile(maskablePath);

  console.log('Generated pwa-maskable-512x512.png with safe zone padding');
}

generate().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
