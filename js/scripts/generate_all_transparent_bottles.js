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

