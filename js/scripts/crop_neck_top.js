const sharp = require('sharp');

async function test() {
  await sharp('raw_bottles/MOR-XO-750.jpg')
    .extract({ left: 250, top: 300, width: 250, height: 150 })
    .png()
    .toFile('crop_neck_top.png');
}

test();

