
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const productsToFix = [
  { name: 'Tablet Pro 11"', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80' },
  { name: 'Action Camera 4K', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80' },
  { name: 'Leather Belt', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80' },
  { name: 'Wool Fedora Hat', image: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=800&q=80' },
  { name: 'Wall Clock', image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Throw Blanket', image: 'https://images.unsplash.com/photo-1580301762395-9c64231844b5?auto=format&fit=crop&w=800&q=80' },
  { name: 'Jump Rope', image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&w=800&q=80' },
  { name: 'Foam Roller', image: 'https://images.unsplash.com/photo-1600881333168-2ef49b341f30?auto=format&fit=crop&w=800&q=80' },
  { name: 'Action Figure', image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&w=800&q=80' },
  { name: 'Chess Set', image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80' },
  { name: 'Model Airplane', image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80' },
  { name: 'Garden Trowel', image: 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=800&q=80' },
  { name: 'Pruning Shears', image: 'https://images.unsplash.com/photo-1592155931584-901ac15763e3?auto=format&fit=crop&w=800&q=80&v=2' },
  { name: 'History Book', image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=800&q=80' },
  { name: 'Biography', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80' },
  { name: 'Rubber Duck', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80&v=2' },
  { name: 'Kite', image: 'https://images.unsplash.com/photo-1516233758813-a38d024919c5?auto=format&fit=crop&w=800&q=80&v=2' },
  { name: 'Perfume Bottle', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80' },
  { name: 'Makeup Brushes', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80&v=2' },
  { name: 'Car Air Freshener', image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80&v=2' },
  { name: 'Microfiber Cloths', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=80' }
];

async function main() {
  console.log('Starting force update of product images...');
  
  for (const item of productsToFix) {
    try {
      const product = await prisma.product.findFirst({
        where: { name: item.name }
      });

      if (product) {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            images: [item.image]
          }
        });
        console.log(`✅ Updated image for: ${item.name}`);
      } else {
        console.log(`❌ Product not found: ${item.name}`);
      }
    } catch (error: any) {
      console.error(`⚠️ Error updating ${item.name}: ${error.message}`);
    }
  }
  
  console.log('Force update completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
