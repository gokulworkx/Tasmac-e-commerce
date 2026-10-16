/**
 * TASMAC Consolidated Utility and Processing Scripts Bundle
 * Contains 61 scripts
 */

/******************************************************************************
 * SCRIPT: analyze_kyron.js
 ******************************************************************************/
const sharp = require('sharp');
const fs = require('fs');

async function analyzeKyron() {
  const { data, info } = await sharp('raw_bottles/KY-BR-750.webp').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  console.log('Kyron raw size:', w, h);

  // Check 4 corners
  const getP = (x, y) => {
    const idx = (y * w + x) * 3;
    return [data[idx], data[idx + 1], data[idx + 2]];
  };

  console.log('Top-left:', getP(0, 0));
  console.log('Top-right:', getP(w - 1, 0));
  console.log('Bottom-left:', getP(0, h - 1));
  console.log('Bottom-right:', getP(w - 1, h - 1));

  // Let's test a flood fill from (0,0) and borders where pixel is near-white
  // or studio white
}

analyzeKyron();



/******************************************************************************
 * SCRIPT: analyze_morpheus.js
 ******************************************************************************/
const sharp = require('sharp');
const fs = require('fs');

async function analyzeMorpheus() {
  const { data, info } = await sharp('raw_bottles/MOR-XO-750.jpg').raw().toBuffer({ resolveWithObject: true });
  const w = info.width; // 574
  const h = info.height; // 779

  console.log('Morpheus raw:', w, h);

  // Let's sample along vertical line x = 200 (through canister)
  // and x = 400 (through bottle)
  // and sample the background at (50, 50), (200, 100), (450, 100), (50, 500), (550, 500), (300, 750)
  const getP = (x, y) => {
    const idx = (y * w + x) * 3;
    return [data[idx], data[idx + 1], data[idx + 2]];
  };

  console.log('Cathedral top left (50, 50):', getP(50, 50));
  console.log('Cathedral arch left of canister (50, 450):', getP(50, 450));
  console.log('Cathedral arch right of bottle (520, 550):', getP(520, 550));
  console.log('Floor bottom left (50, 750):', getP(50, 750));
  console.log('Floor bottom center (280, 760):', getP(280, 760));

  console.log('Canister top lid (250, 345):', getP(250, 345));
  console.log('Canister body (250, 500):', getP(250, 500));
  console.log('Bottle cap (380, 420):', getP(380, 420));
  console.log('Bottle body (380, 600):', getP(380, 600));
  console.log('Bottle base (380, 700):', getP(380, 700));
}

analyzeMorpheus();



/******************************************************************************
 * SCRIPT: check_all_ratios.js
 ******************************************************************************/
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function checkAll() {
  const imagesDir = 'C:/Users/Kasthuri/OneDrive/Desktop/Tasmac e commerce/images';
  const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.png'));

  console.log(`Checking ${files.length} images in images/...`);
  for (const f of files) {
    const meta = await sharp(path.join(imagesDir, f)).metadata();
    console.log(`${f.padEnd(20)}: ${meta.width}x${meta.height} (ratio: ${(meta.width/meta.height).toFixed(2)})`);
  }
}

checkAll().catch(console.error);



/******************************************************************************
 * SCRIPT: check_all_raws.js
 ******************************************************************************/
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



/******************************************************************************
 * SCRIPT: check_bud_pix.js
 ******************************************************************************/
const sharp = require('sharp');
const path = require('path');

async function test() {
  const p = path.join(__dirname, 'raw_bottles', 'BUD-MAG-650.png');
  const { data, info } = await sharp(p).raw().toBuffer({ resolveWithObject: true });
  console.log('Sample top-left 5x5:');
  for (let y = 0; y < 5; y++) {
    const row = [];
    for (let x = 0; x < 5; x++) {
      const idx = (y * info.width + x) * info.channels;
      row.push(`[${data[idx]},${data[idx+1]},${data[idx+2]}]`);
    }
    console.log(row.join(' '));
  }
}

test();



/******************************************************************************
 * SCRIPT: check_raws.js
 ******************************************************************************/
const sharp = require('sharp');
const fs = require('fs');

async function test() {
  // Let's copy raw_bottles/MOR-XO-750.jpg and KY-BR-750.webp as png to inspect or view
  await sharp('raw_bottles/MOR-XO-750.jpg').png().toFile('raw_mor_preview.png');
  await sharp('raw_bottles/KY-BR-750.webp').png().toFile('raw_ky_preview.png');
  console.log('Converted previews to raw_mor_preview.png and raw_ky_preview.png');
}

test().catch(console.error);



/******************************************************************************
 * SCRIPT: check_urls.js
 ******************************************************************************/
const fs = require('fs');
const path = require('path');

const urls = {
  "AMRUT-SGL-750": "https://images.squarespace-cdn.com/content/v1/53ffc0fbe4b0e9e8825f8b00/1633391687286-4ZE4WJY9F3C6C5BZZF5X/AD_FUSION_BPW_E1250n.jpg",
  "BP-WH-750": "https://www.pernod-ricard.com/sites/default/files/styles/brand_tile_3_in_row_desktop_958x1048_/public/2021-06/brand-blenders-pride-rare-premium-whisky-lifestyle-original.jpg.jpg",
  "JW-BLK-750": "https://images.ctfassets.net/waruwpig3jxu/rYk8WxpJ1ellZvibRckWT/0e8df23f16b39c6d986faf6f68af8fee/black-750ml_producthero_lifestyle-01_desktop.webp?w=800",
  "MH-BR-750": "https://cdn.sanity.io/images/wyd6cbsu/production/d996410b224b7a5262994ba60513b0aa66fe9a81-2167x2484.png?q=100&w=1080&q=75",
  "MOR-XO-750": "https://radicokhaitan.com/wp-content/uploads/2019/03/Morpheus-Blue.jpg",
  "COUR-NAP-750": "https://tilind.com/wp-content/uploads/2022/02/CNB-Green-600-x-600px.jpg",
  "KY-BR-750": "https://static.livcheers.com/static/content/images/liquor/LCIN03916.webp",
  "CAPT-MORG-750": "https://upload.wikimedia.org/wikipedia/commons/4/4c/Captain_Morgan_Rum_-_Bottle.png",
  "OLD-PORT-750": "https://static.livcheers.com/static/content/images/liquor/LCIN02492.webp",
  "BUD-MAG-650": "https://www.pngall.com/wp-content/uploads/14/Budweiser-Bottle-thumb.webp",
  "BP-BR-650": "https://snjgroup.com/uploads/brewery/1691151095.jpg",
  "CORONA-330": "https://www.pngall.com/wp-content/uploads/15/Corona-Beer-No-Background-thumb.webp",
  "SULA-SH-750": "https://sulavineyards.com/images/media2/sula-classics/Shiraz_Cabernet-image.webp",
  "FRAT-MER-750": "https://fratelliwines.in/cdn/shop/files/Classic_Merlot_ba06a5dc-c84b-4d5f-b222-f16429b99550_800x.png",
  "BOMBAY-SAPH-750": "https://upload.wikimedia.org/wikipedia/commons/7/7f/Bombay_sapphire_bottle.jpg"
};

async function check() {
  for (const [id, url] of Object.entries(urls)) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      console.log(`${id}: status ${res.status}, type: ${res.headers.get('content-type')}`);
    } catch (err) {
      console.log(`${id}: ERROR ${err.message}`);
    }
  }
}

check();



/******************************************************************************
 * SCRIPT: check_user_img.js
 ******************************************************************************/
const sharp = require('sharp');
const p = 'C:/Users/Kasthuri/.gemini/antigravity/brain/25432ea9-c626-489f-b402-f7519e000f74/.user_uploaded/media_1791967808989_9f9bb793.png';

sharp(p).raw().toBuffer({ resolveWithObject: true }).then(({ data, info }) => {
  console.log('User image info:', info);
  console.log('Pixel at 0,0:', data[0], data[1], data[2], data[3]);
  console.log('Pixel at 16,16:', data[(16 * info.width + 16) * info.channels], data[(16 * info.width + 16) * info.channels + 1], data[(16 * info.width + 16) * info.channels + 2], data[(16 * info.width + 16) * info.channels + 3]);
});



/******************************************************************************
 * SCRIPT: check_webp_alpha.js
 ******************************************************************************/
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



/******************************************************************************
 * SCRIPT: clean_morph.js
 ******************************************************************************/
const sharp = require('sharp');
const fs = require('fs');

