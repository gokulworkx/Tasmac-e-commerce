const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targetDir = path.join('C:', 'Users', 'Kasthuri', 'OneDrive', 'Desktop', 'Tasmac e commerce', 'images');

async function removeBackgroundAndSave(inputBuffer, outputPath, tolerance = 30) {
  const image = sharp(inputBuffer);
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const channels = 4;

  const getPixel = (x, y) => {
    const idx = (y * w + x) * channels;
    return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
  };

  const c1 = getPixel(0, 0);
  const c2 = getPixel(w - 1, 0);
  const c3 = getPixel(0, h - 1);
  const c4 = getPixel(w - 1, h - 1);

  if (c1[3] === 0 && c2[3] === 0 && c3[3] === 0 && c4[3] === 0) {
    await sharp(inputBuffer).png({ compressionLevel: 9 }).toFile(outputPath);
    console.log(`Saved transparent PNG (already transparent): ${path.basename(outputPath)}`);
    return;
  }

  const bgR = (c1[0] + c2[0] + c3[0] + c4[0]) / 4;
  const bgG = (c1[1] + c2[1] + c3[1] + c4[1]) / 4;
  const bgB = (c1[2] + c2[2] + c3[2] + c4[2]) / 4;

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

    const dist = Math.sqrt((r - bgR)**2 + (g - bgG)**2 + (b - bgB)**2);
    const isLight = (r > 220 && g > 220 && b > 220);

    if (dist <= tolerance || isLight) {
      data[p + 3] = 0;
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

  console.log(`Saved transparent PNG: ${path.basename(outputPath)}`);
}

async function run() {
  const list = [
    { id: "MCD-NO1-750", file: "raw_bottles/MCD-NO1-750_v2.webp" },
    { id: "SN-WH-750", file: "raw_bottles/SN-WH-750_v2.webp" },
    { id: "BP-WH-750", file: "raw_bottles/BP-WH-750_v2.webp" },
    { id: "TEACH-SCO-750", file: "raw_bottles/TEACH-SCO-750_v2.jpg" },
    { id: "MAGIC-VOD-750", file: "raw_bottles/MAGIC-VOD-750_v2.png" }
  ];

  for (const item of list) {
    const buf = fs.readFileSync(item.file);
    const out = path.join(targetDir, `${item.id}.png`);
    await removeBackgroundAndSave(buf, out, 30);
  }
}

run();

