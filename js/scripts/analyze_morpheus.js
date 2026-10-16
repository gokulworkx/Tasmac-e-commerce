const sharp = require('sharp');
const fs = require('fs');

async function analyzeMorpheus() {
  const { data, info } = await sharp('raw_bottles/MOR-XO-750.jpg').raw().toBuffer({ resolveWithObject: true });
  const w = info.width; // 574
  const h = info.height; // 779

  console.log('Morpheus raw:', w, h);

  // Let's sample along vertical line x = 200 (through canister)
  // and x = 400 (through bottle)
  // and sample the background at (50, 50), (200, 100), (450, 100), (50, 500), (550, 500), (300, 750)
  const getP = (x, y) => {
    const idx = (y * w + x) * 3;
    return [data[idx], data[idx + 1], data[idx + 2]];
  };

  console.log('Cathedral top left (50, 50):', getP(50, 50));
  console.log('Cathedral arch left of canister (50, 450):', getP(50, 450));
  console.log('Cathedral arch right of bottle (520, 550):', getP(520, 550));
  console.log('Floor bottom left (50, 750):', getP(50, 750));
  console.log('Floor bottom center (280, 760):', getP(280, 760));

  console.log('Canister top lid (250, 345):', getP(250, 345));
  console.log('Canister body (250, 500):', getP(250, 500));
  console.log('Bottle cap (380, 420):', getP(380, 420));
  console.log('Bottle body (380, 600):', getP(380, 600));
  console.log('Bottle base (380, 700):', getP(380, 700));
}

analyzeMorpheus();