async function cleanBottle(file, outName) {
  const buf = fs.readFileSync(file);
  const image = sharp(buf);
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const channels = 4;

  const visited = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let qStart = 0;
  let qEnd = 0;

  function push(idx) {
    if (idx >= 0 && idx < w * h && !visited[idx]) {
      visited[idx] = 1;
      queue[qEnd++] = idx;
    }
  }

  // Push all 4 borders
  for (let x = 0; x < w; x++) {
    push(x);
    push((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    push(y * w);
    push(y * w + (w - 1));
  }

  while (qStart < qEnd) {
    const idx = queue[qStart++];
    const x = idx % w;
    const y = (idx / w) | 0;
    const p = idx * channels;

    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const a = data[p + 3];

    // Background is white or light studio gray / checkerboard
    const isStudioWhite = (r > 200 && g > 200 && b > 200 && Math.abs(r - g) < 30 && Math.abs(g - b) < 30);
    const isLightNeutral = (r > 185 && g > 185 && b > 185 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20);

    if (a === 0 || isStudioWhite || isLightNeutral) {
      data[p + 3] = 0; // Transparent!

      if (x > 0) push(idx - 1);
      if (x < w - 1) push(idx + 1);
      if (y > 0) push(idx - w);
      if (y < h - 1) push(idx + w);
    }
  }

  // Find tight bounding box of remaining bottle
  let minX = w, maxX = 0, minY = h, maxY = 0;
  let remainingOpaque = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = (y * w + x) * channels;
      if (data[p + 3] > 20) {
        remainingOpaque++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(file, 'Remaining opaque:', remainingOpaque, `(${Math.round(remainingOpaque/(w*h)*100)}%)`, 'bbox:', [minX, minY, maxX, maxY]);

  const cropW = Math.max(1, maxX - minX + 1);
  const cropH = Math.max(1, maxY - minY + 1);

  await sharp(data, {
    raw: { width: w, height: h, channels: 4 }
  })
  .extract({ left: minX, top: minY, width: cropW, height: cropH })
  .extend({ top: 12, bottom: 12, left: 12, right: 12, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile(outName);

  console.log(`Saved pristine ${outName}`);
}

cleanBottle('temp_morph_bottle.png', 'temp_morpheus_clean.png');



/******************************************************************************
 * SCRIPT: crop_neck.js
 ******************************************************************************/
const sharp = require('sharp');

async function test() {
  await sharp('raw_bottles/MOR-XO-750.jpg')
    .extract({ left: 250, top: 380, width: 250, height: 160 })
    .png()
    .toFile('crop_neck.png');
}

test();



/******************************************************************************
 * SCRIPT: crop_neck_top.js
 ******************************************************************************/
const sharp = require('sharp');

async function test() {
  await sharp('raw_bottles/MOR-XO-750.jpg')
    .extract({ left: 250, top: 300, width: 250, height: 150 })
    .png()
    .toFile('crop_neck_top.png');
}

test();



/******************************************************************************
 * SCRIPT: detect_types.js
 ******************************************************************************/
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



/******************************************************************************
 * SCRIPT: download_african.js
 ******************************************************************************/
const https = require('https');
const http = require('http');
const fs = require('fs');
const sharp = require('sharp');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    proto.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Status ' + res.statusCode));
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close(() => resolve());
      });
    }).on('error', reject);
  });
}

async function main() {
  const url = 'https://www.africaneasternonline.com/media/catalog/product/9/9/99590127.png';
  try {
    await download(url, 'african_morph.png');
    console.log('Downloaded African Eastern Morpheus');
    const m = await sharp('african_morph.png').metadata();
    console.log('Metadata:', m);
  } catch (e) {
    console.log('Download error:', e.message);
  }
}

main();



/******************************************************************************
 * SCRIPT: download_all.js
 ******************************************************************************/
const fs = require('fs');
const path = require('path');

const sources = {
  "AMRUT-SGL-750": "https://images.squarespace-cdn.com/content/v1/53ffc0fbe4b0e9e8825f8b00/1633391687286-4ZE4WJY9F3C6C5BZZF5X/AD_FUSION_BPW_E1250n.jpg",
  "MCD-NO1-750": "https://static.livcheers.com/static/content/images/liquor/LCIN01385.webp",
  "SN-WH-750": "https://images.ctfassets.net/vvbow7h7clgh/2xrVKW4x0n0sRmQbPRGRGV/7806bd934fed74152a1571183d2df5c4/030a2aa346543985a6628c82cc791d57c5b759b5.png",
  "RC-WH-750": "https://static.livcheers.com/static/content/images/liquor/LCIN01707.webp",
  "BP-WH-750": "https://www.pernod-ricard.com/sites/default/files/styles/brand_tile_3_in_row_desktop_958x1048_/public/2021-06/brand-blenders-pride-rare-premium-whisky-lifestyle-original.jpg.jpg",
  "JW-BLK-750": "https://images.ctfassets.net/waruwpig3jxu/rYk8WxpJ1ellZvibRckWT/0e8df23f16b39c6d986faf6f68af8fee/black-750ml_producthero_lifestyle-01_desktop.webp?w=800",
  "TEACH-SCO-750": "https://static.livcheers.com/static/content/images/liquor/LCIN01131.webp",
  "MH-BR-750": "https://cdn.sanity.io/images/wyd6cbsu/production/d996410b224b7a5262994ba60513b0aa66fe9a81-2167x2484.png?q=100&w=1080&q=75",
  "MOR-XO-750": "https://radicokhaitan.com/wp-content/uploads/2019/03/Morpheus-Blue.jpg",
  "COUR-NAP-750": "https://tilind.com/wp-content/uploads/2022/02/CNB-Green-600-x-600px.jpg",
  "KY-BR-750": "https://static.livcheers.com/static/content/images/liquor/LCIN03916.webp",
  "MC-WH-750": "https://static.livcheers.com/static/content/images/liquor/LCIN01534.webp",
  "CAPT-MORG-750": "https://images.ctfassets.net/s46nvf89460z/4Lba3H0dB3lfEIZrQQknXE/f214c6bddb0967122a79c37bad9d3961/product_us_hero-2.png",
  "OLD-PORT-750": "https://static.livcheers.com/static/content/images/liquor/LCIN02492.webp",
  "KF-PR-650": "https://static.livcheers.com/static/content/images/liquor/LCIN01184.webp",
  "KF-ULTRA-650": "https://static.livcheers.com/static/content/images/liquor/LCIN01186.webp",
  "BUD-MAG-650": "https://www.pngall.com/wp-content/uploads/14/Budweiser-Bottle-thumb.webp",
  "BP-BR-650": "https://snjgroup.com/uploads/brewery/1691151095.jpg",
  "CORONA-330": "https://www.pngall.com/wp-content/uploads/15/Corona-Beer-No-Background-thumb.webp",
  "BIRA-WHT-500": "https://upload.wikimedia.org/wikipedia/commons/2/2a/Bira_91_White_beer_bottle.jpg",
  "MAGIC-VOD-750": "https://radicokhaitan.com/wp-content/uploads/2019/03/MM-normal.jpg",
  "SMIR-RED-750": "https://www.diageo.com/~/media/Images/D/Diageo-V2/Universal/product-carousel/smirnoff-classic-no-21.png",
  "SULA-SH-750": "https://sulavineyards.com/images/media2/sula-classics/Shiraz_Cabernet-image.webp",
  "FRAT-MER-750": "https://fratelliwines.in/cdn/shop/files/Classic_Merlot_ba06a5dc-c84b-4d5f-b222-f16429b99550_800x.png",
  "BOMBAY-SAPH-750": "https://upload.wikimedia.org/wikipedia/commons/7/7f/Bombay_sapphire_bottle.jpg"
};

const rawDir = path.join(__dirname, 'raw_bottles');
if (!fs.existsSync(rawDir)) fs.mkdirSync(rawDir, { recursive: true });

async function downloadAll() {
  for (const [id, url] of Object.entries(sources)) {
    try {
      const ext = url.includes('.png') ? '.png' : (url.includes('.webp') ? '.webp' : '.jpg');
      const target = path.join(rawDir, `${id}${ext}`);
      if (fs.existsSync(target) && fs.statSync(target).size > 5000) {
        console.log(`Already exists: ${id}`);
        continue;
      }
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        }
      });
      if (!res.ok) {
        console.error(`Failed ${id}: HTTP ${res.status}`);
        continue;
      }
      const buf = await res.arrayBuffer();
      fs.writeFileSync(target, Buffer.from(buf));
      console.log(`Downloaded ${id} (${buf.byteLength} bytes)`);
    } catch (e) {
      console.error(`Error downloading ${id}: ${e.message}`);
    }
  }
}

downloadAll();



/******************************************************************************
 * SCRIPT: download_livcheers_1462.js
 ******************************************************************************/
const https = require('https');
const fs = require('fs');
const sharp = require('sharp');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Status ' + res.statusCode));
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close(() => resolve());
      });
    }).on('error', reject);
  });
}

async function main() {
  const url = 'https://static.livcheers.com/static/content/images/liquor/LCIN01462.webp';
  try {
    await download(url, 'livcheers_1462.webp');
    console.log('Downloaded livcheers_1462.webp');
    await sharp('livcheers_1462.webp').png().toFile('livcheers_1462.png');
  } catch (e) {
    console.log('Download error:', e.message);
  }
}

main();



/******************************************************************************
 * SCRIPT: download_livcheers_4293.js
 ******************************************************************************/
