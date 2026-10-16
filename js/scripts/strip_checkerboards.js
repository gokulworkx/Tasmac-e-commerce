const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targetDir = path.join('C:', 'Users', 'Kasthuri', 'OneDrive', 'Desktop', 'Tasmac e commerce', 'images');

async function removeCheckerboard(inputPath, outputPath, cropLeftPct = 0, cropWidthPct = 1.0) {
  let image = sharp(inputPath);
  const meta = await image.metadata();

  if (cropLeftPct > 0 || cropWidthPct < 1.0) {
    const left = Math.floor(meta.width * cropLeftPct);
    const width = Math.floor(meta.width * cropWidthPct);
    image = image.extract({ left, top: 0, width, height: meta.height });
  }

  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
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
    const a = data[p + 3];

    if (a === 0) {
      if (x > 0) queue[qEnd++] = idx - 1;
      if (x < w - 1) queue[qEnd++] = idx + 1;
      if (y > 0) queue[qEnd++] = idx - w;
      if (y < h - 1) queue[qEnd++] = idx + w;
      continue;
    }

    // Checkerboard squares are pure white or neutral grey >= 180 with abs diff < 15
    const isChecker = (r >= 175 && g >= 175 && b >= 175 && Math.abs(r - g) <= 12 && Math.abs(g - b) <= 12);

    if (isChecker) {
      data[p + 3] = 0; // Transparent!
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
  .toFile(outputPath);

  console.log(`Successfully de-checkerboarded: ${path.basename(outputPath)}`);
}

async function run() {
  await removeCheckerboard(path.join(targetDir, 'BUD-MAG-650.png'), path.join(targetDir, 'BUD-MAG-650.png'));
  await removeCheckerboard(path.join(targetDir, 'CORONA-330.png'), path.join(targetDir, 'CORONA-330.png'), 0, 0.50);
  await removeCheckerboard(path.join(targetDir, 'JW-BLK-750.png'), path.join(targetDir, 'JW-BLK-750.png'));
  await removeCheckerboard(path.join(targetDir, 'MAGIC-VOD-750.png'), path.join(targetDir, 'MAGIC-VOD-750.png'));
}

run().catch(console.error);

