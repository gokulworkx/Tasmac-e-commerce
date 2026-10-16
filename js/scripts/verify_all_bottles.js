const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targetDir = path.join('C:', 'Users', 'Kasthuri', 'OneDrive', 'Desktop', 'Tasmac e commerce', 'images');

const drinkIds = [
  "AMRUT-SGL-750",
  "MCD-NO1-750",
  "SN-WH-750",
  "RC-WH-750",
  "BP-WH-750",
  "JW-BLK-750",
  "TEACH-SCO-750",
  "MH-BR-750",
  "MOR-XO-750",
  "COUR-NAP-750",
  "KY-BR-750",
  "MC-WH-750",
  "BAC-SUP-750",
  "CAPT-MORG-750",
  "OLD-PORT-750",
  "KF-PR-650",
  "KF-ULTRA-650",
  "BUD-MAG-650",
  "BP-BR-650",
  "CORONA-330",
  "BIRA-WHT-500",
  "MAGIC-VOD-750",
  "SMIR-RED-750",
  "SULA-SH-750",
  "FRAT-MER-750",
  "BOMBAY-SAPH-750"
];

async function verifyAll() {
  console.log(`Checking ${drinkIds.length} drinks in images directory...`);
  let allPass = true;

  for (const id of drinkIds) {
    const filename = `${id}.png`;
    const filePath = path.join(targetDir, filename);

    if (!fs.existsSync(filePath)) {
      console.error(`MISSING FILE: ${filename}`);
      allPass = false;
      continue;
    }

    const { data, info } = await sharp(filePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const w = info.width;
    const h = info.height;

    // Check corners
    const getAlpha = (x, y) => data[(y * w + x) * 4 + 3];
    const tl = getAlpha(0, 0);
    const tr = getAlpha(w - 1, 0);
    const bl = getAlpha(0, h - 1);
    const br = getAlpha(w - 1, h - 1);

    const isTransparent = (tl === 0 && tr === 0 && bl === 0 && br === 0);
    const sizeKB = (fs.statSync(filePath).size / 1024).toFixed(1);

    console.log(`${id.padEnd(16)}: ${w}x${h} (${sizeKB} KB) -> Transparent corners: ${isTransparent ? 'YES [OK]' : 'NO [FAIL]'}`);
    if (!isTransparent) allPass = false;
  }

  console.log(`\nOVERALL VERIFICATION RESULT: ${allPass ? 'ALL 26 PASS 100%' : 'SOME FAILED'}`);
}

verifyAll();

