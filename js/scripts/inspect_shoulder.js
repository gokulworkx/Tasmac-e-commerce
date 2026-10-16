const sharp = require('sharp');

async function inspectShoulder() {
  const { data, info } = await sharp('raw_bottles/MOR-XO-750.jpg').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  for (let y = 445; y <= 520; y += 10) {
    let edgeX = 402;
    for (let x = 400; x <= 490; x++) {
      const idx = (y * w + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      // Cathedral arch has r > b + 15 or (r > 60 && g > 55 && b < 70)
      if (b > r && (b > 50 || b > g)) {
        edgeX = x;
      }
    }
    console.log(`y=${y}: edgeX = ${edgeX}`);
  }
}

inspectShoulder();

