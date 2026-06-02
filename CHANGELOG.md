# Changelog — DOSU Gem

Tài liệu thay đổi thủ công. Mọi mục ghi theo thời gian triển khai thực tế.

---

## [1.2.0] — 2026-06-02

### Deploy / Hạ tầng

- PM2 `dosugem-api`: **`exec_mode: fork`** + interpreter `tsx` (fix crash loop cluster mode).
- Certbot hướng dẫn **DNS TXT thủ công** (`--preferred-challenges dns`), không dùng `certbot --nginx`.
- Bổ sung hướng dẫn gắn SSL nginx thủ công sau khi có cert.

---

## [1.1.0] — 2026-06-02

### Deploy / Hạ tầng

- Chuyển đường dẫn triển khai từ `/var/www/dosugem` → **`/home/dosugem`** (đồng bộ với các project DOSU khác trên VPS).
- Nginx config chỉ **HTTP :80** trước khi chạy certbot (bỏ block SSL tĩnh gây lỗi cert chưa tồn tại).
- PM2 log chuyển sang **`/home/logs/dosugem/`**.
- Cập nhật `deploy/DEPLOY.md` — hướng dẫn clone, nginx, PM2, certbot từng bước.
- CORS API cho phép cả `http://` và `https://` origin `dosugem.dosutech.site`.

### Sửa lỗi

- **nginx: cannot load certificate** — do file config cũ tham chiếu `/etc/letsencrypt/live/...` trước khi certbot chạy. Fix: pull bản config HTTP-only rồi `certbot --nginx` sau.

---

## [1.0.0] — 2026-06-02

### Thương hiệu

- Đổi tên **ROXI** → **DOSU Gem** toàn bộ UI, title, footer, giỏ hàng.
- Mã giảm giá demo: `ROXI5` → **`DOSU5`** (giảm 5%).
- localStorage key: `dosugem-cart`, `dosugem-wishlist`.

### Liên hệ (footer)

- **CÔNG TY TNHH THƯƠNG MẠI & DỊCH VỤ DOSU**
- Số 03, Ngách 72/59 Đường Tây Mỗ, Phường Tây Mỗ, TP Hà Nội
- 0346 437 915 (Lại Thế Ngọc)
- support@dosutech.site

### Website e-commerce (Frontend)

- Trang chủ: hero, tra cứu mệnh ngũ hành, danh mục, sản phẩm mới, flash sale, blog.
- Danh mục: lọc mệnh / màu / giá, sắp xếp, phân trang.
- Chi tiết sản phẩm: gallery, specs, đánh giá, ý nghĩa phong thủy, sản phẩm liên quan.
- Giỏ hàng + checkout: COD / chuyển khoản, mã giảm giá, lưu đơn qua API.
- Tìm kiếm & danh sách yêu thích.
- React Router: URL thật (`/danh-muc`, `/san-pham/:slug`, `/gio-hang`, …).
- Responsive mobile + bottom navigation.
- Giao diện luxury: nền tối, accent vàng `#C9A84C`, font Cormorant Garamond + DM Sans.

### Backend API (Express + Prisma + PostgreSQL)

- Database: **`dosugem`** (PostgreSQL).
- Models: `Admin`, `Category`, `Product`, `Order`, `OrderItem`, `Coupon`, `BlogPost`.
- API public: products, categories, orders, validate coupon.
- API admin (JWT): CRUD sản phẩm, danh mục, đơn hàng, mã giảm giá, dashboard stats.
- Seed: 12 sản phẩm, 6 danh mục, 3 bài blog, mã `DOSU5`, admin mặc định.

### CMS Admin (`/admin`)

- Đăng nhập JWT.
- Dashboard: thống kê sản phẩm, đơn hàng, doanh thu.
- Quản lý sản phẩm (thêm / sửa / xóa).
- Quản lý danh mục.
- Quản lý đơn hàng & cập nhật trạng thái.
- Quản lý mã giảm giá.

**Tài khoản mặc định (seed):**

| | |
|---|---|
| Email | `admin@dosugem.site` |
| Password | `admin123` |

### Deploy ban đầu

- Nginx: `dosugem.dosutech.site` (frontend static), `api-dosugem.dosutech.site` (API).
- PM2 app: **`dosugem-api`**, port nội bộ **5081**.
- Build production: `VITE_API_URL=https://api-dosugem.dosutech.site npm run build`.
- Repo: [github.com/newli5737/dosugem](https://github.com/newli5737/dosugem).

---

## Ghi chú triển khai VPS

```bash
# Clone
cd /home && git clone https://github.com/newli5737/dosugem.git dosugem

# Thứ tự đúng
1. npm ci && npm run db:setup
2. VITE_API_URL=http://api-dosugem.dosutech.site npm run build
3. Copy nginx config (HTTP :80) → nginx -t → reload
4. pm2 start deploy/ecosystem.config.cjs
5. certbot --nginx -d dosugem.dosutech.site -d api-dosugem.dosutech.site
6. VITE_API_URL=https://api-dosugem.dosutech.site npm run build
```

Chi tiết đầy đủ: [`deploy/DEPLOY.md`](deploy/DEPLOY.md)

---

## Roadmap (dự kiến)

- [ ] Upload ảnh sản phẩm (S3 / local storage) thay URL Unsplash
- [ ] Quản lý blog trong CMS
- [ ] Email xác nhận đơn hàng
- [ ] Tích hợp VNPay / MoMo
- [ ] Đổi mật khẩu admin trong CMS