const https = require('https');
const fs = require('fs');
const sharp = require('sharp');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Status ' + res.statusCode));
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close(() => resolve());
      });
    }).on('error', reject);
  });
}

async function main() {
  const url = 'https://static.livcheers.com/static/content/images/liquor/LCIN04293.webp';
  try {
    await download(url, 'livcheers_4293.webp');
    console.log('Downloaded livcheers_4293.webp');
    await sharp('livcheers_4293.webp').png().toFile('livcheers_4293.png');
  } catch (e) {
    console.log('Download error:', e.message);
  }
}

main();



/******************************************************************************
 * SCRIPT: download_radico_morph.js
 ******************************************************************************/
const https = require('https');
const http = require('http');
const fs = require('fs');
const sharp = require('sharp');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    proto.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Status ' + res.statusCode));
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close(() => resolve());
      });
    }).on('error', reject);
  });
}

async function main() {
  const url = 'https://radicokhaitan.com/wp-content/uploads/2019/03/Morpheus-Blue.jpg';
  try {
    await download(url, 'radico_morph.jpg');
    const m = await sharp('radico_morph.jpg').metadata();
    console.log('Radico Morpheus downloaded:', m);
    await sharp('radico_morph.jpg').png().toFile('radico_morph_preview.png');
    console.log('Saved radico_morph_preview.png');
  } catch (e) {
    console.log('Download error:', e.message);
  }
}

main();



/******************************************************************************
 * SCRIPT: download_v2.js
 ******************************************************************************/
const fs = require('fs');
const path = require('path');

const targets = {
  "MCD-NO1-750": "https://static.livcheers.com/static/content/images/liquor/LCIN01396.webp",
  "SN-WH-750": "https://static.livcheers.com/static/content/images/liquor/LCIN00667.webp",
  "BP-WH-750": "https://static.livcheers.com/static/content/images/liquor/LCIN01393.webp",
  "TEACH-SCO-750": "https://upload.wikimedia.org/wikipedia/commons/d/da/Teacher%27s_Highland_Cream_20cl_bottle_1.jpg",
  "MAGIC-VOD-750": "https://radicokhaitan.com/wp-content/uploads/2019/03/for-web-page.png"
};

async function dl() {
  for (const [id, url] of Object.entries(targets)) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      const buf = Buffer.from(await res.arrayBuffer());
      const ext = url.includes('.png') ? '.png' : (url.includes('.webp') ? '.webp' : '.jpg');
      const p = path.join(__dirname, 'raw_bottles', `${id}_v2${ext}`);
      fs.writeFileSync(p, buf);
      console.log(`Saved ${id}_v2${ext}: ${buf.length} bytes, status ${res.status}`);
    } catch (e) {
      console.error(id, e.message);
    }
  }
}

dl();



/******************************************************************************
 * SCRIPT: download_winepalace.js
 ******************************************************************************/
const https = require('https');
const http = require('http');
const fs = require('fs');
const sharp = require('sharp');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    proto.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Status ' + res.statusCode));
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close(() => resolve());
      });
    }).on('error', reject);
  });
}

async function main() {
  const url1 = 'https://winepalacegoa.com/wp-content/uploads/2026/06/MORPHEUS-BLUE-XO-e1782102028860.jpg';
  try {
    await download(url1, 'winepalace_morph.jpg');
    console.log('WinePalace Goa downloaded');
    await sharp('winepalace_morph.jpg').png().toFile('winepalace_morph.png');
  } catch (e) {
    console.log('WinePalace error:', e.message);
  }
}

main();



/******************************************************************************
 * SCRIPT: extract_morpheus.js
 ******************************************************************************/
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



/******************************************************************************
 * SCRIPT: find_cap.js
 ******************************************************************************/
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



/******************************************************************************
 * SCRIPT: find_focus.js
 ******************************************************************************/
const fs = require('fs');
const content = fs.readFileSync('C:/Users/Kasthuri/OneDrive/Desktop/Tasmac e commerce/index.html', 'utf8');
content.split('\n').forEach((line, i) => {
  if (line.includes('search-field') || line.includes('product-search-input') || line.includes(':focus')) {
    console.log(i + 1, line.trim());
  }
});



/******************************************************************************
 * SCRIPT: fix_bacardi.js
 ******************************************************************************/
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const src = 'C:/Users/Kasthuri/.gemini/antigravity/brain/25432ea9-c626-489f-b402-f7519e000f74/.user_uploaded/media_1791967808989_9f9bb793.png';
const out = 'C:/Users/Kasthuri/OneDrive/Desktop/Tasmac e commerce/images/BAC-SUP-750.png';

async function fixBacardi() {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const channels = 4;

  const visited = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let qStart = 0;
  let qEnd = 0;

  for (let x = 0; x < w; x++) {
    queue[qEnd++] = x;
    queue[qEnd++] = (h - 1) * w + x;
  }
  for (let y = 0; y < h; y++) {
    queue[qEnd++] = y * w;
    queue[qEnd++] = y * w + (w - 1);
  }

  while (qStart < qEnd) {
    const idx = queue[qStart++];
    if (idx < 0 || idx >= w * h) continue;
    if (visited[idx]) continue;
    visited[idx] = 1;

    const x = idx % w;
    const y = (idx / w) | 0;
    const p = idx * channels;

    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];

    // Checkerboard squares in Bacardi reference are neutral light grey/white (220 to 255 with abs diff <= 10)
    const isChecker = (r >= 215 && g >= 215 && b >= 215 && Math.abs(r - g) <= 10 && Math.abs(g - b) <= 10);

    if (isChecker) {
      data[p + 3] = 0; // Truly transparent!
      if (x > 0) queue[qEnd++] = idx - 1;
      if (x < w - 1) queue[qEnd++] = idx + 1;
      if (y > 0) queue[qEnd++] = idx - w;
      if (y < h - 1) queue[qEnd++] = idx + w;
    }
  }

  await sharp(data, {
    raw: { width: w, height: h, channels: 4 }
  })
  .png({ compressionLevel: 9 })
  .toFile(out);

  console.log('Fixed Bacardi transparency!');
}

fixBacardi();



/******************************************************************************
 * SCRIPT: fix_bud_corona.js
 ******************************************************************************/
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targetDir = path.join('C:', 'Users', 'Kasthuri', 'OneDrive', 'Desktop', 'Tasmac e commerce', 'images');

async function download(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  return Buffer.from(await res.arrayBuffer());
}

async function run() {
  try {
    const budBuf = await download('https://banner2.cleanpng.com/20180626/rig/aazvbglq5.webp');
    await sharp(budBuf).png().toFile(path.join(targetDir, 'BUD-MAG-650.png'));
    console.log('Saved BUD-MAG-650.png');
  } catch (e) {
    console.error('Budweiser error:', e.message);
  }

  try {
    const coronaBuf = await download('https://icon2.cleanpng.com/20180612/gui/aa8acsxws.webp');
    await sharp(coronaBuf).png().toFile(path.join(targetDir, 'CORONA-330.png'));
    console.log('Saved CORONA-330.png');
  } catch (e) {
    console.error('Corona error:', e.message);
  }
}

run();



/******************************************************************************
 * SCRIPT: fix_capt_jw.js
 ******************************************************************************/
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targetDir = path.join('C:', 'Users', 'Kasthuri', 'OneDrive', 'Desktop', 'Tasmac e commerce', 'images');

async function download(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  return Buffer.from(await res.arrayBuffer());
}

async function run() {
  // Captain Morgan
  try {
    const captBuf = await download('https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Captain_Morgan_Rum_-_Bottle.png/500px-Captain_Morgan_Rum_-_Bottle.png');
    await sharp(captBuf).png().toFile(path.join(targetDir, 'CAPT-MORG-750.png'));
    console.log('Saved CAPT-MORG-750.png');
  } catch (e) { console.error('Captain Morgan error:', e.message); }

  // Johnnie Walker Black Label
  try {
    const jwBuf = await download('https://banner2.cleanpng.com/20180624/par/aazmagjoe.webp');
    await sharp(jwBuf).png().toFile(path.join(targetDir, 'JW-BLK-750.png'));
    console.log('Saved JW-BLK-750.png');
  } catch (e) { console.error('JW error:', e.message); }
}

run();



/******************************************************************************
 * SCRIPT: generate_all_transparent_bottles.js
 ******************************************************************************/
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targetDir = path.join('C:', 'Users', 'Kasthuri', 'OneDrive', 'Desktop', 'Tasmac e commerce', 'images');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

