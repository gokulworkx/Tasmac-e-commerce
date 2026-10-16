const sharp = require('sharp');

async function inspectLowerRight() {
  const { data, info } = await sharp('raw_bottles/MOR-XO-750.jpg').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  console.log('Inspecting lower right bottle edge:');
  for (let y = 580; y <= 703; y += 15) {
    console.log(`--- y = ${y} ---`);
    for (let x = 410; x <= 490; x += 5) {
      const idx = (y * w + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      // Check bottle vs background
      console.log(`x=${x}: [${r}, ${g}, ${b}]`);
    }
  }
}

inspectLowerRight();

