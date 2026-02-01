
async function checkServer() {
  const url = 'http://localhost:5000/api/products?limit=1';
  console.log(`Checking ${url}...`);
  try {
    const response = await fetch(url);
    console.log(`Status: ${response.status}`);
    const data = await response.json();
    console.log('Response data preview:', JSON.stringify(data).substring(0, 100));
  } catch (error: any) {
    console.error('Fetch error:', error.message);
  }
}

checkServer();
