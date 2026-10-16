const sharp = require('sharp');
const fs = require('fs');

async function traceBottleRightEdge() {
  const { data, info } = await sharp('raw_bottles/MOR-XO-750.jpg').raw().toBuffer({ resolveWithObject: true });
  const w = info.width; // 574
  const h = info.height; // 779

  // For each y from 318 to 703:
  // find the rightmost edge of the bottle
  // Let's print out what the profile looks like
  const edgeProfile = [];

  for (let y = 318; y <= 703; y++) {
    // Disc cap (y from 318 to 335): right edge is around x = 450
    // Neck (y from 335 to 445): right edge of neck is around x = 398-403
    // Shoulder & Body (y from 445 to 703): curves out to ~485 and back to ~425
    
    // We can scan from right (x = 520) towards left (x = 350)
    // Background arch has high R and low B (warm tones, R > B + 10, or R > 40 && G > 35 && B < 40)
    // Bottle has blue reflection or black/deep navy (B >= R - 5, or B > 50)
    let foundX = -1;
    for (let x = 500; x >= 340; x--) {
      const idx = (y * w + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];

      // If y is in neck range (335 to 445):
      // Neck right edge is near x = 400
      if (y >= 335 && y < 445 && x > 405) {
        continue;
      }
      // If y is in disc cap range (318 to 335):
      // Cap edge is near x = 450
      if (y >= 318 && y < 335 && x > 453) {
        continue;
      }

      // Check if this pixel belongs to bottle:
      // In neck range:
      if (y >= 335 && y < 445) {
        if (b > r || (r < 30 && g < 40 && b > 30)) {
          foundX = x;
          break;
        }
      } else {
        // Shoulder / body
        // The edge has a blue glass highlight! (b > 60, or b > r)
        if (b > r + 5 || (b > 40 && r < 35)) {
          foundX = x;
          break;
        }
      }
    }
    edgeProfile.push({ y, edgeX: foundX });
  }

  console.log('Sampled edge profile:');
  for (let i = 0; i < edgeProfile.length; i += 25) {
    console.log(edgeProfile[i]);
  }
}

traceBottleRightEdge();

