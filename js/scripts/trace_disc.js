const sharp = require('sharp');
const fs = require('fs');

async function traceDisc() {
  const { data, info } = await sharp('crop_neck_top.png').raw().toBuffer({ resolveWithObject: true });
  const w = info.width; // 250
  const h = info.height; // 150
  // In crop_neck_top, original x = x_crop + 250, original y = y_crop + 300
  console.log('--- Tracing disc in crop ---');
  for (let yc = 15; yc <= 40; yc += 2) {
    let minXc = 999, maxXc = -1;
    for (let xc = 0; xc < w; xc++) {
      const idx = (yc * w + xc) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      // The blue disc has blue channel higher than red channel
      if (b > r + 8 && b > 40) {
        if (xc < minXc) minXc = xc;
        if (xc > maxXc) maxXc = xc;
      }
    }
    const origY = yc + 300;
    const origMinX = minXc + 250;
    const origMaxX = maxXc + 250;
    console.log(`origY=${origY}: x from ${origMinX} to ${origMaxX} (w=${origMaxX - origMinX + 1})`);
  }
}

traceDisc();

