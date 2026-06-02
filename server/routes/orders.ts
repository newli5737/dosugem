import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { generateOrderNumber } from '../lib/auth.js';

const router = Router();

router.post('/', async (req, res) => {
  const { customerName, phone, email, address, city, note, payMethod, items, couponCode } = req.body;

  if (!customerName || !phone || !address || !items?.length) {
    return res.status(400).json({ error: 'Thiếu thông tin đơn hàng' });
  }

  let discount = 0;
  if (couponCode) {
    const coupon = await prisma.coupon.findFirst({
      where: { code: couponCode.toUpperCase(), active: true },
    });
    if (coupon) {
      const sub = items.reduce((s: number, i: { price: number; qty: number }) => s + i.price * i.qty, 0);
      discount = Math.round(sub * coupon.discountPercent / 100);
    }
  }

  const subtotal = items.reduce((s: number, i: { price: number; qty: number }) => s + i.price * i.qty, 0);
  const shipping = 0;
  const total = subtotal - discount + shipping;

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      customerName,
      phone,
      email: email || null,
      address,
      city: city || null,
      note: note || null,
      payMethod: payMethod === 'bank' ? 'BANK' : 'COD',
      subtotal,
      discount,
      shipping,
      total,
      couponCode: couponCode?.toUpperCase() || null,
      items: {
        create: items.map((i: { productId: string; productName: string; productImage: string; price: number; qty: number }) => ({
          productId: i.productId,
          productName: i.productName,
          productImage: i.productImage,
          price: i.price,
          qty: i.qty,
        })),
      },
    },
    include: { items: true },
  });

  res.status(201).json({ orderNumber: order.orderNumber, id: order.id, total: order.total });
});

router.post('/validate-coupon', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Thiếu mã' });

  const coupon = await prisma.coupon.findFirst({
    where: { code: code.toUpperCase(), active: true },
  });

  if (!coupon) return res.status(404).json({ error: 'Mã không hợp lệ' });
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return res.status(400).json({ error: 'Mã đã hết hạn' });
  }

  res.json({ code: coupon.code, discountPercent: coupon.discountPercent });
});

export default router;
