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

