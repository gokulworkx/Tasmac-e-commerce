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

