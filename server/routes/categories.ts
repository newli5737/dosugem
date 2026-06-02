import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.get('/', async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: { where: { published: true } } } } },
  });
  res.json(categories.map(c => ({
    slug: c.slug,
    name: c.name,
    image: c.image,
    count: c._count.products,
  })));
});

export default router;
