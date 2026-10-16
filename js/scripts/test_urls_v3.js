async function test() {
  const urls = [
    { name: 'teachers', url: 'https://www.nicepng.com/png/full/310-3106305_teachers-highland-cream-whisky-teachers-highland-cream-whisky.png' },
    { name: 'signature', url: 'https://images.ctfassets.net/vvbow7h7clgh/3jiYUX5tKYUPuEg01o9tvQ/c059583a6a21fe1400b758c58d2a0f2e/SIGNATURE_edit_OTT_Cut__fallback_image.png' },
    { name: 'blenders', url: 'https://icon2.cleanpng.com/20180609/cpg/aa8cxspaw.webp' }
  ];

  for (const item of urls) {
    try {
      const res = await fetch(item.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      console.log(`${item.name}: status ${res.status}, size ${res.headers.get('content-length')}`);
    } catch (e) {
      console.error(item.name, e.message);
    }
  }
}

test();

