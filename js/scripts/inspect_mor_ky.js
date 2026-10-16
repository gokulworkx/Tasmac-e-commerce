const sharp = require('sharp');
const fs = require('fs');

async function main() {
  const m1 = await sharp('raw_bottles/MOR-XO-750.jpg').metadata();
  console.log('MOR-XO-750 raw:', m1);

  const m2 = await sharp('raw_bottles/KY-BR-750.webp').metadata();
  console.log('KY-BR-750 raw:', m2);

  const cur1 = await sharp('C:/Users/Kasthuri/OneDrive/Desktop/Tasmac e commerce/images/MOR-XO-750.png').metadata();
  console.log('MOR-XO-750 current in images/:', cur1);

  const cur2 = await sharp('C:/Users/Kasthuri/OneDrive/Desktop/Tasmac e commerce/images/KY-BR-750.png').metadata();
  console.log('KY-BR-750 current in images/:', cur2);
}

main().catch(console.error);

