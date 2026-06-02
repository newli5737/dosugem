import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

const SECRET = process.env.JWT_SECRET || 'dosugem-secret';

export function signToken(payload: { id: string; email: string }) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const token = header.slice(7);
    const decoded = jwt.verify(token, SECRET) as { id: string; email: string };
    (req as Request & { admin: typeof decoded }).admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function generateOrderNumber() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `DG${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${rand}`;
}
