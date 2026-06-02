import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const U = 'https://images.unsplash.com/';

const categories = [
  { slug: 'qua-cau', name: 'Quả Cầu Thạch Anh', image: U + 'photo-1676721681490-9690e275a62e', sortOrder: 1 },
  { slug: 'tuong-phat', name: 'Tượng Phật', image: U + 'photo-1546162290-8687d72f3cfd', sortOrder: 2 },
  { slug: 'trang-suc', name: 'Trang Sức', image: U + 'photo-1639660680736-14b79f169a27', sortOrder: 3 },
  { slug: 'vat-pham', name: 'Vật Phẩm Phong Thủy', image: U + 'photo-1676721685340-d34d813dfccb', sortOrder: 4 },
  { slug: 'linh-vat', name: 'Linh Vật', image: U + 'photo-1574097493552-3ae22b108b8c', sortOrder: 5 },
  { slug: 'qua-tang', name: 'Quà Tặng Cao Cấp', image: U + 'photo-1762795649878-3f3cf269d7e5', sortOrder: 6 },
];

const products = [
  { slug: 'qua-cau-thach-anh-tim-1-8kg', name: 'Quả Cầu Thạch Anh Tím Cao Cấp 1.8kg', spec: '1,8kg · 10,2cm', price: 4200000, originalPrice: 5400000, salePercent: 22, image: U + 'photo-1521133573892-e44906baee46', images: [U + 'photo-1521133573892-e44906baee46', U + 'photo-1654216937627-11728b27bed3'], menh: ['Kim', 'Thủy'], categorySlug: 'qua-cau', sku: 'CTAT001', stock: 5, rating: 4.9, reviewCount: 89, description: 'Quả cầu thạch anh tím amethyst từ Brazil, màu tím đậm tự nhiên.', fengShuiMeaning: 'Thạch anh tím giúp thanh lọc tâm trí và tăng cường trực giác.', specs: { 'Loại đá': 'Thạch Anh Tím', 'Cân nặng': '1,8 kg', 'Đường kính': '10,2 cm', 'Xuất xứ': 'Brazil' } },
  { slug: 'qua-cau-obsidian-den-2-59kg', name: 'Quả Cầu Obsidian Đen Brazil 2.59kg', spec: '2,59kg · 12,4cm', price: 3100000, originalPrice: 3780000, salePercent: 18, image: U + 'photo-1596226310268-f76b50d14a4a', images: [U + 'photo-1596226310268-f76b50d14a4a'], menh: ['Thủy', 'Mộc'], categorySlug: 'qua-cau', sku: 'CTAD0672', stock: 3, rating: 4.9, reviewCount: 127, isHot: true, description: 'Obsidian từ Brazil — đá phong thủy mạnh nhất.', fengShuiMeaning: 'Hấp thụ năng lượng tiêu cực, bảo vệ chủ nhân.', specs: { 'Loại đá': 'Obsidian', 'Cân nặng': '2,59 kg', 'Đường kính': '12,4 cm' } },
  { slug: 'qua-cau-rose-quartz', name: 'Quả Cầu Thạch Anh Hồng Rose Quartz', spec: '1,2kg · 8,8cm', price: 2600000, image: U + 'photo-1728234553997-f71b87a44e13', menh: ['Hỏa'], categorySlug: 'qua-cau', sku: 'CTAH003', stock: 8, isNew: true, rating: 4.8, reviewCount: 45 },
  { slug: 'tuong-phat-a-di-da', name: 'Tượng Phật A Di Đà Thạch Anh Trắng', spec: '32cm · 1,5kg', price: 8900000, image: U + 'photo-1546162290-8687d72f3cfd', menh: ['Kim'], categorySlug: 'tuong-phat', sku: 'TPAD001', stock: 2, isNew: true, rating: 5.0, reviewCount: 23 },
  { slug: 'nhan-thach-anh-tim-vang-18k', name: 'Nhẫn Thạch Anh Tím Bọc Vàng 18k', spec: 'Size 15–20', price: 1850000, originalPrice: 2200000, salePercent: 16, image: U + 'photo-1639660680736-14b79f169a27', menh: ['Kim', 'Thủy'], categorySlug: 'trang-suc', sku: 'TSNT001', stock: 12, rating: 4.7, reviewCount: 56 },
  { slug: 'long-quy-mat-ho', name: 'Long Quy Đá Mắt Hổ Phong Thủy', spec: '15cm · 0,8kg', price: 1200000, image: U + 'photo-1574097493552-3ae22b108b8c', menh: ['Thổ', 'Hỏa'], categorySlug: 'linh-vat', sku: 'LVLQ001', stock: 6, isNew: true, rating: 4.8, reviewCount: 34 },
  { slug: 'qua-cau-labradorite-1-5kg', name: 'Quả Cầu Labradorite Cầu Vồng 1.5kg', spec: '1,5kg · 9,6cm', price: 5800000, originalPrice: 7200000, salePercent: 19, image: U + 'photo-1654216937627-11728b27bed3', menh: ['Mộc'], categorySlug: 'qua-cau', sku: 'CTLB001', stock: 4, isHot: true, rating: 4.9, reviewCount: 67 },
  { slug: 'vong-tay-thach-anh-den', name: 'Vòng Tay Thạch Anh Đen 8mm · 20 hạt', spec: '8mm · Size 16–20', price: 680000, image: U + 'photo-1562162115-54cc44600875', menh: ['Thủy', 'Mộc'], categorySlug: 'trang-suc', sku: 'TSVT001', stock: 25, rating: 4.6, reviewCount: 112 },
  { slug: 'qua-cau-thach-anh-trang-3kg', name: 'Quả Cầu Thạch Anh Trắng 3kg', spec: '3kg · 14cm', price: 6500000, originalPrice: 7800000, salePercent: 17, image: U + 'photo-1676721685340-d34d813dfccb', menh: ['Kim'], categorySlug: 'qua-cau', sku: 'CTAT002', stock: 2, rating: 4.9, reviewCount: 41 },
  { slug: 'tuong-quan-am-hong', name: 'Tượng Quan Âm Thạch Anh Hồng', spec: '28cm · 1,2kg', price: 7200000, image: U + 'photo-1546162290-8687d72f3cfd', menh: ['Hỏa', 'Thổ'], categorySlug: 'tuong-phat', sku: 'TPQA001', stock: 3, isNew: true, rating: 5.0, reviewCount: 18 },
  { slug: 'binh-loc-thuy-xanh', name: 'Bình Lộc Thủy Thạch Anh Xanh', spec: '20cm · 1kg', price: 4500000, image: U + 'photo-1676721681490-9690e275a62e', menh: ['Mộc', 'Thủy'], categorySlug: 'vat-pham', sku: 'VPBL001', stock: 5, rating: 4.7, reviewCount: 29 },
  { slug: 'hop-qua-da-phong-thuy', name: 'Hộp Quà Đá Phong Thủy Cao Cấp', spec: 'Set 5 món', price: 3500000, originalPrice: 4200000, salePercent: 17, image: U + 'photo-1762795649878-3f3cf269d7e5', menh: ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'], categorySlug: 'qua-tang', sku: 'QT001', stock: 10, isNew: true, rating: 4.8, reviewCount: 38 },
];

const blogs = [
  { slug: 'thach-anh-den-la-chan', category: 'PHONG THỦY', title: 'Thạch Anh Đen: Lá Chắn Năng Lượng Tiêu Cực', excerpt: 'Công dụng bảo vệ vượng khí của obsidian trong phong thủy.', image: U + 'photo-1596226310268-f76b50d14a4a' },
  { slug: 'phan-biet-thach-anh-tim', category: 'KIẾN THỨC ĐÁ', title: 'Cách Phân Biệt Thạch Anh Tím Tự Nhiên và Giả', excerpt: 'Hướng dẫn kiểm tra tính xác thực của đá amethyst.', image: U + 'photo-1521133573892-e44906baee46' },
  { slug: 'menh-thuy-hop-da-gi', category: 'TƯ VẤN MỆNH', title: 'Mệnh Thủy Hợp Đá Gì? Tổng Hợp 2026', excerpt: 'Danh sách đá phong thủy tốt nhất cho người mệnh Thủy.', image: U + 'photo-1654216937627-11728b27bed3' },
];

async function main() {
  console.log('🌱 Seeding DOSU Gem database...');

  const email = process.env.ADMIN_EMAIL || 'admin@dosugem.site';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hash = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, password: hash, name: 'Admin DOSU Gem' },
  });

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, image: cat.image, sortOrder: cat.sortOrder },
      create: cat,
    });
  }

  const catMap = Object.fromEntries(
    (await prisma.category.findMany()).map(c => [c.slug, c.id])
  );

  for (const p of products) {
    const { categorySlug, ...data } = p;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { ...data, categoryId: catMap[categorySlug], images: p.images ?? [p.image], specs: p.specs ?? undefined },
      create: { ...data, categoryId: catMap[categorySlug], images: p.images ?? [p.image], specs: p.specs ?? undefined },
    });
  }

  await prisma.coupon.upsert({
    where: { code: 'DOSU5' },
    update: {},
    create: { code: 'DOSU5', discountPercent: 5, active: true },
  });

  for (const b of blogs) {
    await prisma.blogPost.upsert({
      where: { slug: b.slug },
      update: b,
      create: b,
    });
  }

  console.log('✅ Seed completed!');
  console.log(`   Admin: ${email} / ${password}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
