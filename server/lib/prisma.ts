import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export function formatProduct(p: {
  id: string;
  slug: string;
  name: string;
  spec: string;
  price: number;
  originalPrice: number | null;
  salePercent: number | null;
  image: string;
  images: string[];
  menh: string[];
  description: string | null;
  fengShuiMeaning: string | null;
  sku: string | null;
  stock: number;
  rating: number;
  reviewCount: number;
  specs: unknown;
  isNew: boolean;
  isHot: boolean;
  category: { slug: string; name: string };
}) {
  return {
    id: p.slug,
    slug: p.slug,
    dbId: p.id,
    name: p.name,
    spec: p.spec,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    salePercent: p.salePercent ?? undefined,
    image: p.image,
    images: p.images,
    menh: p.menh,
    description: p.description ?? undefined,
    fengShuiMeaning: p.fengShuiMeaning ?? undefined,
    sku: p.sku ?? undefined,
    stock: p.stock,
    rating: p.rating,
    reviewCount: p.reviewCount,
    specs: p.specs as Record<string, string> | undefined,
    isNew: p.isNew,
    isHot: p.isHot,
    category: p.category.name,
    categorySlug: p.category.slug,
  };
}
