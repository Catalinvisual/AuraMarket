
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Fetch some of the new products I added
  const newProducts = [
    'Tablet Pro 11"',
    'Action Camera 4K',
    'Leather Belt',
    'Wool Fedora Hat',
    'Modern Sofa',
    'Perfume Bottle',
    'Makeup Brushes'
  ];

  const products = await prisma.product.findMany({
    where: {
      name: {
        in: newProducts
      }
    },
    select: {
      name: true,
      images: true,
      category: {
        select: {
          name: true
        }
      }
    }
  });

  console.log('Verifying products in DB:');
  products.forEach(p => {
    console.log(`Product: ${p.name}`);
    console.log(`Category: ${p.category.name}`);
    console.log(`Images: ${JSON.stringify(p.images)}`);
    console.log('---');
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
