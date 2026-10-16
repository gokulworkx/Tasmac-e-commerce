const sharp = require('sharp');
const path = require('path');

async function test() {
  const p = path.join(__dirname, 'raw_bottles', 'BUD-MAG-650.png');
  const { data, info } = await sharp(p).raw().toBuffer({ resolveWithObject: true });
  console.log('Sample top-left 5x5:');
  for (let y = 0; y < 5; y++) {
    const row = [];
    for (let x = 0; x < 5; x++) {
      const idx = (y * info.width + x) * info.channels;
      row.push(`[${data[idx]},${data[idx+1]},${data[idx+2]}]`);
    }
    console.log(row.join(' '));
  }
}

test();

