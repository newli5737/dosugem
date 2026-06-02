
# DOSU Gem — Website Bán Đá Quý Phong Thủy

Website e-commerce cao cấp với CMS quản lý bán hàng (Prisma + PostgreSQL).

## Yêu cầu

- Node.js 18+
- PostgreSQL (database: `dosugem`, user: `postgres`, password: `test1234`)

## Cài đặt

```bash
npm install
npm run db:setup    # tạo bảng + seed dữ liệu mẫu
npm run dev         # chạy frontend (5173) + API (3001)
```

## Truy cập

| URL | Mô tả |
|-----|-------|
| http://localhost:5173 | Website bán hàng |
| http://localhost:5173/admin | CMS quản trị |
| http://localhost:3001/api/health | API health check |

## CMS Admin

- **URL:** `/admin/dang-nhap`
- **Email:** `admin@dosugem.site`
- **Password:** `admin123`

### Tính năng CMS

- Dashboard thống kê (sản phẩm, đơn hàng, doanh thu)
- CRUD sản phẩm, danh mục
- Quản lý đơn hàng & cập nhật trạng thái
- Quản lý mã giảm giá (mặc định: `DOSU5` — giảm 5%)

## Cấu hình (.env)

```
DATABASE_URL="postgresql://postgres:test1234@localhost:5432/dosugem?schema=public"
JWT_SECRET="dosugem-jwt-secret-change-in-production"
ADMIN_EMAIL="admin@dosugem.site"
ADMIN_PASSWORD="admin123"
PORT=3001
```

## Liên hệ

**CÔNG TY TNHH THƯƠNG MẠI & DỊCH VỤ DOSU**

Số 03, Ngách 72/59 Đường Tây Mỗ, Phường Tây Mỗ, TP Hà Nội  
0346 437 915 (Lại Thế Ngọc) · support@dosutech.site
