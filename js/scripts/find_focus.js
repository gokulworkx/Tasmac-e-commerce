const fs = require('fs');
const content = fs.readFileSync('C:/Users/Kasthuri/OneDrive/Desktop/Tasmac e commerce/index.html', 'utf8');
content.split('\n').forEach((line, i) => {
  if (line.includes('search-field') || line.includes('product-search-input') || line.includes(':focus')) {
    console.log(i + 1, line.trim());
  }
});

