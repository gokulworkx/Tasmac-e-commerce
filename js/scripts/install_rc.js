const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function installRC() {
  const target = 'C:/Users/Kasthuri/OneDrive/Desktop/Tasmac e commerce/images/RC-WH-750.png';
  fs.copyFileSync('test_rc_full.png', target);
  console.log('Installed RC-WH-750.png');

  const meta = await sharp(target).metadata();
  console.log('RC-WH-750 in images/:', meta.width, 'x', meta.height, 'alpha:', meta.hasAlpha);
}

installRC().catch(console.error);

