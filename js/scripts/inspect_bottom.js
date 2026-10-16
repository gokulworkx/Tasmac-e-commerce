const sharp = require('sharp');

async function inspectBottom() {
  const { data, info } = await sharp('raw_bottles/MOR-XO-750.jpg').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  console.log('--- Inspecting base along x = 100, 150, 200, 250, 300, 350, 400 ---');
  for (const x of [100, 150, 200, 250, 300, 350, 400]) {
    for (let y = 695; y <= 708; y++) {
      const idx = (y * w + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      if (r < 15 && g < 15 && b < 30) {
        console.log(`x=${x} base ends at y=${y-1}: [${r}, ${g}, ${b}] at y=${y}`);
        break;
      }
    }
  }
}

inspectBottom();

