const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function installImages() {
  const targetDir = 'C:/Users/Kasthuri/OneDrive/Desktop/Tasmac e commerce/images';

  fs.copyFileSync('perfect_morpheus_blue.png', path.join(targetDir, 'MOR-XO-750.png'));
  console.log('Installed MOR-XO-750.png');

  fs.copyFileSync('perfect_kyron.png', path.join(targetDir, 'KY-BR-750.png'));
  console.log('Installed KY-BR-750.png');

  const m1 = await sharp(path.join(targetDir, 'MOR-XO-750.png')).metadata();
  console.log('MOR-XO-750 in images/:', m1.width, 'x', m1.height, 'alpha:', m1.hasAlpha);

  const m2 = await sharp(path.join(targetDir, 'KY-BR-750.png')).metadata();
  console.log('KY-BR-750 in images/:', m2.width, 'x', m2.height, 'alpha:', m2.hasAlpha);
}

installImages().catch(console.error);