// Complete 26-bottle manifest with pristine sources
const catalog = [
  {
    id: "AMRUT-SGL-750",
    url: "https://images.squarespace-cdn.com/content/v1/53ffc0fbe4b0e9e8825f8b00/1633391687286-4ZE4WJY9F3C6C5BZZF5X/AD_FUSION_BPW_E1250n.jpg",
    tolerance: 35
  },
  {
    id: "MCD-NO1-750",
    url: "https://static.livcheers.com/static/content/images/liquor/LCIN01385.webp",
    tolerance: 30
  },
  {
    id: "SN-WH-750",
    url: "https://images.ctfassets.net/vvbow7h7clgh/2xrVKW4x0n0sRmQbPRGRGV/7806bd934fed74152a1571183d2df5c4/030a2aa346543985a6628c82cc791d57c5b759b5.png",
    tolerance: 30
  },
  {
    id: "RC-WH-750",
    url: "https://static.livcheers.com/static/content/images/liquor/LCIN01707.webp",
    tolerance: 30
  },
  {
    id: "BP-WH-750",
    url: "https://static.livcheers.com/static/content/images/liquor/LCIN00956.webp",
    tolerance: 30
  },
  {
    id: "JW-BLK-750",
    url: "https://static.livcheers.com/static/content/images/liquor/LCIN01132.webp",
    tolerance: 30
  },
  {
    id: "TEACH-SCO-750",
    url: "https://static.livcheers.com/static/content/images/liquor/LCIN01131.webp",
    tolerance: 30
  },
  {
    id: "MH-BR-750",
    url: "https://cdn.sanity.io/images/wyd6cbsu/production/d996410b224b7a5262994ba60513b0aa66fe9a81-2167x2484.png?q=100&w=1080&q=75",
    tolerance: 30
  },
  {
    id: "MOR-XO-750",
    url: "https://static.livcheers.com/static/content/images/liquor/LCIN01462.webp",
    tolerance: 30
  },
  {
    id: "COUR-NAP-750",
    url: "https://tilind.com/wp-content/uploads/2022/02/CNB-Green-600-x-600px.jpg",
    tolerance: 30
  },
  {
    id: "KY-BR-750",
    url: "https://static.livcheers.com/static/content/images/liquor/LCIN03916.webp",
    tolerance: 30
  },
  {
    id: "MC-WH-750",
    url: "https://static.livcheers.com/static/content/images/liquor/LCIN01534.webp",
    tolerance: 30
  },
  {
    id: "BAC-SUP-750",
    local: "C:\\Users\\Kasthuri\\OneDrive\\Desktop\\Tasmac e commerce\\images\\bacardi-superior.png",
    tolerance: 30
  },
  {
    id: "CAPT-MORG-750",
    url: "https://images.ctfassets.net/s46nvf89460z/4Lba3H0dB3lfEIZrQQknXE/f214c6bddb0967122a79c37bad9d3961/product_us_hero-2.png",
    tolerance: 30
  },
  {
    id: "OLD-PORT-750",
    url: "https://static.livcheers.com/static/content/images/liquor/LCIN02492.webp",
    tolerance: 30
  },
  {
    id: "KF-PR-650",
    url: "https://static.livcheers.com/static/content/images/liquor/LCIN01184.webp",
    tolerance: 30
  },
  {
    id: "KF-ULTRA-650",
    url: "https://static.livcheers.com/static/content/images/liquor/LCIN01186.webp",
    tolerance: 30
  },
  {
    id: "BUD-MAG-650",
    url: "https://www.pngall.com/wp-content/uploads/14/Budweiser-Bottle-thumb.webp",
    tolerance: 30
  },
  {
    id: "BP-BR-650",
    url: "https://snjgroup.com/uploads/brewery/1691151095.jpg",
    tolerance: 35
  },
  {
    id: "CORONA-330",
    url: "https://www.pngall.com/wp-content/uploads/15/Corona-Beer-No-Background-thumb.webp",
    tolerance: 30
  },
  {
    id: "BIRA-WHT-500",
    url: "https://static.livcheers.com/static/content/images/liquor/LCIN02200.webp",
    tolerance: 30
  },
  {
    id: "MAGIC-VOD-750",
    url: "https://static.livcheers.com/static/content/images/liquor/LCIN00472.webp",
    tolerance: 30
  },
  {
    id: "SMIR-RED-750",
    url: "https://www.diageo.com/~/media/Images/D/Diageo-V2/Universal/product-carousel/smirnoff-classic-no-21.png",
    tolerance: 30
  },
  {
    id: "SULA-SH-750",
    url: "https://static.livcheers.com/static/content/images/liquor/LCIN01896.webp",
    tolerance: 30
  },
  {
    id: "FRAT-MER-750",
    url: "https://fratelliwines.in/cdn/shop/files/Classic_Merlot_ba06a5dc-c84b-4d5f-b222-f16429b99550_800x.png",
    tolerance: 30
  },
  {
    id: "BOMBAY-SAPH-750",
    url: "https://static.livcheers.com/static/content/images/liquor/LCIN00310.webp",
    tolerance: 30
  }
];

async function removeBackgroundAndSave(inputBuffer, outputPath, tolerance = 30) {
  const image = sharp(inputBuffer);
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const channels = 4;

  const getPixel = (x, y) => {
    const idx = (y * w + x) * channels;
    return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
  };

  const c1 = getPixel(0, 0);
  const c2 = getPixel(w - 1, 0);
  const c3 = getPixel(0, h - 1);
  const c4 = getPixel(w - 1, h - 1);

  // If already transparent in the corners, save directly
  if (c1[3] === 0 && c2[3] === 0 && c3[3] === 0 && c4[3] === 0) {
    await sharp(inputBuffer).png({ compressionLevel: 9 }).toFile(outputPath);
    console.log(`Saved transparent PNG (already transparent): ${path.basename(outputPath)}`);
    return;
  }

  const bgR = (c1[0] + c2[0] + c3[0] + c4[0]) / 4;
  const bgG = (c1[1] + c2[1] + c3[1] + c4[1]) / 4;
  const bgB = (c1[2] + c2[2] + c3[2] + c4[2]) / 4;

  const visited = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let qStart = 0;
  let qEnd = 0;

  for (let x = 0; x < w; x++) {
    queue[qEnd++] = x;
    queue[qEnd++] = (h - 1) * w + x;
  }
  for (let y = 0; y < h; y++) {
    queue[qEnd++] = y * w;
    queue[qEnd++] = y * w + (w - 1);
  }

  while (qStart < qEnd) {
    const idx = queue[qStart++];
    if (idx < 0 || idx >= w * h) continue;
    if (visited[idx]) continue;
    visited[idx] = 1;

    const x = idx % w;
    const y = (idx / w) | 0;
    const p = idx * channels;

    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const a = data[p + 3];

    if (a === 0) {
      if (x > 0) queue[qEnd++] = idx - 1;
      if (x < w - 1) queue[qEnd++] = idx + 1;
      if (y > 0) queue[qEnd++] = idx - w;
      if (y < h - 1) queue[qEnd++] = idx + w;
      continue;
    }

    const dist = Math.sqrt((r - bgR)**2 + (g - bgG)**2 + (b - bgB)**2);
    const isLight = (r > 220 && g > 220 && b > 220);

    if (dist <= tolerance || isLight) {
      data[p + 3] = 0; // alpha = 0 (Transparent)
      if (x > 0) queue[qEnd++] = idx - 1;
      if (x < w - 1) queue[qEnd++] = idx + 1;
      if (y > 0) queue[qEnd++] = idx - w;
      if (y < h - 1) queue[qEnd++] = idx + w;
    }
  }

  await sharp(data, {
    raw: { width: w, height: h, channels: 4 }
  })
  .png({ compressionLevel: 9 })
  .toFile(outputPath);

  console.log(`Saved transparent PNG: ${path.basename(outputPath)}`);
}

async function main() {
  for (const item of catalog) {
    const outFile = path.join(targetDir, `${item.id}.png`);
    try {
      let buffer;
      if (item.local) {
        buffer = fs.readFileSync(item.local);
      } else {
        const res = await fetch(item.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
          }
        });
        if (!res.ok) {
          console.error(`Failed to fetch ${item.id} from ${item.url}: ${res.status}`);
          continue;
        }
        buffer = Buffer.from(await res.arrayBuffer());
      }

      await removeBackgroundAndSave(buffer, outFile, item.tolerance);
    } catch (err) {
      console.error(`Error processing ${item.id}:`, err.message);
    }
  }
}

main().then(() => console.log('ALL BOTTLES PROCESSED!'));



/******************************************************************************
 * SCRIPT: generate_perfect_amrut.js
 ******************************************************************************/
const sharp = require('sharp');
const fs = require('fs');

