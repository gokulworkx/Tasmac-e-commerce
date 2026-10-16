const sharp = require('sharp');
const fs = require('fs');

async function analyzeKyron() {
  const { data, info } = await sharp('raw_bottles/KY-BR-750.webp').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  console.log('Kyron raw size:', w, h);

  // Check 4 corners
  const getP = (x, y) => {
    const idx = (y * w + x) * 3;
    return [data[idx], data[idx + 1], data[idx + 2]];
  };

  console.log('Top-left:', getP(0, 0));
  console.log('Top-right:', getP(w - 1, 0));
  console.log('Bottom-left:', getP(0, h - 1));
  console.log('Bottom-right:', getP(w - 1, h - 1));

  // Let's test a flood fill from (0,0) and borders where pixel is near-white
  // or studio white
}

analyzeKyron();

