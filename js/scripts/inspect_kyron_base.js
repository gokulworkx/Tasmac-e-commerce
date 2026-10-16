const sharp = require('sharp');

async function inspectKyronBase() {
  const { data, info } = await sharp('raw_bottles/KY-BR-750.webp').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  console.log('Inspecting Kyron base:');
  // Box right base: x = 520 to 590, y = 380 to 450
  for (let y = 400; y <= 450; y += 5) {
    const idx = (y * w + 550) * 3;
    console.log(`Box base x=550 y=${y}: [${data[idx]}, ${data[idx+1]}, ${data[idx+2]}]`);
  }

  // Bottle base: x = 250 to 350, y = 440 to 490
  for (let y = 440; y <= 490; y += 5) {
    const idx = (y * w + 300) * 3;
    console.log(`Bottle base x=300 y=${y}: [${data[idx]}, ${data[idx+1]}, ${data[idx+2]}]`);
  }
}

inspectKyronBase();

