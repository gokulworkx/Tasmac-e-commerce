const sharp = require('sharp');

async function inspectLeftFoot() {
  const { data, info } = await sharp('raw_bottles/KY-BR-750.webp').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  console.log('Inspecting Kyron left foot:');
  for (let y = 445; y <= 475; y += 5) {
    for (let x = 200; x <= 250; x += 10) {
      const idx = (y * w + x) * 3;
      console.log(`x=${x} y=${y}: [${data[idx]}, ${data[idx+1]}, ${data[idx+2]}]`);
    }
  }
}

inspectLeftFoot();

