const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function checkAllRaws() {
  const dir = 'raw_bottles';
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const meta = await sharp(path.join(dir, f)).metadata();
    console.log(f.padEnd(25), `${meta.width}x${meta.height}`, `ratio: ${(meta.width/meta.height).toFixed(2)}`);
  }
}

checkAllRaws();

