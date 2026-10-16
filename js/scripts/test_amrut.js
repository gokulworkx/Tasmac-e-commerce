const sharp = require('sharp');

async function testAmrut() {
  const m = await sharp('raw_bottles/AMRUT-SGL-750.jpg').metadata();
  console.log('Amrut raw:', m.width, 'x', m.height);
}

testAmrut();

