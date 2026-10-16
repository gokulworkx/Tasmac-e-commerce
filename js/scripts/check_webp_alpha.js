const fs = require('fs');
const path = require('path');

const rawDir = path.join(__dirname, 'raw_bottles');
const files = fs.readdirSync(rawDir);

for (const f of files) {
  const buf = fs.readFileSync(path.join(rawDir, f));
  if (buf.toString('ascii', 8, 12) === 'WEBP') {
    const chunkHeader = buf.toString('ascii', 12, 16);
    let hasAlpha = false;
    if (chunkHeader === 'VP8X') {
      const flags = buf[20];
      hasAlpha = (flags & 0x10) !== 0;
    } else if (chunkHeader === 'VP8L') {
      hasAlpha = true; // VP8L lossless commonly has alpha
    }
    console.log(`${f.padEnd(25)} chunk: ${chunkHeader}, hasAlpha: ${hasAlpha}`);
  }
}

