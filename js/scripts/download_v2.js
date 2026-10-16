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

