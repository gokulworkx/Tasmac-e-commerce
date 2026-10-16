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

