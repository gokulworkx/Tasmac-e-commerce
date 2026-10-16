const sharp = require('sharp');
const fs = require('fs');

async function processKyronFull() {
  const { data, info } = await sharp('raw_bottles/KY-BR-750.webp').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

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

  // Push all border pixels
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

    // Check if background:
    // Pure white or studio near-white, or floor shadow (light grayish/pinkish shadow where r,g,b > 180 and close together)
    // The box is distinctly gold/yellow (r is much higher than b, e.g. r - b > 30)
    // The bottle has brandy color (amber/gold, r - b > 40)
    // Clear glass highlights: let's be careful not to eat into the bottle cap or glass
    
    // Background condition:
    const isPureWhite = (r >= 245 && g >= 245 && b >= 245);
    const isStudioWhite = (r >= 225 && g >= 225 && b >= 225 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20);
    const isFloorShadow = (y > 400 && r >= 170 && g >= 160 && b >= 160 && (r - b) < 35 && g > 150);

    if (isPureWhite || isStudioWhite || isFloorShadow) {
      data[p + 3] = 0; // make transparent
      if (x > 0) push(idx - 1);
      if (x < w - 1) push(idx + 1);
      if (y > 0) push(idx - w);
      if (y < h - 1) push(idx + w);
    }
  }

  // Bounding box of all remaining pixels
  let minX = w, maxX = 0, minY = h, maxY = 0;
  let count = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = (y * w + x) * 4;
      if (data[p + 3] > 0) {
        count++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log('Kyron full remaining pixels:', count, 'bbox:', { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 });

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;

  await sharp(data, {
    raw: { width: w, height: h, channels: 4 }
  })
  .extract({ left: minX, top: minY, width: cropW, height: cropH })
  .extend({ top: 15, bottom: 15, left: 15, right: 15, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile('test_kyron_full.png');

  console.log('Saved test_kyron_full.png');
}

processKyronFull().catch(console.error);

