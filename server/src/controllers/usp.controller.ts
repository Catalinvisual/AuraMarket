import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DEFAULT_USPS = [
  {
    icon: 'Truck',
    title: 'Fast Delivery',
    subtitle: '24-48h',
    displayOrder: 1,
  },
  {
    icon: 'RotateCcw',
    title: 'Free Returns',
    subtitle: '30 days',
    displayOrder: 2,
  },
  {
    icon: 'ShieldCheck',
    title: 'Secure Payments',
    subtitle: '100% Protected',
    displayOrder: 3,
  },
  {
    icon: 'Headphones',
    title: 'Customer Support',
    subtitle: '24/7',
    displayOrder: 4,
  },
];

export const getUSPs = async (req: Request, res: Response) => {
  try {
    let usps = await prisma.uspItem.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    if (usps.length === 0) {
      // Seed defaults if empty
      await prisma.uspItem.createMany({
        data: DEFAULT_USPS,
      });
      usps = await prisma.uspItem.findMany({
        orderBy: { displayOrder: 'asc' },
      });
    }

    res.json(usps);
  } catch (error) {
    console.error('Error fetching USPs:', error);
    res.status(500).json({ message: 'Error fetching USPs' });
  }
};

export const updateUSP = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { icon, title, subtitle, displayOrder } = req.body;

    const usp = await prisma.uspItem.update({
      where: { id: id as string },
      data: {
        icon,
        title,
        subtitle,
        displayOrder,
      },
    });

    res.json(usp);
  } catch (error) {
    console.error('Error updating USP:', error);
    res.status(500).json({ message: 'Error updating USP' });
  }
};

export const createUSP = async (req: Request, res: Response) => {
  try {
    const { icon, title, subtitle, displayOrder } = req.body;
    const usp = await prisma.uspItem.create({
      data: {
        icon,
        title,
        subtitle,
        displayOrder: displayOrder || 0,
      },
    });
    res.status(201).json(usp);
  } catch (error) {
    console.error('Error creating USP:', error);
    res.status(500).json({ message: 'Error creating USP' });
  }
};

export const deleteUSP = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.uspItem.delete({
      where: { id: id as string },
    });
    res.json({ message: 'USP deleted successfully' });
  } catch (error) {
    console.error('Error deleting USP:', error);
    res.status(500).json({ message: 'Error deleting USP' });
  }
};
