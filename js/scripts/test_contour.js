const sharp = require('sharp');
const fs = require('fs');

async function testContour() {
  const { data, info } = await sharp('raw_bottles/MOR-XO-750.jpg').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width; // 574
  const h = info.height; // 779

  const mask = new Uint8Array(w * h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const p = idx * 4;
      const r = data[p];
      const g = data[p + 1];
      const b = data[p + 2];

      // Definite background bounds:
      // Canister left edge is at x = 93
      if (x < 93) continue;

      // Bottom base: canister and bottle sit on the table at y ≈ 701-703
      if (y > 703) continue;

      // Rightmost edge of bottle is at x ≈ 485
      if (x > 486) continue;

      // Top of canister:
      // Canister top ellipse from x = 93 to x = 320
      // At x = 93, y ≈ 345
      // At x = 205, y ≈ 327
      if (x < 285) {
        const dx = (x - 205) / 112;
        const topCanisterY = 327 + 18 * (dx * dx);
        if (y < topCanisterY) continue;
      }

      // Bottle cap top disc:
      // Disc spans from x ≈ 283 to x ≈ 450
      // Apex at x ≈ 367, y ≈ 318
      if (x >= 285 && x <= 452) {
        const dx = (x - 367) / 84;
        const topDiscY = 318 + 7 * (dx * dx);
        if (y < topDiscY) continue;
      }

      // To the right of the bottle cap:
      // Cap right rim is at x ≈ 450, y from 325 to 335
      // Below cap rim (neck):
      // Neck is between x ≈ 340 and x ≈ 410, for y from 335 to 445
      if (y >= 325 && y < 445 && x > 410) {
        // Outside the neck on the right is cathedral arch!
        continue;
      }

      // Shoulder to right edge (y from 445 to 703):
      // The shoulder expands from (410, 445) out to (485, 545) and curves down to (425, 703)
      if (y >= 445 && x > 410) {
        // The cathedral arch on the right has:
        // r > b + 10 or (r > 30 && g > 25 && b < 30) or isWarmArch
        // The bottle glass edge is blue or deep glass (b >= r)
        const isWarmArch = (r > b + 8) || (r > 30 && b < 25);
        if (isWarmArch && x > 440) {
          continue;
        }
        if (x > 470 && (r > b || b < 30)) {
          continue;
        }
      }

      // Left of canister:
      // Between x = 93 and 100, if warm arch:
      if (x <= 96 && (r > b + 20 || r > 60)) {
        continue;
      }

      mask[idx] = 255;
    }
  }

  // Flood fill / morphological cleanup or boundary refinement
  for (let i = 0; i < w * h; i++) {
    data[i * 4 + 3] = mask[i];
  }

  // Crop to bounding box
  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (mask[y * w + x] > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log('Morpheus refined bbox:', { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 });

  await sharp(data, {
    raw: { width: w, height: h, channels: 4 }
  })
  .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
  .extend({ top: 12, bottom: 12, left: 12, right: 12, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile('test_morpheus_v2.png');

  console.log('Saved test_morpheus_v2.png');
}

testContour().catch(console.error);

