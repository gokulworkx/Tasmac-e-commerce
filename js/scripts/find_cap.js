const sharp = require('sharp');
const fs = require('fs');

async function findCap() {
  const { data, info } = await sharp('raw_bottles/MOR-XO-750.jpg').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  
  // Look at y from 390 to 450 across x from 300 to 500
  console.log('Finding cap edges...');
  for (let y = 390; y <= 450; y += 5) {
    const row = [];
    for (let x = 300; x <= 480; x += 10) {
      const idx = (y * w + x) * 3;
      const b = data[idx+2];
      const r = data[idx];
      const g = data[idx+1];
      // mark blue pixels (cap)
      if (b > 50 && b > r + 10) {
        row.push(x);
      }
    }
    if (row.length > 0) {
      console.log(`y=${y}: x from ${row[0]} to ${row[row.length - 1]}`);
    }
  }
}

findCap();

