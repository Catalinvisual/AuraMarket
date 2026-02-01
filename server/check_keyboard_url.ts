
const urls = [
  'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1587829741301-dc798b91add1?auto=format&fit=crop&w=800&q=80'
];

async function checkUrls() {
  console.log('Checking URLs...');
  for (const url of urls) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      console.log(`URL: ${url} - Status: ${response.status} - Content-Type: ${response.headers.get('content-type')}`);
    } catch (error: any) {
      console.log(`URL: ${url} - Error: ${error.message}`);
    }
  }
}

checkUrls();
