
const urls = [
  'https://images.unsplash.com/photo-1592155931584-901ac15763e3?auto=format&fit=crop&w=800&q=80', // Pruning Shears
  'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80', // Rubber Duck
  'https://images.unsplash.com/photo-1516233758813-a38d024919c5?auto=format&fit=crop&w=800&q=80', // Kite
  'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80', // Car Air Freshener
  'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80', // Makeup Brushes
  'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80', // Perfume Bottle
  'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=80', // Microfiber Cloths
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
