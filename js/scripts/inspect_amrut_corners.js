const sharp = require('sharp');

async function inspectCorners() {
  const { data, info } = await sharp('raw_bottles/AMRUT-SGL-750.jpg').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  const getP = (x, y) => {
    const idx = (y * w + x) * 3;
    return [data[idx], data[idx + 1], data[idx + 2]];
  };

  console.log('Top-left (0,0):', getP(0, 0));
  console.log('Top-right (w-1,0):', getP(w - 1, 0));
  console.log('Bottom-left (0,h-1):', getP(0, h - 1));
  console.log('Bottom-right (w-1,h-1):', getP(w - 1, h - 1));
}

inspectCorners();

