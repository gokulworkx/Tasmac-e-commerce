const sharp = require('sharp');
const p = 'C:/Users/Kasthuri/.gemini/antigravity/brain/25432ea9-c626-489f-b402-f7519e000f74/.user_uploaded/media_1791967808989_9f9bb793.png';

sharp(p).raw().toBuffer({ resolveWithObject: true }).then(({ data, info }) => {
  console.log('User image info:', info);
  console.log('Pixel at 0,0:', data[0], data[1], data[2], data[3]);
  console.log('Pixel at 16,16:', data[(16 * info.width + 16) * info.channels], data[(16 * info.width + 16) * info.channels + 1], data[(16 * info.width + 16) * info.channels + 2], data[(16 * info.width + 16) * info.channels + 3]);
});

