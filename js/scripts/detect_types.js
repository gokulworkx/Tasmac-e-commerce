const fs = require('fs');
const path = require('path');

const rawDir = path.join(__dirname, 'raw_bottles');
const files = fs.readdirSync(rawDir);
for (const f of files) {
  const buf = fs.readFileSync(path.join(rawDir, f));
  let type = 'unknown';
  if (buf[0] === 0x89 && buf[1] === 0x50) type = 'PNG';
  else if (buf[0] === 0xff && buf[1] === 0xd8) type = 'JPEG';
  else if (buf.toString('ascii', 8, 12) === 'WEBP') type = 'WEBP';
  console.log(`${f.padEnd(25)} -> real type: ${type}, size: ${buf.length}`);
}

