
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ecommerce';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function check() {
  try {
    const count = await prisma.order.count();
    console.log(`Total orders in DB: ${count}`);
    
    const users = await prisma.user.findMany({
        include: { _count: { select: { orders: true } } }
    });
    console.log('Users and order counts:');
    users.forEach(u => console.log(`${u.email}: ${u._count.orders} orders`));
    
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

check();
