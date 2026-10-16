const sharp = require('sharp');
const fs = require('fs');

async function extractMorpheus() {
  const { data, info } = await sharp('raw_bottles/MOR-XO-750.jpg').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width; // 574
  const h = info.height; // 779

  // Let's create an alpha mask
  // Initial state: 0 (transparent) everywhere
  const mask = new Uint8Array(w * h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x);
      const p = idx * 4;
      const r = data[p];
      const g = data[p + 1];
      const b = data[p + 2];

      // Outside bounds check:
      // Canister left edge is x >= 93
      // Bottle right edge is x <= 488
      // Bottom is y <= 703
      // Top:
      // If x < 340 (canister region): top ellipse curves from (93, 345) up to (215, 328) down to (340, 335)
      // If x >= 340 (bottle cap region): bottle cap top is y >= 407

      if (x < 93 || x > 488 || y > 703) {
        continue; // definitely background
      }

      // Check top curve for canister (x from 93 to 340)
      if (x < 340) {
        // Approximate top lid ellipse: center around x=216, apex at y=328, ends at (93, 345) and (340, 338)
        const dx = (x - 216.5) / 123.5;
        const ellipseY = 328 + 17 * (dx * dx); // quadratic approx of ellipse
        if (y < ellipseY - 2) {
          continue; // above canister
        }
      } else {
        // Bottle region x >= 340
        // Cap top disc: x from 340 to 452, y >= 407
        if (x <= 452 && y < 407) {
          continue; // above bottle cap
        }
        // Right of cap (x > 452): cap ends at 452, shoulder doesn't start until y >= 490
        if (x > 452 && y < 490) {
          continue; // above right shoulder
        }
      }

      // Check bottom reflection (y > 696)
      if (y > 698) {
        // Bottle and canister base end around 700-703
        // Check if dark floor (r < 15 && g < 15 && b < 25)
        if (r < 15 && g < 15 && b < 25) {
          continue;
        }
      }

      // Now check color attributes:
      // The canister and bottle are cool blue / navy / gold lettering / angel / glass highlights.
      // The cathedral background has warm golden/brown tones: r is large, and (r - b) > 15, or golden arch (r > 60, g > 50, b < 60)
      
      // Is this pixel part of the warm cathedral arch outside the canister/bottle?
      const isWarmArch = (r > 50 && g > 45 && r > b + 15);
      const isDarkArchBrown = (r > b + 12 && r > 25);
      
      // If x is near the left edge of canister (x between 93 and 105):
      if (x <= 95 && isWarmArch) {
        continue;
      }

      // If x is near the right edge of bottle (x between 470 and 488, y > 500):
      if (x >= 478 && (isWarmArch || isDarkArchBrown)) {
        continue;
      }

      // Bottle neck right side (x between 400 and 452, y between 435 and 490):
      // Neck is between x ≈ 370 and x ≈ 410. Outside x > 410 in this y range is cathedral arch!
      if (x > 410 && y >= 435 && y < 490) {
        continue;
      }

      // Left of bottle neck under canister? Canister covers x < 340, bottle neck is x >= 370.
      // What about between x = 340 and 370, y between 340 and 430?
      // That's covered by the canister!
      
      mask[idx] = 255;
    }
  }

  // Apply mask to data
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

  console.log('Morpheus extracted bbox:', { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 });

  await sharp(data, {
    raw: { width: w, height: h, channels: 4 }
  })
  .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
  .extend({ top: 12, bottom: 12, left: 12, right: 12, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile('test_morpheus_full.png');

  console.log('Saved test_morpheus_full.png');
}

extractMorpheus().catch(console.error);

