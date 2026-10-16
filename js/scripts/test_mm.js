async function test() {
  const res = await fetch('https://icon2.cleanpng.com/20180714/lzt/d56fd47cc14e4f3ab81b4bd3e8e0d5ee.webp', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  console.log('Magic Moments status:', res.status, 'size:', res.headers.get('content-length'));
}
test();

