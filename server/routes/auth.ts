import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { signToken } from '../lib/auth.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email và mật khẩu bắt buộc' });

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
  }

  const token = signToken({ id: admin.id, email: admin.email });
  res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
});

export default router;
