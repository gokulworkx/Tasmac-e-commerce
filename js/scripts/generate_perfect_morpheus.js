const sharp = require('sharp');
const fs = require('fs');

async function buildPerfectMorpheus() {
  const { data, info } = await sharp('raw_bottles/MOR-XO-750.jpg').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width; // 574
  const h = info.height; // 779

  const mask = new Float32Array(w * h);

  const maxRightX = (y) => {
    if (y < 318) return 0;
    if (y <= 337) {
      const dy = (y - 328.5) / 8.5;
      return 450 - 4 * (dy * dy);
    }
    if (y <= 455) return 401; // Neck right edge
    if (y <= 525) {
      const t = (y - 455) / (525 - 455);
      return 401 + 84 * (1 - Math.cos(t * Math.PI / 2));
    }
    if (y <= 560) {
      return 485;
    }
    if (y <= 701) {
      const t = (y - 560) / (701 - 560);
      return 485 - 44 * (t ** 1.15);
    }
    return 0;
  };

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const p = idx * 4;
      const r = data[p];
      const g = data[p + 1];
      const b = data[p + 2];

      // Global bounds
      if (x < 93 || y < 318 || y > 701) {
        mask[idx] = 0;
        continue;
      }

      // Check right boundary
      const rightLimit = maxRightX(y);
      if (x > rightLimit) {
        mask[idx] = 0;
        continue;
      }

      // 1. Canister top (x: 93 to 285)
      if (x < 285) {
        const dx = (x - 205) / 112;
        const topY = 329 + 17 * (dx * dx);
        if (y < topY - 0.5) {
          mask[idx] = 0;
          continue;
        } else if (y < topY + 0.5) {
          mask[idx] = Math.max(0, Math.min(1, y - (topY - 0.5)));
          continue;
        }
      }

      // 2. Bottle disc top (x: 285 to 451)
      if (x >= 285 && x <= 451) {
        const dx = (x - 367) / 84;
        const topY = 321 + 14 * (dx * dx);
        if (y < topY - 0.5) {
          mask[idx] = 0;
          continue;
        } else if (y < topY + 0.5) {
          mask[idx] = Math.max(0, Math.min(1, y - (topY - 0.5)));
          continue;
        }
      }

      // Above right shoulder outside disc: (x > 451, y < 455)
      if (x > 451 && y < 455) {
        mask[idx] = 0;
        continue;
      }

      // Right edge of neck (y between 337 and 455, x > 401)
      if (y >= 337 && y <= 455 && x > 401) {
        mask[idx] = 0;
        continue;
      }

      // Left edge of canister (x around 93):
      if (x === 93) {
        mask[idx] = 0.6;
        continue;
      }

      // Right edge anti-aliasing:
      const distToRight = rightLimit - x;
      if (distToRight < 1.0) {
        mask[idx] = Math.max(0, Math.min(1, distToRight));
        continue;
      }

      // Bottom base anti-aliasing (y = 701):
      if (y === 701) {
        mask[idx] = 0.7;
        continue;
      }

      mask[idx] = 1.0;
    }
  }

  // Write mask to data alpha channel
  for (let i = 0; i < w * h; i++) {
    data[i * 4 + 3] = Math.round(mask[i] * 255);
  }

  // Bounding box
  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log('Morpheus BBox:', { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 });

  await sharp(data, {
    raw: { width: w, height: h, channels: 4 }
  })
  .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
  .extend({ top: 12, bottom: 12, left: 12, right: 12, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile('perfect_morpheus_blue.png');

  console.log('Saved perfect_morpheus_blue.png');
}

buildPerfectMorpheus().catch(console.error);

