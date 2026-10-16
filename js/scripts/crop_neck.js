const sharp = require('sharp');

async function test() {
  await sharp('raw_bottles/MOR-XO-750.jpg')
    .extract({ left: 250, top: 380, width: 250, height: 160 })
    .png()
    .toFile('crop_neck.png');
}

test();

