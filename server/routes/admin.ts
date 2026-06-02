import { Router } from 'express';
import { prisma, formatProduct } from '../lib/prisma.js';
import { authMiddleware } from '../lib/auth.js';

const router = Router();
router.use(authMiddleware);

// Dashboard stats
router.get('/stats', async (_req, res) => {
  const [productCount, orderCount, pendingOrders, revenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: 'CANCELLED' } } }),
  ]);
  res.json({
    productCount,
    orderCount,
    pendingOrders,
    revenue: revenue._sum.total ?? 0,
  });
});

// Products CRUD
router.get('/products', async (req, res) => {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { updatedAt: 'desc' },
  });
  res.json(products.map(p => ({ ...formatProduct(p), published: p.published })));
});

router.post('/products', async (req, res) => {
  const { categorySlug, images, specs, ...data } = req.body;
  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) return res.status(400).json({ error: 'Danh mục không tồn tại' });

  const product = await prisma.product.create({
    data: {
      ...data,
      images: images ?? [data.image],
      specs: specs ?? undefined,
      categoryId: category.id,
    },
    include: { category: true },
  });
  res.status(201).json(formatProduct(product));
});

router.put('/products/:id', async (req, res) => {
  const { categorySlug, images, specs, ...data } = req.body;
  const existing = await prisma.product.findFirst({
    where: { OR: [{ id: req.params.id }, { slug: req.params.id }] },
  });
  if (!existing) return res.status(404).json({ error: 'Không tìm thấy' });

  let categoryId = existing.categoryId;
  if (categorySlug) {
    const cat = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (cat) categoryId = cat.id;
  }

  const product = await prisma.product.update({
    where: { id: existing.id },
    data: { ...data, images, specs, categoryId },
    include: { category: true },
  });
  res.json(formatProduct(product));
});

router.delete('/products/:id', async (req, res) => {
  const existing = await prisma.product.findFirst({
    where: { OR: [{ id: req.params.id }, { slug: req.params.id }] },
  });
  if (!existing) return res.status(404).json({ error: 'Không tìm thấy' });
  await prisma.product.delete({ where: { id: existing.id } });
  res.json({ ok: true });
});

// Categories
router.get('/categories', async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: true } } },
  });
  res.json(categories);
});

router.post('/categories', async (req, res) => {
  const cat = await prisma.category.create({ data: req.body });
  res.status(201).json(cat);
});

router.put('/categories/:id', async (req, res) => {
  const cat = await prisma.category.update({ where: { id: req.params.id }, data: req.body });
  res.json(cat);
});

router.delete('/categories/:id', async (req, res) => {
  await prisma.category.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

// Orders
router.get('/orders', async (req, res) => {
  const { status } = req.query;
  const orders = await prisma.order.findMany({
    where: status ? { status: status as never } : undefined,
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(orders);
});

router.patch('/orders/:id/status', async (req, res) => {
  const { status } = req.body;
  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status },
    include: { items: true },
  });
  res.json(order);
});

// Coupons
router.get('/coupons', async (_req, res) => {
  res.json(await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } }));
});

router.post('/coupons', async (req, res) => {
  const coupon = await prisma.coupon.create({
    data: { ...req.body, code: req.body.code.toUpperCase() },
  });
  res.status(201).json(coupon);
});

router.put('/coupons/:id', async (req, res) => {
  const coupon = await prisma.coupon.update({ where: { id: req.params.id }, data: req.body });
  res.json(coupon);
});

router.delete('/coupons/:id', async (req, res) => {
  await prisma.coupon.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

// Blogs
router.get('/blogs', async (_req, res) => {
  res.json(await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } }));
});

router.post('/blogs', async (req, res) => {
  const blog = await prisma.blogPost.create({ data: req.body });
  res.status(201).json(blog);
});

router.put('/blogs/:id', async (req, res) => {
  const blog = await prisma.blogPost.update({ where: { id: req.params.id }, data: req.body });
  res.json(blog);
});

router.delete('/blogs/:id', async (req, res) => {
  await prisma.blogPost.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

export default router;
