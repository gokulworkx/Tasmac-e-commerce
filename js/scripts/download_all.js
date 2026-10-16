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

