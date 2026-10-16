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
  try {
    const budBuf = await download('https://banner2.cleanpng.com/20180626/rig/aazvbglq5.webp');
    await sharp(budBuf).png().toFile(path.join(targetDir, 'BUD-MAG-650.png'));
    console.log('Saved BUD-MAG-650.png');
  } catch (e) {
    console.error('Budweiser error:', e.message);
  }

  try {
    const coronaBuf = await download('https://icon2.cleanpng.com/20180612/gui/aa8acsxws.webp');
    await sharp(coronaBuf).png().toFile(path.join(targetDir, 'CORONA-330.png'));
    console.log('Saved CORONA-330.png');
  } catch (e) {
    console.error('Corona error:', e.message);
  }
}

run();