async function buildPerfectAmrut() {
  const { data, info } = await sharp('raw_bottles/AMRUT-SGL-750.jpg').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width; // 822
  const h = info.height; // 1250

  const visited = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let qStart = 0;
  let qEnd = 0;

  function push(idx) {
    if (idx >= 0 && idx < w * h && !visited[idx]) {
      visited[idx] = 1;
      queue[qEnd++] = idx;
    }
  }

  // Push all 4 borders
  for (let x = 0; x < w; x++) {
    push(x);
    push((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    push(y * w);
    push(y * w + (w - 1));
  }

  while (qStart < qEnd) {
    const idx = queue[qStart++];
    const x = idx % w;
    const y = (idx / w) | 0;
    const p = idx * 4;

    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];

    // Background conditions:
    // Pure white or studio near-white:
    const isPureWhite = (r >= 240 && g >= 240 && b >= 240);
    const isStudioWhite = (r >= 215 && g >= 215 && b >= 215 && Math.abs(r - g) < 18 && Math.abs(g - b) < 18);

    // Floor shadow at the bottom (y > 1180):
    // Shadow is neutral gray (r, g, b close together, r < 210, abs diff < 25)
    // The bottle base and tube base have distinct colors:
    // Bottle base has amber/gold (r > 100, g > 60, b < 40, r - b > 50)
    // Tube base has maroon/burgundy (r > 60, g < 40, b < 40, r - g > 30)
    const isFloorShadow = (y > 1190 && r >= 140 && g >= 140 && b >= 140 && Math.abs(r - g) < 22 && Math.abs(g - b) < 22);

    if (isPureWhite || isStudioWhite || isFloorShadow) {
      data[p + 3] = 0;
      if (x > 0) push(idx - 1);
      if (x < w - 1) push(idx + 1);
      if (y > 0) push(idx - w);
      if (y < h - 1) push(idx + w);
    }
  }

  // Bounding box of remaining bottle + tube
  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log('Amrut Fusion BBox:', { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 });

  await sharp(data, {
    raw: { width: w, height: h, channels: 4 }
  })
  .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
  .extend({ top: 15, bottom: 15, left: 15, right: 15, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile('test_amrut_fusion_full.png');

  console.log('Saved test_amrut_fusion_full.png');
}

buildPerfectAmrut().catch(console.error);



/******************************************************************************
 * SCRIPT: generate_perfect_kyron.js
 ******************************************************************************/
const sharp = require('sharp');
const fs = require('fs');

async function buildPerfectKyron() {
  const { data, info } = await sharp('raw_bottles/KY-BR-750.webp').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width; // 801
  const h = info.height; // 531

  const visited = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let qStart = 0;
  let qEnd = 0;

  function push(idx) {
    if (idx >= 0 && idx < w * h && !visited[idx]) {
      visited[idx] = 1;
      queue[qEnd++] = idx;
    }
  }

  // Push all 4 borders
  for (let x = 0; x < w; x++) {
    push(x);
    push((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    push(y * w);
    push(y * w + (w - 1));
  }

  while (qStart < qEnd) {
    const idx = queue[qStart++];
    const x = idx % w;
    const y = (idx / w) | 0;
    const p = idx * 4;

    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];

    // Background conditions:
    // 1. Pure white or studio near-white:
    const isPureWhite = (r >= 235 && g >= 235 && b >= 235);
    const isStudioWhite = (r >= 200 && g >= 200 && b >= 200 && Math.abs(r - g) < 22 && Math.abs(g - b) < 22);
    
    // 2. Floor shadow underneath:
    // Floor shadow has low color difference (r - b < 48, g - b < 35)
    // Box and bottle have strong amber/gold (r - b > 65)
    const isFloorShadow = (y > 400 && r >= 135 && g >= 120 && b >= 100 && (r - b) < 48);

    // Deep shadow under the bottle base (y > 460):
    const isUnderBottleShadow = (y > 462 && (r - b) < 52);

    // Deep shadow under the box (y > 425, x > 400):
    const isUnderBoxShadow = (y > 425 && x > 400 && (r - b) < 52);

    if (isPureWhite || isStudioWhite || isFloorShadow || isUnderBottleShadow || isUnderBoxShadow) {
      data[p + 3] = 0;
      if (x > 0) push(idx - 1);
      if (x < w - 1) push(idx + 1);
      if (y > 0) push(idx - w);
      if (y < h - 1) push(idx + w);
    }
  }

  // Bounding box
  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log('Kyron BBox:', { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 });

  await sharp(data, {
    raw: { width: w, height: h, channels: 4 }
  })
  .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
  .extend({ top: 12, bottom: 12, left: 12, right: 12, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile('perfect_kyron.png');

  console.log('Saved perfect_kyron.png');
}

buildPerfectKyron().catch(console.error);



/******************************************************************************
 * SCRIPT: generate_perfect_morpheus.js
 ******************************************************************************/
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



/******************************************************************************
 * SCRIPT: generate_perfect_rc.js
 ******************************************************************************/
const sharp = require('sharp');
const fs = require('fs');

async function buildPerfectRC() {
  const { data, info } = await sharp('raw_bottles/RC-WH-750.webp').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  console.log('RC raw dimensions:', w, h);

  const visited = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let qStart = 0;
  let qEnd = 0;

  function push(idx) {
    if (idx >= 0 && idx < w * h && !visited[idx]) {
      visited[idx] = 1;
      queue[qEnd++] = idx;
    }
  }

  // Push all 4 borders
  for (let x = 0; x < w; x++) {
    push(x);
    push((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    push(y * w);
    push(y * w + (w - 1));
  }

  while (qStart < qEnd) {
    const idx = queue[qStart++];
    const x = idx % w;
    const y = (idx / w) | 0;
    const p = idx * 4;

    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];

    // Background conditions:
    // Pure white or studio near-white:
    const isPureWhite = (r >= 235 && g >= 235 && b >= 235);
    const isStudioWhite = (r >= 210 && g >= 210 && b >= 210 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20);

    // Light floor shadow (y > 360, neutral light shadow):
    const isFloorShadow = (y > 360 && r >= 150 && g >= 150 && b >= 150 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20);

    if (isPureWhite || isStudioWhite || isFloorShadow) {
      data[p + 3] = 0;
      if (x > 0) push(idx - 1);
      if (x < w - 1) push(idx + 1);
      if (y > 0) push(idx - w);
      if (y < h - 1) push(idx + w);
    }
  }

  // Bounding box of remaining bottle + box
  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log('RC BBox:', { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 });

  await sharp(data, {
    raw: { width: w, height: h, channels: 4 }
  })
  .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
  .extend({ top: 12, bottom: 12, left: 12, right: 12, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile('test_rc_full.png');

  console.log('Saved test_rc_full.png');
}

buildPerfectRC().catch(console.error);



/******************************************************************************
 * SCRIPT: inspect_amrut_corners.js
 ******************************************************************************/
const sharp = require('sharp');

async function inspectCorners() {
  const { data, info } = await sharp('raw_bottles/AMRUT-SGL-750.jpg').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  const getP = (x, y) => {
    const idx = (y * w + x) * 3;
    return [data[idx], data[idx + 1], data[idx + 2]];
  };

  console.log('Top-left (0,0):', getP(0, 0));
  console.log('Top-right (w-1,0):', getP(w - 1, 0));
  console.log('Bottom-left (0,h-1):', getP(0, h - 1));
  console.log('Bottom-right (w-1,h-1):', getP(w - 1, h - 1));
}

inspectCorners();



/******************************************************************************
 * SCRIPT: inspect_bottom.js
 ******************************************************************************/
const sharp = require('sharp');

async function inspectBottom() {
  const { data, info } = await sharp('raw_bottles/MOR-XO-750.jpg').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  console.log('--- Inspecting base along x = 100, 150, 200, 250, 300, 350, 400 ---');
  for (const x of [100, 150, 200, 250, 300, 350, 400]) {
    for (let y = 695; y <= 708; y++) {
      const idx = (y * w + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      if (r < 15 && g < 15 && b < 30) {
        console.log(`x=${x} base ends at y=${y-1}: [${r}, ${g}, ${b}] at y=${y}`);
        break;
      }
    }
  }
}

inspectBottom();



/******************************************************************************
 * SCRIPT: inspect_canister_base.js
 ******************************************************************************/
const sharp = require('sharp');

async function inspectCanisterBase() {
  const { data, info } = await sharp('raw_bottles/MOR-XO-750.jpg').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  for (const x of [100, 150, 200]) {
    console.log(`--- x = ${x} ---`);
    for (let y = 690; y <= 710; y += 2) {
      const idx = (y * w + x) * 3;
      console.log(`y=${y}: [${data[idx]}, ${data[idx+1]}, ${data[idx+2]}]`);
    }
  }
}

inspectCanisterBase();



/******************************************************************************
 * SCRIPT: inspect_corners.js
 ******************************************************************************/
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



/******************************************************************************
 * SCRIPT: inspect_edges.js
 ******************************************************************************/
const sharp = require('sharp');
const fs = require('fs');

async function inspectEdges() {
  const { data, info } = await sharp('raw_bottles/MOR-XO-750.jpg').raw().toBuffer({ resolveWithObject: true });
  const w = info.width; // 574
  const h = info.height; // 779

  // Let's inspect along y = 500 across x from 0 to 574
  // Canister left edge is around x = 90-100
  console.log('--- Scanning horizontal line y = 500 across x = 70 to 130 ---');
  for (let x = 75; x <= 120; x += 3) {
    const idx = (500 * w + x) * 3;
    console.log(`x=${x}: [${data[idx]}, ${data[idx+1]}, ${data[idx+2]}]`);
  }

  // Scanning canister top lid along x = 250 across y = 330 to 365
  console.log('--- Scanning vertical line x = 250 across y = 330 to 365 ---');
  for (let y = 330; y <= 365; y += 3) {
    const idx = (y * w + 250) * 3;
    console.log(`y=${y}: [${data[idx]}, ${data[idx+1]}, ${data[idx+2]}]`);
  }

  // Scanning right edge of bottle along y = 550 across x = 460 to 510
  console.log('--- Scanning horizontal line y = 550 across x = 460 to 510 ---');
  for (let x = 460; x <= 510; x += 3) {
    const idx = (550 * w + x) * 3;
    console.log(`x=${x}: [${data[idx]}, ${data[idx+1]}, ${data[idx+2]}]`);
  }

  // Scanning bottom base of bottle along x = 380 across y = 685 to 720
  console.log('--- Scanning vertical line x = 380 across y = 685 to 720 ---');
  for (let y = 685; y <= 720; y += 3) {
    const idx = (y * w + 380) * 3;
    console.log(`y=${y}: [${data[idx]}, ${data[idx+1]}, ${data[idx+2]}]`);
  }
}

inspectEdges();



/******************************************************************************
 * SCRIPT: inspect_kyron_base.js
 ******************************************************************************/
const sharp = require('sharp');

async function inspectKyronBase() {
  const { data, info } = await sharp('raw_bottles/KY-BR-750.webp').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  console.log('Inspecting Kyron base:');
  // Box right base: x = 520 to 590, y = 380 to 450
  for (let y = 400; y <= 450; y += 5) {
    const idx = (y * w + 550) * 3;
    console.log(`Box base x=550 y=${y}: [${data[idx]}, ${data[idx+1]}, ${data[idx+2]}]`);
  }

  // Bottle base: x = 250 to 350, y = 440 to 490
  for (let y = 440; y <= 490; y += 5) {
    const idx = (y * w + 300) * 3;
    console.log(`Bottle base x=300 y=${y}: [${data[idx]}, ${data[idx+1]}, ${data[idx+2]}]`);
  }
}

inspectKyronBase();



/******************************************************************************
 * SCRIPT: inspect_left_foot.js
 ******************************************************************************/
const sharp = require('sharp');

async function inspectLeftFoot() {
  const { data, info } = await sharp('raw_bottles/KY-BR-750.webp').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  console.log('Inspecting Kyron left foot:');
  for (let y = 445; y <= 475; y += 5) {
    for (let x = 200; x <= 250; x += 10) {
      const idx = (y * w + x) * 3;
      console.log(`x=${x} y=${y}: [${data[idx]}, ${data[idx+1]}, ${data[idx+2]}]`);
    }
  }
}

inspectLeftFoot();



/******************************************************************************
 * SCRIPT: inspect_lower_right.js
 ******************************************************************************/
const sharp = require('sharp');

async function inspectLowerRight() {
  const { data, info } = await sharp('raw_bottles/MOR-XO-750.jpg').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  console.log('Inspecting lower right bottle edge:');
  for (let y = 580; y <= 703; y += 15) {
    console.log(`--- y = ${y} ---`);
    for (let x = 410; x <= 490; x += 5) {
      const idx = (y * w + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      // Check bottle vs background
      console.log(`x=${x}: [${r}, ${g}, ${b}]`);
    }
  }
}

inspectLowerRight();



/******************************************************************************
 * SCRIPT: inspect_mor_ky.js
 ******************************************************************************/
const sharp = require('sharp');
const fs = require('fs');

async function main() {
  const m1 = await sharp('raw_bottles/MOR-XO-750.jpg').metadata();
  console.log('MOR-XO-750 raw:', m1);

  const m2 = await sharp('raw_bottles/KY-BR-750.webp').metadata();
  console.log('KY-BR-750 raw:', m2);

  const cur1 = await sharp('C:/Users/Kasthuri/OneDrive/Desktop/Tasmac e commerce/images/MOR-XO-750.png').metadata();
  console.log('MOR-XO-750 current in images/:', cur1);

  const cur2 = await sharp('C:/Users/Kasthuri/OneDrive/Desktop/Tasmac e commerce/images/KY-BR-750.png').metadata();
  console.log('KY-BR-750 current in images/:', cur2);
}

main().catch(console.error);



/******************************************************************************
 * SCRIPT: inspect_neck_edge.js
 ******************************************************************************/
const sharp = require('sharp');

async function inspectNeckEdge() {
  const { data, info } = await sharp('raw_bottles/MOR-XO-750.jpg').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  for (let y = 350; y <= 440; y += 15) {
    console.log(`--- y = ${y} ---`);
    for (let x = 380; x <= 415; x += 3) {
      const idx = (y * w + x) * 3;
      console.log(`x=${x}: [${data[idx]}, ${data[idx+1]}, ${data[idx+2]}]`);
    }
  }
}

inspectNeckEdge();



/******************************************************************************
 * SCRIPT: inspect_shoulder.js
 ******************************************************************************/
const sharp = require('sharp');

async function inspectShoulder() {
  const { data, info } = await sharp('raw_bottles/MOR-XO-750.jpg').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  for (let y = 445; y <= 520; y += 10) {
    let edgeX = 402;
    for (let x = 400; x <= 490; x++) {
      const idx = (y * w + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      // Cathedral arch has r > b + 15 or (r > 60 && g > 55 && b < 70)
      if (b > r && (b > 50 || b > g)) {
        edgeX = x;
      }
    }
    console.log(`y=${y}: edgeX = ${edgeX}`);
  }
}

inspectShoulder();



/******************************************************************************
 * SCRIPT: inspect_specific.js
 ******************************************************************************/
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function inspectImages() {
  const checkList = ['BP-BR-650.png', 'JW-BLK-750.png', 'MH-BR-750.png', 'TEACH-SCO-750.png'];
  const dir = 'C:/Users/Kasthuri/OneDrive/Desktop/Tasmac e commerce/images';
  for (const f of checkList) {
    const p = path.join(dir, f);
    const m = await sharp(p).metadata();
    console.log(f, m.width, m.height);
  }
}

inspectImages();



/******************************************************************************
 * SCRIPT: inspect_top.js
 ******************************************************************************/
const sharp = require('sharp');
const fs = require('fs');

async function inspectTop() {
  const { data, info } = await sharp('raw_bottles/MOR-XO-750.jpg').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  console.log('--- Scanning top of canister across various x ---');
  for (let x = 100; x <= 340; x += 20) {
    for (let y = 330; y <= 365; y += 2) {
      const idx = (y * w + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      // Find where blue canister begins (b > r + 20 or b > 60 and r < 30)
      if (b > r + 25 && b > 60) {
        console.log(`x=${x} canister top at y=${y}: [${r}, ${g}, ${b}]`);
        break;
      }
    }
  }

  console.log('--- Scanning bottle cap (x = 340 to 450) ---');
  for (let x = 340; x <= 450; x += 15) {
    for (let y = 405; y <= 430; y += 2) {
      const idx = (y * w + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      // Cap rim has blue/cyan or black with blue
      if (b > r + 15 || (r < 30 && g < 50 && b > 40)) {
        console.log(`x=${x} bottle cap at y=${y}: [${r}, ${g}, ${b}]`);
        break;
      }
    }
  }
}

inspectTop();



/******************************************************************************
 * SCRIPT: install_amrut.js
 ******************************************************************************/
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function installAmrut() {
  const target = 'C:/Users/Kasthuri/OneDrive/Desktop/Tasmac e commerce/images/AMRUT-SGL-750.png';
  fs.copyFileSync('test_amrut_fusion_full.png', target);
  console.log('Installed AMRUT-SGL-750.png');

  const meta = await sharp(target).metadata();
  console.log('AMRUT-SGL-750 in images/:', meta.width, 'x', meta.height, 'alpha:', meta.hasAlpha);
}

installAmrut().catch(console.error);



/******************************************************************************
 * SCRIPT: install_images.js
 ******************************************************************************/
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function installImages() {
  const targetDir = 'C:/Users/Kasthuri/OneDrive/Desktop/Tasmac e commerce/images';

  fs.copyFileSync('perfect_morpheus_blue.png', path.join(targetDir, 'MOR-XO-750.png'));
  console.log('Installed MOR-XO-750.png');

  fs.copyFileSync('perfect_kyron.png', path.join(targetDir, 'KY-BR-750.png'));
  console.log('Installed KY-BR-750.png');

  const m1 = await sharp(path.join(targetDir, 'MOR-XO-750.png')).metadata();
  console.log('MOR-XO-750 in images/:', m1.width, 'x', m1.height, 'alpha:', m1.hasAlpha);

  const m2 = await sharp(path.join(targetDir, 'KY-BR-750.png')).metadata();
  console.log('KY-BR-750 in images/:', m2.width, 'x', m2.height, 'alpha:', m2.hasAlpha);
}

installImages().catch(console.error);



/******************************************************************************
 * SCRIPT: install_rc.js
 ******************************************************************************/
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function installRC() {
  const target = 'C:/Users/Kasthuri/OneDrive/Desktop/Tasmac e commerce/images/RC-WH-750.png';
  fs.copyFileSync('test_rc_full.png', target);
  console.log('Installed RC-WH-750.png');

  const meta = await sharp(target).metadata();
  console.log('RC-WH-750 in images/:', meta.width, 'x', meta.height, 'alpha:', meta.hasAlpha);
}

installRC().catch(console.error);



/******************************************************************************
 * SCRIPT: process_kyron_full.js
 ******************************************************************************/
const sharp = require('sharp');
const fs = require('fs');

async function processKyronFull() {
  const { data, info } = await sharp('raw_bottles/KY-BR-750.webp').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  const visited = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let qStart = 0;
  let qEnd = 0;

  function push(idx) {
    if (idx >= 0 && idx < w * h && !visited[idx]) {
      visited[idx] = 1;
      queue[qEnd++] = idx;
    }
  }

  // Push all border pixels
  for (let x = 0; x < w; x++) {
    push(x);
    push((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    push(y * w);
    push(y * w + (w - 1));
  }

  while (qStart < qEnd) {
    const idx = queue[qStart++];
    const x = idx % w;
    const y = (idx / w) | 0;
    const p = idx * 4;

    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];

    // Check if background:
    // Pure white or studio near-white, or floor shadow (light grayish/pinkish shadow where r,g,b > 180 and close together)
    // The box is distinctly gold/yellow (r is much higher than b, e.g. r - b > 30)
    // The bottle has brandy color (amber/gold, r - b > 40)
    // Clear glass highlights: let's be careful not to eat into the bottle cap or glass
    
    // Background condition:
    const isPureWhite = (r >= 245 && g >= 245 && b >= 245);
    const isStudioWhite = (r >= 225 && g >= 225 && b >= 225 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20);
    const isFloorShadow = (y > 400 && r >= 170 && g >= 160 && b >= 160 && (r - b) < 35 && g > 150);

    if (isPureWhite || isStudioWhite || isFloorShadow) {
      data[p + 3] = 0; // make transparent
      if (x > 0) push(idx - 1);
      if (x < w - 1) push(idx + 1);
      if (y > 0) push(idx - w);
      if (y < h - 1) push(idx + w);
    }
  }

  // Bounding box of all remaining pixels
  let minX = w, maxX = 0, minY = h, maxY = 0;
  let count = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = (y * w + x) * 4;
      if (data[p + 3] > 0) {
        count++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log('Kyron full remaining pixels:', count, 'bbox:', { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 });

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;

  await sharp(data, {
    raw: { width: w, height: h, channels: 4 }
  })
  .extract({ left: minX, top: minY, width: cropW, height: cropH })
  .extend({ top: 15, bottom: 15, left: 15, right: 15, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile('test_kyron_full.png');

  console.log('Saved test_kyron_full.png');
}

processKyronFull().catch(console.error);



/******************************************************************************
 * SCRIPT: process_v2.js
 ******************************************************************************/
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targetDir = path.join('C:', 'Users', 'Kasthuri', 'OneDrive', 'Desktop', 'Tasmac e commerce', 'images');

async function removeBackgroundAndSave(inputBuffer, outputPath, tolerance = 30) {
  const image = sharp(inputBuffer);
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const channels = 4;

  const getPixel = (x, y) => {
    const idx = (y * w + x) * channels;
    return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
  };

  const c1 = getPixel(0, 0);
  const c2 = getPixel(w - 1, 0);
  const c3 = getPixel(0, h - 1);
  const c4 = getPixel(w - 1, h - 1);

  if (c1[3] === 0 && c2[3] === 0 && c3[3] === 0 && c4[3] === 0) {
    await sharp(inputBuffer).png({ compressionLevel: 9 }).toFile(outputPath);
    console.log(`Saved transparent PNG (already transparent): ${path.basename(outputPath)}`);
    return;
  }

  const bgR = (c1[0] + c2[0] + c3[0] + c4[0]) / 4;
  const bgG = (c1[1] + c2[1] + c3[1] + c4[1]) / 4;
  const bgB = (c1[2] + c2[2] + c3[2] + c4[2]) / 4;

  const visited = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let qStart = 0;
  let qEnd = 0;

  for (let x = 0; x < w; x++) {
    queue[qEnd++] = x;
    queue[qEnd++] = (h - 1) * w + x;
  }
  for (let y = 0; y < h; y++) {
    queue[qEnd++] = y * w;
    queue[qEnd++] = y * w + (w - 1);
  }

  while (qStart < qEnd) {
    const idx = queue[qStart++];
    if (idx < 0 || idx >= w * h) continue;
    if (visited[idx]) continue;
    visited[idx] = 1;

    const x = idx % w;
    const y = (idx / w) | 0;
    const p = idx * channels;

    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const a = data[p + 3];

    if (a === 0) {
      if (x > 0) queue[qEnd++] = idx - 1;
      if (x < w - 1) queue[qEnd++] = idx + 1;
      if (y > 0) queue[qEnd++] = idx - w;
      if (y < h - 1) queue[qEnd++] = idx + w;
      continue;
    }

    const dist = Math.sqrt((r - bgR)**2 + (g - bgG)**2 + (b - bgB)**2);
    const isLight = (r > 220 && g > 220 && b > 220);

    if (dist <= tolerance || isLight) {
      data[p + 3] = 0;
      if (x > 0) queue[qEnd++] = idx - 1;
      if (x < w - 1) queue[qEnd++] = idx + 1;
      if (y > 0) queue[qEnd++] = idx - w;
      if (y < h - 1) queue[qEnd++] = idx + w;
    }
  }

  await sharp(data, {
    raw: { width: w, height: h, channels: 4 }
  })
  .png({ compressionLevel: 9 })
  .toFile(outputPath);

  console.log(`Saved transparent PNG: ${path.basename(outputPath)}`);
}

async function run() {
  const list = [
    { id: "MCD-NO1-750", file: "raw_bottles/MCD-NO1-750_v2.webp" },
    { id: "SN-WH-750", file: "raw_bottles/SN-WH-750_v2.webp" },
    { id: "BP-WH-750", file: "raw_bottles/BP-WH-750_v2.webp" },
    { id: "TEACH-SCO-750", file: "raw_bottles/TEACH-SCO-750_v2.jpg" },
    { id: "MAGIC-VOD-750", file: "raw_bottles/MAGIC-VOD-750_v2.png" }
  ];

  for (const item of list) {
    const buf = fs.readFileSync(item.file);
    const out = path.join(targetDir, `${item.id}.png`);
    await removeBackgroundAndSave(buf, out, 30);
  }
}

run();



/******************************************************************************
 * SCRIPT: sample_jw.js
 ******************************************************************************/
const sharp = require('sharp');
const path = require('path');

async function check() {
  const p = path.join('C:', 'Users', 'Kasthuri', 'OneDrive', 'Desktop', 'Tasmac e commerce', 'images', 'JW-BLK-750.png');
  const { data, info } = await sharp(p).raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  // Sample along x=20 from y=0 to 100
  const samples = [];
  for (let y = 0; y < 100; y += 10) {
    const idx = (y * w + 20) * 4;
    samples.push(`y=${y}: [${data[idx]},${data[idx+1]},${data[idx+2]},${data[idx+3]}]`);
  }
  console.log(samples.join('\n'));
}

check();



/******************************************************************************
 * SCRIPT: strip_checkerboards.js
 ******************************************************************************/
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targetDir = path.join('C:', 'Users', 'Kasthuri', 'OneDrive', 'Desktop', 'Tasmac e commerce', 'images');

async function removeCheckerboard(inputPath, outputPath, cropLeftPct = 0, cropWidthPct = 1.0) {
  let image = sharp(inputPath);
  const meta = await image.metadata();

  if (cropLeftPct > 0 || cropWidthPct < 1.0) {
    const left = Math.floor(meta.width * cropLeftPct);
    const width = Math.floor(meta.width * cropWidthPct);
    image = image.extract({ left, top: 0, width, height: meta.height });
  }

  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const channels = 4;

  const visited = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let qStart = 0;
  let qEnd = 0;

  for (let x = 0; x < w; x++) {
    queue[qEnd++] = x;
    queue[qEnd++] = (h - 1) * w + x;
  }
  for (let y = 0; y < h; y++) {
    queue[qEnd++] = y * w;
    queue[qEnd++] = y * w + (w - 1);
  }

  while (qStart < qEnd) {
    const idx = queue[qStart++];
    if (idx < 0 || idx >= w * h) continue;
    if (visited[idx]) continue;
    visited[idx] = 1;

    const x = idx % w;
    const y = (idx / w) | 0;
    const p = idx * channels;

    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const a = data[p + 3];

    if (a === 0) {
      if (x > 0) queue[qEnd++] = idx - 1;
      if (x < w - 1) queue[qEnd++] = idx + 1;
      if (y > 0) queue[qEnd++] = idx - w;
      if (y < h - 1) queue[qEnd++] = idx + w;
      continue;
    }

    // Checkerboard squares are pure white or neutral grey >= 180 with abs diff < 15
    const isChecker = (r >= 175 && g >= 175 && b >= 175 && Math.abs(r - g) <= 12 && Math.abs(g - b) <= 12);

    if (isChecker) {
      data[p + 3] = 0; // Transparent!
      if (x > 0) queue[qEnd++] = idx - 1;
      if (x < w - 1) queue[qEnd++] = idx + 1;
      if (y > 0) queue[qEnd++] = idx - w;
      if (y < h - 1) queue[qEnd++] = idx + w;
    }
  }

  await sharp(data, {
    raw: { width: w, height: h, channels: 4 }
  })
  .png({ compressionLevel: 9 })
  .toFile(outputPath);

  console.log(`Successfully de-checkerboarded: ${path.basename(outputPath)}`);
}

async function run() {
  await removeCheckerboard(path.join(targetDir, 'BUD-MAG-650.png'), path.join(targetDir, 'BUD-MAG-650.png'));
  await removeCheckerboard(path.join(targetDir, 'CORONA-330.png'), path.join(targetDir, 'CORONA-330.png'), 0, 0.50);
  await removeCheckerboard(path.join(targetDir, 'JW-BLK-750.png'), path.join(targetDir, 'JW-BLK-750.png'));
  await removeCheckerboard(path.join(targetDir, 'MAGIC-VOD-750.png'), path.join(targetDir, 'MAGIC-VOD-750.png'));
}

run().catch(console.error);



/******************************************************************************
 * SCRIPT: test_amrut.js
 ******************************************************************************/
const sharp = require('sharp');

async function testAmrut() {
  const m = await sharp('raw_bottles/AMRUT-SGL-750.jpg').metadata();
  console.log('Amrut raw:', m.width, 'x', m.height);
}

testAmrut();



/******************************************************************************
 * SCRIPT: test_contour.js
 ******************************************************************************/
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



/******************************************************************************
 * SCRIPT: test_download.js
 ******************************************************************************/
const fs = require('fs');
const path = require('path');

async function test() {
  const url = 'https://images.ctfassets.net/vvbow7h7clgh/2xrVKW4x0n0sRmQbPRGRGV/7806bd934fed74152a1571183d2df5c4/030a2aa346543985a6628c82cc791d57c5b759b5.png';
  const outPath = path.join('C:', 'Users', 'Kasthuri', 'OneDrive', 'Desktop', 'Tasmac e commerce', 'images', 'signature.png');
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  fs.writeFileSync(outPath, Buffer.from(buf));
  console.log('Saved signature.png, size:', buf.byteLength);
}

test().catch(console.error);



/******************************************************************************
 * SCRIPT: test_mm.js
 ******************************************************************************/
async function test() {
  const res = await fetch('https://icon2.cleanpng.com/20180714/lzt/d56fd47cc14e4f3ab81b4bd3e8e0d5ee.webp', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  console.log('Magic Moments status:', res.status, 'size:', res.headers.get('content-length'));
}
test();



/******************************************************************************
 * SCRIPT: test_sharp.js
 ******************************************************************************/
try {
  const sharp = require('sharp');
  console.log('SHARP IS WORKING!', sharp.versions);
} catch (e) {
  console.error('Sharp error:', e.message);
}



/******************************************************************************
 * SCRIPT: test_sharp_cutout.js
 ******************************************************************************/
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processBottle(inputPath, outputPath, tolerance = 35) {
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const { width, height } = metadata;

  // Ensure 4 channels (RGBA)
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const channels = info.channels; // 4

  // Sample corner background colors (average of 4 corners)
  const getPixel = (x, y) => {
    const idx = (y * w + x) * channels;
    return [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
  };

  const c1 = getPixel(0, 0);
  const c2 = getPixel(w - 1, 0);
  const c3 = getPixel(0, h - 1);
  const c4 = getPixel(w - 1, h - 1);

  // If already transparent in all 4 corners, no need to flood-remove
  if (c1[3] === 0 && c2[3] === 0 && c3[3] === 0 && c4[3] === 0) {
    console.log(`${path.basename(inputPath)}: Already transparent!`);
    await sharp(inputPath).png().toFile(outputPath);
    return;
  }

  const bgR = (c1[0] + c2[0] + c3[0] + c4[0]) / 4;
  const bgG = (c1[1] + c2[1] + c3[1] + c4[1]) / 4;
  const bgB = (c1[2] + c2[2] + c3[2] + c4[2]) / 4;

  // BFS Flood Fill from outer edges
  const visited = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let qStart = 0;
  let qEnd = 0;

  // Add all border pixels to queue
  for (let x = 0; x < w; x++) {
    queue[qEnd++] = x;
    queue[qEnd++] = (h - 1) * w + x;
  }
  for (let y = 0; y < h; y++) {
    queue[qEnd++] = y * w;
    queue[qEnd++] = y * w + (w - 1);
  }

  while (qStart < qEnd) {
    const idx = queue[qStart++];
    if (idx < 0 || idx >= w * h) continue;
    if (visited[idx]) continue;
    visited[idx] = 1;

    const x = idx % w;
    const y = (idx / w) | 0;
    const p = idx * channels;

    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const a = data[p + 3];

    if (a === 0) {
      if (x > 0) queue[qEnd++] = idx - 1;
      if (x < w - 1) queue[qEnd++] = idx + 1;
      if (y > 0) queue[qEnd++] = idx - w;
      if (y < h - 1) queue[qEnd++] = idx + w;
      continue;
    }

    const dist = Math.sqrt((r - bgR)**2 + (g - bgG)**2 + (b - bgB)**2);
    const isLight = (r > 220 && g > 220 && b > 220);

    if (dist <= tolerance || isLight) {
      data[p + 3] = 0; // Set transparent!
      if (x > 0) queue[qEnd++] = idx - 1;
      if (x < w - 1) queue[qEnd++] = idx + 1;
      if (y > 0) queue[qEnd++] = idx - w;
      if (y < h - 1) queue[qEnd++] = idx + w;
    }
  }

  await sharp(data, {
    raw: {
      width: w,
      height: h,
      channels: 4
    }
  })
  .png({ compressionLevel: 9 })
  .toFile(outputPath);

  console.log(`Processed & saved transparent PNG: ${outputPath}`);
}

async function run() {
  const input = path.join(__dirname, 'raw_bottles', 'AMRUT-SGL-750.jpg');
  const output = path.join('C:', 'Users', 'Kasthuri', 'OneDrive', 'Desktop', 'Tasmac e commerce', 'images', 'AMRUT-SGL-750.png');
  await processBottle(input, output);
}

run().catch(console.error);



/******************************************************************************
 * SCRIPT: test_urls_v3.js
 ******************************************************************************/
async function test() {
  const urls = [
    { name: 'teachers', url: 'https://www.nicepng.com/png/full/310-3106305_teachers-highland-cream-whisky-teachers-highland-cream-whisky.png' },
    { name: 'signature', url: 'https://images.ctfassets.net/vvbow7h7clgh/3jiYUX5tKYUPuEg01o9tvQ/c059583a6a21fe1400b758c58d2a0f2e/SIGNATURE_edit_OTT_Cut__fallback_image.png' },
    { name: 'blenders', url: 'https://icon2.cleanpng.com/20180609/cpg/aa8cxspaw.webp' }
  ];

  for (const item of urls) {
    try {
      const res = await fetch(item.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      console.log(`${item.name}: status ${res.status}, size ${res.headers.get('content-length')}`);
    } catch (e) {
      console.error(item.name, e.message);
    }
  }
}

test();



/******************************************************************************
 * SCRIPT: trace_disc.js
 ******************************************************************************/
const sharp = require('sharp');
const fs = require('fs');

async function traceDisc() {
  const { data, info } = await sharp('crop_neck_top.png').raw().toBuffer({ resolveWithObject: true });
  const w = info.width; // 250
  const h = info.height; // 150
  // In crop_neck_top, original x = x_crop + 250, original y = y_crop + 300
  console.log('--- Tracing disc in crop ---');
  for (let yc = 15; yc <= 40; yc += 2) {
    let minXc = 999, maxXc = -1;
    for (let xc = 0; xc < w; xc++) {
      const idx = (yc * w + xc) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      // The blue disc has blue channel higher than red channel
      if (b > r + 8 && b > 40) {
        if (xc < minXc) minXc = xc;
        if (xc > maxXc) maxXc = xc;
      }
    }
    const origY = yc + 300;
    const origMinX = minXc + 250;
    const origMaxX = maxXc + 250;
    console.log(`origY=${origY}: x from ${origMinX} to ${origMaxX} (w=${origMaxX - origMinX + 1})`);
  }
}

traceDisc();



/******************************************************************************
 * SCRIPT: trace_edge.js
 ******************************************************************************/
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



/******************************************************************************
 * SCRIPT: verify_all_bottles.js
 ******************************************************************************/
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



