import { Request, Response } from 'express';
import { PrismaClient, OrderStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [totalOrders, totalUsers, totalProducts] = await Promise.all([
      prisma.order.count(),
      prisma.user.count(),
      prisma.product.count(),
    ]);

    // Calculate total revenue (sum of total from DELIVERED orders)
    const revenueResult = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: OrderStatus.DELIVERED,
      },
    });
    const totalRevenue = revenueResult._sum?.total || 0;

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
              }
            }
          }
        }
      },
    });

    // Mock chart data for now (fetching real monthly data is complex in one query)
    // We'll just return static chart data or simple aggregation if needed.
    // For now, let's keep the chart data static on frontend or mock it here.
    const chartData = [
      { name: 'Jan', sales: 4000, visitors: 2400 },
      { name: 'Feb', sales: 3000, visitors: 1398 },
      { name: 'Mar', sales: 2000, visitors: 9800 },
      { name: 'Apr', sales: 2780, visitors: 3908 },
      { name: 'May', sales: 1890, visitors: 4800 },
      { name: 'Jun', sales: 2390, visitors: 3800 },
      { name: 'Jul', sales: 3490, visitors: 4300 },
    ];

    res.json({
      stats: {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
      },
      recentOrders,
      chartData,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};
