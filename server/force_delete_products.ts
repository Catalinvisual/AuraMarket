
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
  console.log('Deleting broken products...');

  const productsToDelete = [
    'Spinning Top',
    'Throw Blanket',
    'Lipstick Set',
    'Tire Inflator'
  ];

  for (const name of productsToDelete) {
    const result = await prisma.product.deleteMany({
      where: { name: name }
    });
    console.log(`Deleted ${result.count} instances of ${name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
