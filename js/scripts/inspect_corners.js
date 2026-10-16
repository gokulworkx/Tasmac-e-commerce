const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const rawDir = path.join(__dirname, 'raw_bottles');
const files = fs.readdirSync(rawDir);

async function inspectAll() {
  for (const f of files) {
    try {
      const p = path.join(rawDir, f);
      const meta = await sharp(p).metadata();
      const { data, info } = await sharp(p).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const w = info.width;
      const h = info.height;
      const getPixel = (x, y) => {
        const idx = (y * w + x) * 4;
        return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
      };
      const tl = getPixel(0, 0);
      const tr = getPixel(w - 1, 0);
      const bl = getPixel(0, h - 1);
      const br = getPixel(w - 1, h - 1);
      console.log(`${f.padEnd(22)}: ${meta.format} ${w}x${h} TL:[${tl}] TR:[${tr}] BL:[${bl}] BR:[${br}]`);
    } catch (e) {
      console.error(`${f}: ${e.message}`);
    }
  }
}

inspectAll();

