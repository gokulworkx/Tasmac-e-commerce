const sharp = require('sharp');

async function inspectCanisterBase() {
  const { data, info } = await sharp('raw_bottles/MOR-XO-750.jpg').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  for (const x of [100, 150, 200]) {
    console.log(`--- x = ${x} ---`);
    for (let y = 690; y <= 710; y += 2) {
      const idx = (y * w + x) * 3;
      console.log(`y=${y}: [${data[idx]}, ${data[idx+1]}, ${data[idx+2]}]`);
    }
  }
}

inspectCanisterBase();

