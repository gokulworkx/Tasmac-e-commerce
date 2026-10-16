const sharp = require('sharp');
const fs = require('fs');

async function inspectEdges() {
  const { data, info } = await sharp('raw_bottles/MOR-XO-750.jpg').raw().toBuffer({ resolveWithObject: true });
  const w = info.width; // 574
  const h = info.height; // 779

  // Let's inspect along y = 500 across x from 0 to 574
  // Canister left edge is around x = 90-100
  console.log('--- Scanning horizontal line y = 500 across x = 70 to 130 ---');
  for (let x = 75; x <= 120; x += 3) {
    const idx = (500 * w + x) * 3;
    console.log(`x=${x}: [${data[idx]}, ${data[idx+1]}, ${data[idx+2]}]`);
  }

  // Scanning canister top lid along x = 250 across y = 330 to 365
  console.log('--- Scanning vertical line x = 250 across y = 330 to 365 ---');
  for (let y = 330; y <= 365; y += 3) {
    const idx = (y * w + 250) * 3;
    console.log(`y=${y}: [${data[idx]}, ${data[idx+1]}, ${data[idx+2]}]`);
  }

  // Scanning right edge of bottle along y = 550 across x = 460 to 510
  console.log('--- Scanning horizontal line y = 550 across x = 460 to 510 ---');
  for (let x = 460; x <= 510; x += 3) {
    const idx = (550 * w + x) * 3;
    console.log(`x=${x}: [${data[idx]}, ${data[idx+1]}, ${data[idx+2]}]`);
  }

  // Scanning bottom base of bottle along x = 380 across y = 685 to 720
  console.log('--- Scanning vertical line x = 380 across y = 685 to 720 ---');
  for (let y = 685; y <= 720; y += 3) {
    const idx = (y * w + 380) * 3;
    console.log(`y=${y}: [${data[idx]}, ${data[idx+1]}, ${data[idx+2]}]`);
  }
}

inspectEdges();

