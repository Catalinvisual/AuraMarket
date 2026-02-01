
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'admin@example.com';
  const password = '123456';

  console.log(`Checking user: ${email}`);
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.log('User NOT found in database.');
    return;
  }

  console.log('User found:', user.email);
  console.log('Stored hash:', user.password);

  const isMatch = await bcrypt.compare(password, user.password);
  console.log(`Password match for '${password}': ${isMatch}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
