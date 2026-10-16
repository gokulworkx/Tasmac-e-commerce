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

