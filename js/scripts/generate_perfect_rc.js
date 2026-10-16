const sharp = require('sharp');
const fs = require('fs');

async function buildPerfectRC() {
  const { data, info } = await sharp('raw_bottles/RC-WH-750.webp').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  console.log('RC raw dimensions:', w, h);

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
    const isPureWhite = (r >= 235 && g >= 235 && b >= 235);
    const isStudioWhite = (r >= 210 && g >= 210 && b >= 210 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20);

    // Light floor shadow (y > 360, neutral light shadow):
    const isFloorShadow = (y > 360 && r >= 150 && g >= 150 && b >= 150 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20);

    if (isPureWhite || isStudioWhite || isFloorShadow) {
      data[p + 3] = 0;
      if (x > 0) push(idx - 1);
      if (x < w - 1) push(idx + 1);
      if (y > 0) push(idx - w);
      if (y < h - 1) push(idx + w);
    }
  }

  // Bounding box of remaining bottle + box
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

  console.log('RC BBox:', { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 });

  await sharp(data, {
    raw: { width: w, height: h, channels: 4 }
  })
  .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
  .extend({ top: 12, bottom: 12, left: 12, right: 12, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile('test_rc_full.png');

  console.log('Saved test_rc_full.png');
}

buildPerfectRC().catch(console.error);

