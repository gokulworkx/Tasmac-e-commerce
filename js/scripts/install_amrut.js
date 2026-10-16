const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function installAmrut() {
  const target = 'C:/Users/Kasthuri/OneDrive/Desktop/Tasmac e commerce/images/AMRUT-SGL-750.png';
  fs.copyFileSync('test_amrut_fusion_full.png', target);
  console.log('Installed AMRUT-SGL-750.png');

  const meta = await sharp(target).metadata();
  console.log('AMRUT-SGL-750 in images/:', meta.width, 'x', meta.height, 'alpha:', meta.hasAlpha);
}

installAmrut().catch(console.error);

