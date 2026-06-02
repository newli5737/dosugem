# Triển khai DOSU Gem trên VPS (/home)

Phù hợp server đang dùng PM2 tại `/home` (dosubook, dosutech-api, ...).

| Dịch vụ | Domain | Chi tiết |
|---------|--------|----------|
| Frontend | `dosugem.dosutech.site` | Nginx HTTPS → `/home/dosugem/dist` |
| API | `api-dosugem.dosutech.site` | Nginx HTTPS → PM2 port **5081** |

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

# Build (HTTPS — sau khi đã có cert)
VITE_API_URL=https://api-dosugem.dosutech.site npm run build
```

---

## 4. Nginx — HTTP redirect + HTTPS (SSL)

File config trong repo **đã có SSL** trỏ cert Let's Encrypt. Cần **đã xin cert** (mục 6) trước khi `nginx -t`.

```bash
sudo cp /home/dosugem/deploy/nginx/dosugem.dosutech.site.conf /etc/nginx/sites-available/
sudo cp /home/dosugem/deploy/nginx/api-dosugem.site.conf /etc/nginx/sites-available/

sudo ln -sf /etc/nginx/sites-available/dosugem.dosutech.site.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/api-dosugem.site.conf /etc/nginx/sites-enabled/

sudo nginx -t
sudo systemctl reload nginx
```

Kiểm tra HTTPS:

```bash
curl -I https://dosugem.dosutech.site
curl https://api-dosugem.dosutech.site/api/health
curl https://api-dosugem.dosutech.site/api/products
```

---

## 5. PM2 — chạy API

```bash
mkdir -p /home/logs/dosugem
cd /home/dosugem
pm2 delete dosugem-api 2>/dev/null
pm2 start deploy/ecosystem.config.cjs
pm2 save
```

Kiểm tra:

```bash
pm2 list | grep dosugem
curl http://127.0.0.1:5081/api/health
curl http://127.0.0.1:5081/api/products
```

**PM2 crash loop (`↺` tăng liên tục, connection refused):**

```bash
pm2 logs dosugem-api --lines 50 --nostream
# Hoặc test tay:
cd /home/dosugem && node --import tsx server/index.ts
```

Config dùng **`exec_mode: fork`** + `tsx` interpreter (cluster mode hay crash với `.ts`).

---

## 6. Certbot — xin SSL thủ công (DNS TXT)

**Không dùng** `certbot --nginx`. Xác thực bằng **bản ghi TXT** trên DNS:

```bash
sudo certbot certonly --manual \
  --preferred-challenges dns \
  --agree-tos \
  --email support@dosutech.site \
  -d dosugem.dosutech.site \
  -d api-dosugem.dosutech.site
```

Certbot dừng lại, in kiểu:

```
Please deploy a DNS TXT record under the name:
_acme-challenge.dosugem.dosutech.site
with the following value:
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Làm trên DNS (Cloudflare / nhà cung cấp domain)

Thêm **2 bản ghi TXT** (certbot hỏi lần lượt từng domain):

| Type | Name / Host | Value |
|------|-------------|-------|
| TXT | `_acme-challenge.dosugem` | *(value certbot in)* |
| TXT | `_acme-challenge.api-dosugem` | *(value certbot in)* |

> Nếu panel DNS tự thêm suffix `.dosutech.site` thì Host chỉ cần `_acme-challenge.dosugem` hoặc `_acme-challenge.api-dosugem`.

Đợi DNS propagate (1–5 phút, Cloudflare thường nhanh), kiểm tra:

```bash
dig TXT _acme-challenge.dosugem.dosutech.site +short
dig TXT _acme-challenge.api-dosugem.dosutech.site +short
```

Thấy đúng value → quay lại terminal certbot, **Enter**. Lặp cho domain thứ 2 nếu certbot hỏi tiếp.

Cert nằm tại:

```
/etc/letsencrypt/live/dosugem.dosutech.site/fullchain.pem
/etc/letsencrypt/live/dosugem.dosutech.site/privkey.pem
```

> **Gia hạn:** `certbot renew` với `--manual` cần TXT lại mỗi lần — nên dùng plugin DNS (Cloudflare…) hoặc renew thủ công trước khi hết hạn 90 ngày.

### Áp nginx sau khi có cert

Config SSL nằm sẵn trong `deploy/nginx/*.conf`. Copy đè lên sites-available:

```bash
cd /home/dosugem
git pull origin main
sudo cp deploy/nginx/dosugem.dosutech.site.conf /etc/nginx/sites-available/
sudo cp deploy/nginx/api-dosugem.site.conf /etc/nginx/sites-available/
sudo nginx -t
sudo systemctl reload nginx
VITE_API_URL=https://api-dosugem.dosutech.site npm run build
pm2 restart dosugem-api
```

Gia hạn cert (cron certbot có sẵn):

```bash
sudo certbot renew --dry-run
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

sudo certbot certonly --manual --preferred-challenges dns \
  --agree-tos --email support@dosutech.site \
  -d dosugem.dosutech.site -d api-dosugem.dosutech.site

sudo cp deploy/nginx/*.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/dosugem.dosutech.site.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/api-dosugem.site.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

pm2 start deploy/ecosystem.config.cjs && pm2 save
VITE_API_URL=https://api-dosugem.dosutech.site npm run build
```
