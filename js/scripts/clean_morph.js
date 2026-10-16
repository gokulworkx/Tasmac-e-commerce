const sharp = require('sharp');
const fs = require('fs');

async function cleanBottle(file, outName) {
  const buf = fs.readFileSync(file);
  const image = sharp(buf);
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const channels = 4;

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
    const p = idx * channels;

    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const a = data[p + 3];

    // Background is white or light studio gray / checkerboard
    const isStudioWhite = (r > 200 && g > 200 && b > 200 && Math.abs(r - g) < 30 && Math.abs(g - b) < 30);
    const isLightNeutral = (r > 185 && g > 185 && b > 185 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20);

    if (a === 0 || isStudioWhite || isLightNeutral) {
      data[p + 3] = 0; // Transparent!

      if (x > 0) push(idx - 1);
      if (x < w - 1) push(idx + 1);
      if (y > 0) push(idx - w);
      if (y < h - 1) push(idx + w);
    }
  }

  // Find tight bounding box of remaining bottle
  let minX = w, maxX = 0, minY = h, maxY = 0;
  let remainingOpaque = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = (y * w + x) * channels;
      if (data[p + 3] > 20) {
        remainingOpaque++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(file, 'Remaining opaque:', remainingOpaque, `(${Math.round(remainingOpaque/(w*h)*100)}%)`, 'bbox:', [minX, minY, maxX, maxY]);

  const cropW = Math.max(1, maxX - minX + 1);
  const cropH = Math.max(1, maxY - minY + 1);

  await sharp(data, {
    raw: { width: w, height: h, channels: 4 }
  })
  .extract({ left: minX, top: minY, width: cropW, height: cropH })
  .extend({ top: 12, bottom: 12, left: 12, right: 12, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile(outName);

  console.log(`Saved pristine ${outName}`);
}

cleanBottle('temp_morph_bottle.png', 'temp_morpheus_clean.png');

