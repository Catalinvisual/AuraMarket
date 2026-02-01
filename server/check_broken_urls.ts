
const urls = [
  'https://images.unsplash.com/photo-1566576912902-1d6db6e8d35a?auto=format&fit=crop&w=800&q=80', // Spinning Top
  'https://images.unsplash.com/photo-1580301762395-9c64231844b5?auto=format&fit=crop&w=800&q=80', // Throw Blanket
  'https://images.unsplash.com/photo-1586495777744-4413f21062dc?auto=format&fit=crop&w=800&q=80', // Lipstick Set
  'https://images.unsplash.com/photo-1550523178-574345265675?auto=format&fit=crop&w=800&q=80', // Tire Inflator
];

async function checkUrls() {
  console.log('Checking URLs...');
  for (const url of urls) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      console.log(`URL: ${url} - Status: ${response.status}`);
    } catch (error: any) {
      console.log(`URL: ${url} - Error: ${error.message}`);
    }
  }
}

checkUrls();
