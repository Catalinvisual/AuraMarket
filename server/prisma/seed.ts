import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categories = [
  {
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80',
    products: [
      {
        name: 'Smartphone X Pro',
        description: 'The latest smartphone with an advanced camera system, all-day battery life, and the fastest chip ever in a smartphone.',
        price: 999.99,
        stock: 50,
        images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'],
        isFeatured: true,
        features: ['5G Capable', 'OLED Display', 'Face ID'],
      },
      {
        name: 'Wireless Noise Cancelling Headphones',
        description: 'Immerse yourself in music with industry-leading noise cancellation and premium sound quality.',
        price: 299.99,
        stock: 100,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Active Noise Cancellation', '30-hour Battery', 'Touch Controls'],
      },
      {
        name: '4K Smart TV 55"',
        description: 'Experience crystal clear picture quality with this 55-inch 4K UHD Smart TV.',
        price: 699.99,
        stock: 30,
        images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['4K UHD', 'HDR10+', 'Voice Remote'],
      },
      {
        name: 'Smart Watch Series 5',
        description: 'Track your fitness, heart rate, and notifications on your wrist with this stylish smart watch.',
        price: 399.99,
        stock: 75,
        images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Heart Rate Monitor', 'GPS', 'Water Resistant'],
      },
      {
        name: 'Bluetooth Speaker',
        description: 'Portable bluetooth speaker with powerful bass and 24 hours of playtime.',
        price: 129.99,
        stock: 150,
        images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80'],
        isFeatured: true,
        features: ['Waterproof', 'Stereo Pairing', 'Built-in Mic'],
      },
      {
        name: 'Laptop UltraSlim',
        description: 'Powerful performance in an ultra-slim design, perfect for professionals on the go.',
        price: 1299.99,
        stock: 25,
        images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['i7 Processor', '16GB RAM', '512GB SSD'],
      },
      {
        name: 'Wireless Gaming Mouse',
        description: 'High-precision wireless gaming mouse with RGB lighting.',
        price: 49.99,
        stock: 80,
        images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['16000 DPI', 'RGB Lighting', 'Programmable Buttons'],
      },
      {
        name: 'Professional Camera Lens',
        description: 'Versatile zoom lens for professional photography.',
        price: 599.99,
        stock: 15,
        images: ['https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=800&q=80'],
        isFeatured: true,
        features: ['f/2.8 Aperture', 'Image Stabilization', 'Weather Sealed'],
      },
      {
        name: 'Tablet Pro 11"',
        description: 'Powerful tablet for work and play.',
        price: 799.99,
        stock: 45,
        images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Retina Display', 'M1 Chip', 'All-day Battery'],
      },
      {
        name: 'Action Camera 4K',
        description: 'Capture your adventures in stunning 4K detail.',
        price: 249.99,
        stock: 60,
        images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Waterproof', 'Image Stabilization', 'Voice Control'],
      },
      {
        name: 'Mechanical Keychron Keyboard',
        description: 'Tactile feedback meets wireless freedom. The ultimate typing experience for developers and creators.',
        price: 110.00,
        stock: 50,
        images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80'],
        isFeatured: true,
        features: ['Tactile Feedback', 'Wireless', 'Backlit RGB'],
      },
    ],
  },
  {
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80',
    products: [
      {
        name: 'Classic Denim Jacket',
        description: 'A timeless classic, this denim jacket adds a cool edge to any outfit.',
        price: 89.99,
        stock: 60,
        images: ['https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['100% Cotton', 'Vintage Wash', 'Button Closure'],
      },
      {
        name: 'Summer Floral Dress',
        description: 'Light and airy floral dress, perfect for summer days and garden parties.',
        price: 59.99,
        stock: 80,
        images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80'],
        isFeatured: true,
        features: ['Floral Print', 'Midi Length', 'Breathable Fabric'],
      },
      {
        name: 'Men\'s Casual T-Shirt',
        description: 'Essential cotton t-shirt for everyday comfort and style.',
        price: 24.99,
        stock: 200,
        images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Organic Cotton', 'Regular Fit', 'Crew Neck'],
      },
      {
        name: 'Running Sneakers',
        description: 'High-performance running shoes designed for comfort and speed.',
        price: 119.99,
        stock: 45,
        images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Breathable Mesh', 'Cushioned Sole', 'Lightweight'],
      },
      {
        name: 'Leather Wallet',
        description: 'Genuine leather wallet with multiple card slots and a sleek design.',
        price: 49.99,
        stock: 120,
        images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Genuine Leather', 'RFID Protection', 'Slim Profile'],
      },
      {
        name: 'Sunglasses Aviator',
        description: 'Classic aviator sunglasses with UV protection and a metal frame.',
        price: 79.99,
        stock: 90,
        images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['UV400 Protection', 'Polarized Lenses', 'Metal Frame'],
      },
      {
        name: 'Elegant Wristwatch',
        description: 'Minimalist wristwatch with a leather strap.',
        price: 129.99,
        stock: 45,
        images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Quartz Movement', 'Water Resistant', 'Sapphire Glass'],
      },
      {
        name: 'Silk Scarf',
        description: 'Luxurious silk scarf with a vibrant pattern.',
        price: 39.99,
        stock: 100,
        images: ['https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&w=800&q=80'],
        isFeatured: true,
        features: ['100% Silk', 'Hand Rolled Edges', 'Designer Print'],
      },
      {
        name: 'Leather Belt',
        description: 'Classic leather belt with a sturdy buckle.',
        price: 29.99,
        stock: 100,
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Genuine Leather', 'Durable Buckle', 'Adjustable Size'],
      },
      {
        name: 'Wool Fedora Hat',
        description: 'Stylish wool fedora hat for a sophisticated look.',
        price: 49.99,
        stock: 30,
        images: ['https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['100% Wool', 'Wide Brim', 'Unisex Design'],
      },
    ],
  },
  {
    name: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800&q=80',
    products: [
      {
        name: 'Modern Sofa',
        description: 'A stylish and comfortable sofa that fits perfectly in any modern living room.',
        price: 899.99,
        stock: 10,
        images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'],
        isFeatured: true,
        features: ['Velvet Fabric', 'Solid Wood Legs', '3-Seater'],
      },
      {
        name: 'Ceramic Vase Set',
        description: 'Set of 3 minimalist ceramic vases to elevate your home decor.',
        price: 45.99,
        stock: 65,
        images: ['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Handmade', 'Matte Finish', 'Various Sizes'],
      },
      {
        name: 'Bamboo Bed Sheets',
        description: 'Luxuriously soft and sustainable bamboo bed sheets for a perfect night\'s sleep.',
        price: 109.99,
        stock: 40,
        images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['100% Bamboo', 'Hypoallergenic', 'Cooling Effect'],
      },
      {
        name: 'LED Desk Lamp',
        description: 'Adjustable LED desk lamp with multiple brightness levels and color temperatures.',
        price: 39.99,
        stock: 85,
        images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Touch Control', 'USB Charging Port', 'Eye Care Technology'],
      },
      {
        name: 'Kitchen Knife Set',
        description: 'Professional-grade kitchen knife set with a wooden block.',
        price: 149.99,
        stock: 20,
        images: ['https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['High Carbon Steel', 'Ergonomic Handles', 'Sharp Edge'],
      },
      {
        name: 'Coffee Maker',
        description: 'Programmable coffee maker for brewing the perfect cup every morning.',
        price: 79.99,
        stock: 50,
        images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Programmable Timer', 'Keep Warm Function', 'Reusable Filter'],
      },
      {
        name: 'Succulent Plant Pot',
        description: 'Ceramic pot with a beautiful succulent plant.',
        price: 14.99,
        stock: 150,
        images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Live Plant', 'Ceramic Pot', 'Low Maintenance'],
      },
      {
        name: 'Aromatic Candle',
        description: 'Scented candle to create a relaxing atmosphere.',
        price: 19.99,
        stock: 200,
        images: ['https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80'],
        isFeatured: true,
        features: ['Soy Wax', 'Lavender Scent', '40h Burn Time'],
      },
      {
        name: 'Wall Clock',
        description: 'Modern wall clock with silent movement.',
        price: 34.99,
        stock: 50,
        images: ['https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Silent Movement', 'Large Numbers', 'Battery Operated'],
      },
      {
        name: 'Throw Blanket',
        description: 'Cozy throw blanket for chilly evenings.',
        price: 24.99,
        stock: 80,
        images: ['https://images.unsplash.com/photo-1580301762395-9c64231844b5?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Soft Fleece', 'Machine Washable', 'Various Colors'],
      },
    ],
  },
  {
    name: 'Sports',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80',
    products: [
      {
        name: 'Yoga Mat',
        description: 'Non-slip yoga mat with alignment lines for optimal practice.',
        price: 29.99,
        stock: 100,
        images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Non-slip Surface', 'Eco-friendly Material', 'Carrying Strap'],
      },
      {
        name: 'Dumbbell Set',
        description: 'Adjustable dumbbell set for a complete home workout.',
        price: 199.99,
        stock: 15,
        images: ['https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&w=800&q=80'],
        isFeatured: true,
        features: ['Adjustable Weight', 'Compact Design', 'Durable Cast Iron'],
      },
      {
        name: 'Running Shoes',
        description: 'Lightweight running shoes for daily training and marathons.',
        price: 129.99,
        stock: 40,
        images: ['https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Responsive Cushioning', 'Breathable Upper', 'Durable Outsole'],
      },
      {
        name: 'Tennis Racket',
        description: 'Professional tennis racket for power and control.',
        price: 159.99,
        stock: 25,
        images: ['https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Graphite Composition', 'Large Sweet Spot', 'Pre-strung'],
      },
      {
        name: 'Water Bottle',
        description: 'Insulated stainless steel water bottle to keep your drinks cold or hot.',
        price: 19.99,
        stock: 200,
        images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Vacuum Insulation', 'Leak-proof Lid', 'BPA Free'],
      },
      {
        name: 'Jump Rope',
        description: 'Speed jump rope for cardio and endurance training.',
        price: 14.99,
        stock: 150,
        images: ['https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Adjustable Length', 'Ball Bearing System', 'Lightweight Handles'],
      },
      {
        name: 'Foam Roller',
        description: 'High-density foam roller for muscle recovery.',
        price: 24.99,
        stock: 80,
        images: ['https://images.unsplash.com/photo-1600881333168-2ef49b341f30?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Deep Tissue Massage', 'Durable Foam', 'Textured Surface'],
      },
    ],
  },
  {
    name: 'Toys & Hobbies',
    image: 'https://images.unsplash.com/photo-1566576912902-1d6db6e8d35a?auto=format&fit=crop&w=800&q=80',
    products: [
      {
        name: 'RC Car',
        description: 'High-speed remote control car for off-road racing.',
        price: 69.99,
        stock: 40,
        images: ['https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['4WD', 'High Speed', 'Rechargeable Battery'],
      },
      {
        name: 'Building Blocks Set',
        description: 'Creative building blocks set for endless construction possibilities.',
        price: 49.99,
        stock: 80,
        images: ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['1000+ Pieces', 'Compatible with Major Brands', 'Educational'],
      },
      {
        name: 'Plush Bear',
        description: 'Soft and cuddly plush bear, the perfect gift for kids.',
        price: 24.99,
        stock: 100,
        images: ['https://images.unsplash.com/photo-1556012018-50c5c0da73bf?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Ultra Soft', 'Hypoallergenic Stuffing', 'Washable'],
      },
      {
        name: 'Drone with Camera',
        description: 'Foldable drone with 4K camera for stunning aerial photography.',
        price: 249.99,
        stock: 20,
        images: ['https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80'],
        isFeatured: true,
        features: ['4K Camera', 'GPS Return', '20 min Flight Time'],
      },
      {
        name: 'Puzzle 1000 Pieces',
        description: 'Challenging 1000 piece puzzle with a beautiful landscape image.',
        price: 19.99,
        stock: 60,
        images: ['https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['High Quality Cardboard', 'Precision Fit', 'Anti-Glare Finish'],
      },
      {
        name: 'Watercolor Paint Set',
        description: 'Professional watercolor paint set with 24 colors.',
        price: 34.99,
        stock: 70,
        images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['24 Colors', 'High Pigment', 'Portable Case'],
      },
      {
        name: 'Action Figure',
        description: 'Collectible action figure with articulated joints.',
        price: 29.99,
        stock: 40,
        images: ['https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&w=800&q=80'],
        isFeatured: true,
        features: ['Articulated', 'Detailed Sculpt', 'Accessories Included'],
      },
      {
        name: 'Chess Set',
        description: 'Classic wooden chess set for strategy games.',
        price: 39.99,
        stock: 50,
        images: ['https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Wooden Board', 'Hand Carved Pieces', 'Folding Design'],
      },
      {
        name: 'Model Airplane',
        description: 'Detailed scale model airplane kit.',
        price: 29.99,
        stock: 60,
        images: ['https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Scale 1:72', 'Decals Included', 'Detailed Parts'],
      },
    ],
  },
  // Add categories that might have been created by default controller logic to ensure they have images
  {
    name: 'Clothing',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80',
    products: [
      {
        name: 'Cotton Hoodie',
        description: 'Soft and comfortable cotton hoodie for casual wear.',
        price: 39.99,
        stock: 100,
        images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['100% Cotton', 'Kangaroo Pocket', 'Drawstring Hood'],
      },
      {
        name: 'Striped Socks',
        description: 'Colorful striped socks to brighten your day.',
        price: 9.99,
        stock: 200,
        images: ['https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Combed Cotton', 'Reinforced Heel', 'Seamless Toe'],
      },
      {
        name: 'Denim Jeans',
        description: 'Classic fit denim jeans for everyday wear.',
        price: 49.99,
        stock: 120,
        images: ['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['100% Cotton', 'Straight Leg', '5 Pockets'],
      },
      {
        name: 'Polo Shirt',
        description: 'Comfortable polo shirt available in various colors.',
        price: 29.99,
        stock: 150,
        images: ['https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Breathable Fabric', 'Ribbed Collar', 'Classic Fit'],
      },
    ],
  },
  {
    name: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&w=800&q=80',
    products: [
      {
        name: 'Garden Shovel',
        description: 'Durable garden shovel for all your planting needs.',
        price: 19.99,
        stock: 50,
        images: ['https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Stainless Steel', 'Ergonomic Handle', 'Rust Resistant'],
      },
      {
        name: 'Watering Can',
        description: 'Classic metal watering can with a removable rose.',
        price: 24.99,
        stock: 40,
        images: ['https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Galvanized Steel', '2 Gallon Capacity', 'Balanced Design'],
      },
      {
        name: 'Garden Trowel',
        description: 'Stainless steel garden trowel with ergonomic handle.',
        price: 12.99,
        stock: 75,
        images: ['https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Stainless Steel', 'Soft Grip', 'Measurement Marks'],
      },
      {
        name: 'Pruning Shears',
        description: 'Sharp pruning shears for trimming plants and bushes.',
        price: 18.99,
        stock: 60,
        images: ['https://images.unsplash.com/photo-1592155931584-901ac15763e3?auto=format&fit=crop&w=800&q=80&v=2'],
        isFeatured: false,
        features: ['High Carbon Steel', 'Safety Lock', 'Spring Action'],
      },
    ],
  },
  {
    name: 'Books',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80',
    products: [
      {
        name: 'Sci-Fi Novel',
        description: 'A gripping science fiction novel about space exploration.',
        price: 14.99,
        stock: 100,
        images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80'],
        isFeatured: true,
        features: ['Hardcover', 'Best Seller', 'Award Winning'],
      },
      {
        name: 'Cookbook',
        description: 'Collection of delicious recipes from around the world.',
        price: 29.99,
        stock: 60,
        images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Full Color Photos', 'Easy Instructions', 'Vegetarian Options'],
      },
      {
        name: 'History Book',
        description: 'A comprehensive history of ancient civilizations.',
        price: 24.99,
        stock: 80,
        images: ['https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Hardcover', 'Illustrated', 'Maps Included'],
      },
      {
        name: 'Biography',
        description: 'Inspiring biography of a famous historical figure.',
        price: 19.99,
        stock: 90,
        images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Paperback', 'Bestseller', 'Exclusive Photos'],
      },
    ],
  },
  {
    name: 'Toys',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80',
    products: [
      {
        name: 'Wooden Train',
        description: 'Classic wooden train set for toddlers.',
        price: 24.99,
        stock: 80,
        images: ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Solid Wood', 'Non-toxic Paint', 'Compatible Tracks'],
      },
      {
        name: 'Rubber Duck',
        description: 'Classic yellow rubber duck for bath time fun.',
        price: 5.99,
        stock: 200,
        images: ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80&v=2'],
        isFeatured: false,
        features: ['Floating', 'Squeaky', 'Non-toxic'],
      },
      {
        name: 'Kite',
        description: 'Colorful kite for outdoor fun on windy days.',
        price: 14.99,
        stock: 100,
        images: ['https://images.unsplash.com/photo-1516233758813-a38d024919c5?auto=format&fit=crop&w=800&q=80&v=2'],
        isFeatured: false,
        features: ['Easy to Fly', 'Durable Fabric', 'String Included'],
      },
    ],
  },
  {
    name: 'Beauty',
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80',
    products: [
      {
        name: 'Lipstick Set',
        description: 'Set of 3 long-lasting matte lipsticks.',
        price: 29.99,
        stock: 100,
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062dc?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Matte Finish', 'Long Lasting', 'Hydrating'],
      },
      {
        name: 'Face Cream',
        description: 'Hydrating face cream for all skin types.',
        price: 34.99,
        stock: 80,
        images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=800&q=80'],
        isFeatured: true,
        features: ['Anti-aging', 'Vitamin E', 'Night & Day'],
      },
      {
        name: 'Perfume Bottle',
        description: 'Elegant perfume bottle with a floral scent.',
        price: 59.99,
        stock: 40,
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Eau de Parfum', 'Floral Notes', 'Gift Box'],
      },
      {
        name: 'Makeup Brushes',
        description: 'Set of professional makeup brushes.',
        price: 24.99,
        stock: 100,
        images: ['https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80&v=2'],
        isFeatured: false,
        features: ['Synthetic Bristles', 'Cruelty Free', 'Travel Case'],
      },
    ],
  },
  {
    name: 'Automotive',
    image: 'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&w=800&q=80',
    products: [
      {
        name: 'Car Wax',
        description: 'Premium car wax for a showroom shine.',
        price: 19.99,
        stock: 60,
        images: ['https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Carnauba Wax', 'Easy Application', 'Long Lasting Protection'],
      },
      {
        name: 'Car Air Freshener',
        description: 'Long-lasting car air freshener with a pleasant scent.',
        price: 4.99,
        stock: 200,
        images: ['https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80&v=2'],
        isFeatured: false,
        features: ['Clip-on', 'Odor Eliminating', 'Adjustable Scent'],
      },
      {
        name: 'Microfiber Cloths',
        description: 'Pack of 3 microfiber cloths for cleaning your car.',
        price: 9.99,
        stock: 150,
        images: ['https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=80'],
        isFeatured: false,
        features: ['Lint Free', 'Scratch Free', 'Machine Washable'],
      },
    ],
  },
];

async function main() {
  const password = await bcrypt.hash('123456', 10);

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password,
      role: Role.ADMIN,
    },
  });

  // Create Customer User
  const customer = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      name: 'Client User',
      password,
      role: Role.CUSTOMER,
    },
  });

  console.log('Users created:', { admin, customer });

  // Create Categories and Products
  for (const catData of categories) {
    const { products, ...categoryDetails } = catData;
    
    const category = await prisma.category.upsert({
      where: { name: categoryDetails.name },
      update: { image: categoryDetails.image },
      create: {
        name: categoryDetails.name,
        image: categoryDetails.image,
      },
    });

    console.log(`Category seeded: ${category.name}`);

    for (const prodData of products) {
      // Check if product exists to avoid duplicates if running multiple times without unique constraint on name
      // We can search by name AND categoryId to be safe
      const existingProduct = await prisma.product.findFirst({
        where: {
          name: prodData.name,
          categoryId: category.id,
        },
      });

      if (!existingProduct) {
        await prisma.product.create({
          data: {
            ...prodData,
            categoryId: category.id,
          },
        });
        console.log(`  Product created: ${prodData.name}`);
      } else {
        // Update images if product exists
        await prisma.product.update({
          where: { id: existingProduct.id },
          data: { 
            images: prodData.images,
            // Also update other fields just in case we want to sync them
            description: prodData.description,
            price: prodData.price,
            stock: prodData.stock,
            isFeatured: prodData.isFeatured,
            features: prodData.features
          }
        });
        console.log(`  Product updated: ${prodData.name}`);
      }
    }
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
