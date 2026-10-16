const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function inspectImages() {
  const checkList = ['BP-BR-650.png', 'JW-BLK-750.png', 'MH-BR-750.png', 'TEACH-SCO-750.png'];
  const dir = 'C:/Users/Kasthuri/OneDrive/Desktop/Tasmac e commerce/images';
  for (const f of checkList) {
    const p = path.join(dir, f);
    const m = await sharp(p).metadata();
    console.log(f, m.width, m.height);
  }
}

inspectImages();

