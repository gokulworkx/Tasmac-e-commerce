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

