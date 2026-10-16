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

