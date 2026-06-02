import { Router } from 'express';
import { prisma, formatProduct } from '../lib/prisma.js';

const router = Router();

router.get('/', async (req, res) => {
  const { category, menh, search, sort, page = '1', limit = '20' } = req.query;
  const pageNum = Math.max(1, parseInt(page as string) || 1);
  const limitNum = Math.min(50, parseInt(limit as string) || 20);

  const where: Record<string, unknown> = { published: true };

  if (category) {
    where.category = { slug: category as string };
  }
  if (menh) {
    where.menh = { has: menh as string };
  }
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { spec: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  let orderBy: Record<string, string> = { createdAt: 'desc' };
  if (sort === 'price-asc') orderBy = { price: 'asc' };
  if (sort === 'price-desc') orderBy = { price: 'desc' };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    }),
    prisma.product.count({ where }),
  ]);

  res.json({
    products: items.map(formatProduct),
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
  });
});

router.get('/:slug', async (req, res) => {
  const product = await prisma.product.findFirst({
    where: { slug: req.params.slug, published: true },
    include: { category: true },
  });
  if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
  res.json(formatProduct(product));
});

export default router;
