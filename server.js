const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

let PORT = parseInt(process.env.PORT, 10) || 5500;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.normalize(path.join(PUBLIC_DIR, reqPath));

  // Prevent directory traversal outside PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(`<!DOCTYPE html><html><head><title>404 Not Found</title></head><body style="font-family:sans-serif;padding:40px;text-align:center;"><h2>Page Not Found</h2><p><a href="/">Return to Storefront Home</a></p></body></html>`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    fs.createReadStream(filePath).pipe(res);
  });
});

function openBrowser(url) {
  if (process.env.NO_OPEN) return;
  try {
    if (process.platform === 'win32') {
      exec(`start "" "${url}"`);
    } else if (process.platform === 'darwin') {
      exec(`open "${url}"`);
    } else {
      exec(`xdg-open "${url}"`);
    }
  } catch (e) {
    // ignore browser open errors
  }
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`\n[TASMAC] Port ${PORT} is currently in use.`);
    // Test if existing server is already answering
    const testReq = http.get(`http://localhost:${PORT}/`, (res) => {
      console.log(`[TASMAC] Server is already active and serving at http://localhost:${PORT}/`);
      console.log(`[TASMAC] Opening browser now...\n`);
      openBrowser(`http://localhost:${PORT}/`);
      process.exit(0);
    });

    testReq.on('error', () => {
      // Port is occupied by an unresponsive process, try next port
      PORT++;
      console.log(`[TASMAC] Retrying on port ${PORT}...`);
      setTimeout(() => server.listen(PORT), 250);
    });
  } else {
    console.error('[TASMAC] Server error:', err);
  }
});

server.listen(PORT, () => {
  console.log(`\n=============================================================`);
  console.log(`  TASMAC Reserve Storefront is LIVE!`);
  console.log(`  Local URL:  http://localhost:${PORT}/`);
  console.log(`  Network:    http://127.0.0.1:${PORT}/`);
  console.log(`  Serving:    ${PUBLIC_DIR}`);
  console.log(`=============================================================\n`);
  
  openBrowser(`http://localhost:${PORT}/`);
});
