const sharp = require('sharp');
const fs = require('fs');

async function buildPerfectKyron() {
  const { data, info } = await sharp('raw_bottles/KY-BR-750.webp').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width; // 801
  const h = info.height; // 531

  const visited = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let qStart = 0;
  let qEnd = 0;

  function push(idx) {
    if (idx >= 0 && idx < w * h && !visited[idx]) {
      visited[idx] = 1;
      queue[qEnd++] = idx;
    }
  }

  // Push all 4 borders
  for (let x = 0; x < w; x++) {
    push(x);
    push((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    push(y * w);
    push(y * w + (w - 1));
  }

  while (qStart < qEnd) {
    const idx = queue[qStart++];
    const x = idx % w;
    const y = (idx / w) | 0;
    const p = idx * 4;

    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];

    // Background conditions:
    // 1. Pure white or studio near-white:
    const isPureWhite = (r >= 235 && g >= 235 && b >= 235);
    const isStudioWhite = (r >= 200 && g >= 200 && b >= 200 && Math.abs(r - g) < 22 && Math.abs(g - b) < 22);
    
    // 2. Floor shadow underneath:
    // Floor shadow has low color difference (r - b < 48, g - b < 35)
    // Box and bottle have strong amber/gold (r - b > 65)
    const isFloorShadow = (y > 400 && r >= 135 && g >= 120 && b >= 100 && (r - b) < 48);

    // Deep shadow under the bottle base (y > 460):
    const isUnderBottleShadow = (y > 462 && (r - b) < 52);

    // Deep shadow under the box (y > 425, x > 400):
    const isUnderBoxShadow = (y > 425 && x > 400 && (r - b) < 52);

    if (isPureWhite || isStudioWhite || isFloorShadow || isUnderBottleShadow || isUnderBoxShadow) {
      data[p + 3] = 0;
      if (x > 0) push(idx - 1);
      if (x < w - 1) push(idx + 1);
      if (y > 0) push(idx - w);
      if (y < h - 1) push(idx + w);
    }
  }

  // Bounding box
  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log('Kyron BBox:', { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 });

  await sharp(data, {
    raw: { width: w, height: h, channels: 4 }
  })
  .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
  .extend({ top: 12, bottom: 12, left: 12, right: 12, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile('perfect_kyron.png');

  console.log('Saved perfect_kyron.png');
}

buildPerfectKyron().catch(console.error);

