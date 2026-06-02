# Triển khai DOSU Gem trên VPS (/home)

Phù hợp server đang dùng PM2 tại `/home` (dosubook, dosutech-api, ...).

| Dịch vụ | Domain | Chi tiết |
|---------|--------|----------|
| Frontend | `dosugem.dosutech.site` | Nginx serve `/home/dosugem/dist` |
| API | `api-dosugem.dosutech.site` | Nginx :80 → PM2 port **5081** |

---

## 0. DNS

Trỏ A record về IP VPS:

- `dosugem.dosutech.site`
- `api-dosugem.dosutech.site`

---

## 1. Clone về /home

```bash
cd /home
git clone https://github.com/newli5737/dosugem.git dosugem
cd /home/dosugem

mkdir -p /home/logs/dosugem
```

---

## 2. Cấu hình .env

```bash
cp .env.example .env
nano .env
```

```env
DATABASE_URL="postgresql://postgres:MAT_KHAU@localhost:5432/dosugem?schema=public"
JWT_SECRET="chuoi-bi-mat-dai"
ADMIN_EMAIL="admin@dosugem.site"
ADMIN_PASSWORD="mat-khau-admin-manh"
PORT=5081
```

Tạo DB (nếu chưa có):

```bash
sudo -u postgres psql -c "CREATE DATABASE dosugem;"
```

---

## 3. Cài dependency + DB + build

```bash
cd /home/dosugem
npm ci
npm run db:setup

# Build lần đầu (HTTP — trước certbot)
VITE_API_URL=http://api-dosugem.dosutech.site npm run build
```

---

## 4. Nginx — chỉ HTTP :80 trước

```bash
sudo cp /home/dosugem/deploy/nginx/dosugem.dosutech.site.conf /etc/nginx/sites-available/
sudo cp /home/dosugem/deploy/nginx/api-dosugem.site.conf /etc/nginx/sites-available/

sudo ln -sf /etc/nginx/sites-available/dosugem.dosutech.site.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/api-dosugem.site.conf /etc/nginx/sites-enabled/

sudo nginx -t
sudo systemctl reload nginx
```

Kiểm tra HTTP:

```bash
curl -I http://dosugem.dosutech.site
curl http://api-dosugem.dosutech.site/api/health
```

---

## 5. PM2 — chạy API

```bash
cd /home/dosugem
pm2 start deploy/ecosystem.config.cjs
pm2 save
```

Kiểm tra:

```bash
pm2 list | grep dosugem
curl http://127.0.0.1:5081/api/health
```

---

## 6. Certbot — xin SSL (sau khi HTTP OK)

```bash
sudo certbot --nginx \
  -d dosugem.dosutech.site \
  -d api-dosugem.dosutech.site
```

Certbot tự thêm block HTTPS vào 2 file nginx.

**Sau certbot — build lại frontend với HTTPS:**

```bash
cd /home/dosugem
VITE_API_URL=https://api-dosugem.dosutech.site npm run build
# không cần restart nginx — dist/ được serve lại tự động
pm2 restart dosugem-api
```

---

## 7. Truy cập

| URL | Mô tả |
|-----|-------|
| https://dosugem.dosutech.site | Website |
| https://dosugem.dosutech.site/admin/dang-nhap | CMS |
| https://api-dosugem.dosutech.site/api/health | API |

CMS mặc định: `admin@dosugem.site` / `admin123` — **đổi ngay sau deploy**.

---

## 8. Cập nhật code

```bash
cd /home/dosugem
git pull
npm ci
npm run db:push          # nếu có migration schema mới
VITE_API_URL=https://api-dosugem.dosutech.site npm run build
pm2 restart dosugem-api
```

---

## Tóm tắt lệnh nhanh (copy-paste)

```bash
cd /home
git clone https://github.com/newli5737/dosugem.git dosugem
cd dosugem && mkdir -p /home/logs/dosugem
cp .env.example .env && nano .env
npm ci && npm run db:setup
VITE_API_URL=http://api-dosugem.dosutech.site npm run build

sudo cp deploy/nginx/*.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/dosugem.dosutech.site.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/api-dosugem.site.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

pm2 start deploy/ecosystem.config.cjs && pm2 save

# Khi HTTP OK → xin SSL:
sudo certbot --nginx -d dosugem.dosutech.site -d api-dosugem.dosutech.site
VITE_API_URL=https://api-dosugem.dosutech.site npm run build
```
