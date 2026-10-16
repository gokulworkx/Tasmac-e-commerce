const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processBottle(inputPath, outputPath, tolerance = 35) {
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const { width, height } = metadata;

  // Ensure 4 channels (RGBA)
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const channels = info.channels; // 4

  // Sample corner background colors (average of 4 corners)
  const getPixel = (x, y) => {
    const idx = (y * w + x) * channels;
    return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
  };

  const c1 = getPixel(0, 0);
  const c2 = getPixel(w - 1, 0);
  const c3 = getPixel(0, h - 1);
  const c4 = getPixel(w - 1, h - 1);

  // If already transparent in all 4 corners, no need to flood-remove
  if (c1[3] === 0 && c2[3] === 0 && c3[3] === 0 && c4[3] === 0) {
    console.log(`${path.basename(inputPath)}: Already transparent!`);
    await sharp(inputPath).png().toFile(outputPath);
    return;
  }

  const bgR = (c1[0] + c2[0] + c3[0] + c4[0]) / 4;
  const bgG = (c1[1] + c2[1] + c3[1] + c4[1]) / 4;
  const bgB = (c1[2] + c2[2] + c3[2] + c4[2]) / 4;

  // BFS Flood Fill from outer edges
  const visited = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let qStart = 0;
  let qEnd = 0;

  // Add all border pixels to queue
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

    const dist = Math.sqrt((r - bgR)**2 + (g - bgG)**2 + (b - bgB)**2);
    const isLight = (r > 220 && g > 220 && b > 220);

    if (dist <= tolerance || isLight) {
      data[p + 3] = 0; // Set transparent!
      if (x > 0) queue[qEnd++] = idx - 1;
      if (x < w - 1) queue[qEnd++] = idx + 1;
      if (y > 0) queue[qEnd++] = idx - w;
      if (y < h - 1) queue[qEnd++] = idx + w;
    }
  }

  await sharp(data, {
    raw: {
      width: w,
      height: h,
      channels: 4
    }
  })
  .png({ compressionLevel: 9 })
  .toFile(outputPath);

  console.log(`Processed & saved transparent PNG: ${outputPath}`);
}

async function run() {
  const input = path.join(__dirname, 'raw_bottles', 'AMRUT-SGL-750.jpg');
  const output = path.join('C:', 'Users', 'Kasthuri', 'OneDrive', 'Desktop', 'Tasmac e commerce', 'images', 'AMRUT-SGL-750.png');
  await processBottle(input, output);
}

run().catch(console.error);

