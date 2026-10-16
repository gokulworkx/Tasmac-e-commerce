const sharp = require('sharp');

async function inspectNeckEdge() {
  const { data, info } = await sharp('raw_bottles/MOR-XO-750.jpg').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  for (let y = 350; y <= 440; y += 15) {
    console.log(`--- y = ${y} ---`);
    for (let x = 380; x <= 415; x += 3) {
      const idx = (y * w + x) * 3;
      console.log(`x=${x}: [${data[idx]}, ${data[idx+1]}, ${data[idx+2]}]`);
    }
  }
}

inspectNeckEdge();

