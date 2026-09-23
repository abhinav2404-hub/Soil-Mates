import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function packageZip() {
  const zip = new JSZip();

  function addFolder(dirPath, zipFolder) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (
        entry.name === 'node_modules' ||
        entry.name === '.git' ||
        entry.name === 'dist' ||
        entry.name === 'downloads'
      ) {
        continue;
      }
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        const subFolder = zipFolder.folder(entry.name);
        addFolder(fullPath, subFolder);
      } else {
        const fileData = fs.readFileSync(fullPath);
        zipFolder.file(entry.name, fileData);
      }
    }
  }

  console.log('Packaging Soil Mates Android & PWA Mobile Project...');
  addFolder('.', zip);

  const outDir = path.resolve('public/downloads');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outPath = path.join(outDir, 'soil-mates-android-package.zip');
  const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(outPath, buffer);
  console.log(`Created downloadable package at: ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

packageZip().catch((err) => {
  console.error('Error packaging:', err);
});
