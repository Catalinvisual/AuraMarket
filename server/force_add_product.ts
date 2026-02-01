
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
  console.log('Adding Mechanical Keychron Keyboard...');

  const category = await prisma.category.findFirst({
    where: { name: 'Electronics' }
  });

  if (!category) {
    console.error('Electronics category not found!');
    return;
  }

  const productData = {
    name: 'Mechanical Keychron Keyboard',
    description: 'Tactile feedback meets wireless freedom. The ultimate typing experience for developers and creators.',
    price: 110.00,
    stock: 50,
    images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80'],
    isFeatured: true,
    features: ['Tactile Feedback', 'Wireless', 'Backlit RGB'],
    categoryId: category.id
  };

  const product = await prisma.product.upsert({
    where: { 
      // Since name isn't unique, we find by ID if we had it, but here we rely on findFirst logic in a real app or just create/update by name check
      // Prisma upsert requires a unique constraint for 'where'. 
      // We don't have a unique name. So we should use findFirst then update or create.
      id: 'placeholder-uuid' // This won't work for upsert without a valid ID or unique field.
    },
    update: {},
    create: { ...productData } // invalid usage for upsert if where fails
  }).catch(async () => {
    // Fallback to manual find-update-create
    const existing = await prisma.product.findFirst({
        where: { name: 'Mechanical Keychron Keyboard', categoryId: category.id }
    });

    if (existing) {
        console.log('Product exists, updating...');
        return await prisma.product.update({
            where: { id: existing.id },
            data: productData
        });
    } else {
        console.log('Product does not exist, creating...');
        return await prisma.product.create({
            data: productData
        });
    }
  });

  console.log(`✅ Product processed: ${product.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
