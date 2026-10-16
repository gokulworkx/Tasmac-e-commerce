try {
  const sharp = require('sharp');
  console.log('SHARP IS WORKING!', sharp.versions);
} catch (e) {
  console.error('Sharp error:', e.message);
}

