
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function verify() {
  const products = await prisma.product.findMany({
    where: {
      name: {
        in: ['Leather Wallet', 'Kitchen Knife Set', 'Plush Bear', 'Puzzle 1000 Pieces']
      }
    },
    select: {
      name: true,
      images: true
    }
  });

  console.log('Verification Results:');
  products.forEach(p => {
    console.log(`${p.name}: ${p.images[0]}`);
  });
}

verify()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
