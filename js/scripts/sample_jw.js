const sharp = require('sharp');
const path = require('path');

async function check() {
  const p = path.join('C:', 'Users', 'Kasthuri', 'OneDrive', 'Desktop', 'Tasmac e commerce', 'images', 'JW-BLK-750.png');
  const { data, info } = await sharp(p).raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  // Sample along x=20 from y=0 to 100
  const samples = [];
  for (let y = 0; y < 100; y += 10) {
    const idx = (y * w + 20) * 4;
    samples.push(`y=${y}: [${data[idx]},${data[idx+1]},${data[idx+2]},${data[idx+3]}]`);
  }
  console.log(samples.join('\n'));
}

check();

