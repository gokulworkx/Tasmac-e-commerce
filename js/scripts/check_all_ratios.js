const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function checkAll() {
  const imagesDir = 'C:/Users/Kasthuri/OneDrive/Desktop/Tasmac e commerce/images';
  const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.png'));

  console.log(`Checking ${files.length} images in images/...`);
  for (const f of files) {
    const meta = await sharp(path.join(imagesDir, f)).metadata();
    console.log(`${f.padEnd(20)}: ${meta.width}x${meta.height} (ratio: ${(meta.width/meta.height).toFixed(2)})`);
  }
}

checkAll().catch(console.error);

