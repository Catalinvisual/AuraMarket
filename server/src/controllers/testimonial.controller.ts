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

const DEFAULT_TESTIMONIALS = [
  {
    name: "Sarah Johnson",
    role: "Verified Buyer",
    content: "Absolutely love the quality of the products! The delivery was super fast and the packaging was eco-friendly. Will definitely order again.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
    isActive: true
  },
  {
    name: "Michael Chen",
    role: "Tech Enthusiast",
    content: "The gadgets here are top-notch. I bought the new smartwatch and it exceeded my expectations. Great customer support too!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
    isActive: true
  },
  {
    name: "Emma Davis",
    role: "Designer",
    content: "Beautiful aesthetics and functional design. This store curates the best items. Highly recommended for anyone looking for style and substance.",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
    isActive: true
  }
];

export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const count = await prisma.testimonial.count();
    
    if (count === 0) {
      await prisma.testimonial.createMany({
        data: DEFAULT_TESTIMONIALS
      });
    }

    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ message: "Error fetching testimonials" });
  }
};

export const getAllTestimonials = async (req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(testimonials);
  } catch (error) {
    console.error("Error fetching all testimonials:", error);
    res.status(500).json({ message: "Error fetching all testimonials" });
  }
};

export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const { name, role, content, rating, avatar, videoUrl, isActive } = req.body;
    
    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role,
        content,
        rating: Number(rating) || 5,
        avatar,
        videoUrl,
        isActive: isActive !== undefined ? isActive : true,
      },
    });
    
    res.status(201).json(testimonial);
  } catch (error) {
    console.error("Error creating testimonial:", error);
    res.status(500).json({ message: "Error creating testimonial" });
  }
};

export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, role, content, rating, avatar, videoUrl, isActive } = req.body;
    
    const testimonial = await prisma.testimonial.update({
      where: { id: id as string },
      data: {
        name,
        role,
        content,
        rating: Number(rating) || 5,
        avatar,
        videoUrl,
        isActive,
      },
    });
    
    res.json(testimonial);
  } catch (error) {
    console.error("Error updating testimonial:", error);
    res.status(500).json({ message: "Error updating testimonial" });
  }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.testimonial.delete({
      where: { id: id as string },
    });
    res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    res.status(500).json({ message: "Error deleting testimonial" });
  }
};
