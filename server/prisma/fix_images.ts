
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
  console.log('Starting explicit image update...');

  const updates = [
    {
      name: 'Puzzle 1000 Pieces',
      image: 'https://images.unsplash.com/photo-1587654780291-39c940483713?auto=format&fit=crop&w=800&q=80' 
    },
    {
      name: 'Plush Bear',
      image: 'https://images.unsplash.com/photo-1556012018-50c5c0da73bf?auto=format&fit=crop&w=800&q=80' // Actual Teddy Bear
    },
    {
      name: 'Kitchen Knife Set',
      image: 'https://images.unsplash.com/photo-1593618998160-e34015e67543?auto=format&fit=crop&w=800&q=80' // Chef Knife
    },
    {
      name: 'Leather Wallet',
      image: 'https://images.unsplash.com/photo-1556637640-2c80d3201be8?auto=format&fit=crop&w=800&q=80' // Men's Wallet
    }
  ];

  for (const update of updates) {
    try {
      const product = await prisma.product.findFirst({
        where: { name: update.name }
      });

      if (product) {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            images: [update.image]
          }
        });
        console.log(`Updated ${update.name} with image ${update.image}`);
      } else {
        console.log(`Product ${update.name} not found!`);
      }
    } catch (error) {
      console.error(`Failed to update ${update.name}:`, error);
    }
  }

  console.log('Explicit image update finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
