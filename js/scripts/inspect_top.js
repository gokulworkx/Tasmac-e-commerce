const sharp = require('sharp');
const fs = require('fs');

async function inspectTop() {
  const { data, info } = await sharp('raw_bottles/MOR-XO-750.jpg').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  console.log('--- Scanning top of canister across various x ---');
  for (let x = 100; x <= 340; x += 20) {
    for (let y = 330; y <= 365; y += 2) {
      const idx = (y * w + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      // Find where blue canister begins (b > r + 20 or b > 60 and r < 30)
      if (b > r + 25 && b > 60) {
        console.log(`x=${x} canister top at y=${y}: [${r}, ${g}, ${b}]`);
        break;
      }
    }
  }

  console.log('--- Scanning bottle cap (x = 340 to 450) ---');
  for (let x = 340; x <= 450; x += 15) {
    for (let y = 405; y <= 430; y += 2) {
      const idx = (y * w + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      // Cap rim has blue/cyan or black with blue
      if (b > r + 15 || (r < 30 && g < 50 && b > 40)) {
        console.log(`x=${x} bottle cap at y=${y}: [${r}, ${g}, ${b}]`);
        break;
      }
    }
  }
}

inspectTop();

