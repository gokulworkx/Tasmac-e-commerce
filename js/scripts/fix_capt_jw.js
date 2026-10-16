const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targetDir = path.join('C:', 'Users', 'Kasthuri', 'OneDrive', 'Desktop', 'Tasmac e commerce', 'images');

async function download(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  return Buffer.from(await res.arrayBuffer());
}

async function run() {
  // Captain Morgan
  try {
    const captBuf = await download('https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Captain_Morgan_Rum_-_Bottle.png/500px-Captain_Morgan_Rum_-_Bottle.png');
    await sharp(captBuf).png().toFile(path.join(targetDir, 'CAPT-MORG-750.png'));
    console.log('Saved CAPT-MORG-750.png');
  } catch (e) { console.error('Captain Morgan error:', e.message); }

  // Johnnie Walker Black Label
  try {
    const jwBuf = await download('https://banner2.cleanpng.com/20180624/par/aazmagjoe.webp');
    await sharp(jwBuf).png().toFile(path.join(targetDir, 'JW-BLK-750.png'));
    console.log('Saved JW-BLK-750.png');
  } catch (e) { console.error('JW error:', e.message); }
}

run();

