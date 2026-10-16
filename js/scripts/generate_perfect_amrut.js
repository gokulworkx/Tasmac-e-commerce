const sharp = require('sharp');
const fs = require('fs');

async function buildPerfectAmrut() {
  const { data, info } = await sharp('raw_bottles/AMRUT-SGL-750.jpg').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width; // 822
  const h = info.height; // 1250

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
    // Pure white or studio near-white:
    const isPureWhite = (r >= 240 && g >= 240 && b >= 240);
    const isStudioWhite = (r >= 215 && g >= 215 && b >= 215 && Math.abs(r - g) < 18 && Math.abs(g - b) < 18);

    // Floor shadow at the bottom (y > 1180):
    // Shadow is neutral gray (r, g, b close together, r < 210, abs diff < 25)
    // The bottle base and tube base have distinct colors:
    // Bottle base has amber/gold (r > 100, g > 60, b < 40, r - b > 50)
    // Tube base has maroon/burgundy (r > 60, g < 40, b < 40, r - g > 30)
    const isFloorShadow = (y > 1190 && r >= 140 && g >= 140 && b >= 140 && Math.abs(r - g) < 22 && Math.abs(g - b) < 22);

    if (isPureWhite || isStudioWhite || isFloorShadow) {
      data[p + 3] = 0;
      if (x > 0) push(idx - 1);
      if (x < w - 1) push(idx + 1);
      if (y > 0) push(idx - w);
      if (y < h - 1) push(idx + w);
    }
  }

  // Bounding box of remaining bottle + tube
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

  console.log('Amrut Fusion BBox:', { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 });

  await sharp(data, {
    raw: { width: w, height: h, channels: 4 }
  })
  .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
  .extend({ top: 15, bottom: 15, left: 15, right: 15, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile('test_amrut_fusion_full.png');

  console.log('Saved test_amrut_fusion_full.png');
}

buildPerfectAmrut().catch(console.error);

