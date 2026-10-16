const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const src = 'C:/Users/Kasthuri/.gemini/antigravity/brain/25432ea9-c626-489f-b402-f7519e000f74/.user_uploaded/media_1791967808989_9f9bb793.png';
const out = 'C:/Users/Kasthuri/OneDrive/Desktop/Tasmac e commerce/images/BAC-SUP-750.png';

async function fixBacardi() {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const channels = 4;

  const visited = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let qStart = 0;
  let qEnd = 0;

  for (let x = 0; x < w; x++) {
    queue[qEnd++] = x;
    queue[qEnd++] = (h - 1) * w + x;
  }
  for (let y = 0; y < h; y++) {
    queue[qEnd++] = y * w;
    queue[qEnd++] = y * w + (w - 1);
  }

  while (qStart < qEnd) {
    const idx = queue[qStart++];
    if (idx < 0 || idx >= w * h) continue;
    if (visited[idx]) continue;
    visited[idx] = 1;

    const x = idx % w;
    const y = (idx / w) | 0;
    const p = idx * channels;

    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];

    // Checkerboard squares in Bacardi reference are neutral light grey/white (220 to 255 with abs diff <= 10)
    const isChecker = (r >= 215 && g >= 215 && b >= 215 && Math.abs(r - g) <= 10 && Math.abs(g - b) <= 10);

    if (isChecker) {
      data[p + 3] = 0; // Truly transparent!
      if (x > 0) queue[qEnd++] = idx - 1;
      if (x < w - 1) queue[qEnd++] = idx + 1;
      if (y > 0) queue[qEnd++] = idx - w;
      if (y < h - 1) queue[qEnd++] = idx + w;
    }
  }

  await sharp(data, {
    raw: { width: w, height: h, channels: 4 }
  })
  .png({ compressionLevel: 9 })
  .toFile(out);

  console.log('Fixed Bacardi transparency!');
}

fixBacardi();

