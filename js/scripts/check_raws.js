const sharp = require('sharp');
const fs = require('fs');

async function test() {
  // Let's copy raw_bottles/MOR-XO-750.jpg and KY-BR-750.webp as png to inspect or view
  await sharp('raw_bottles/MOR-XO-750.jpg').png().toFile('raw_mor_preview.png');
  await sharp('raw_bottles/KY-BR-750.webp').png().toFile('raw_ky_preview.png');
  console.log('Converted previews to raw_mor_preview.png and raw_ky_preview.png');
}

test().catch(console.error);

